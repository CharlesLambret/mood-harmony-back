import { UseCase } from '../base/use-case';
import { Session } from '../domain/model/Session';
import { SessionPhase } from '../domain/model/SessionPhase';
import { SessionRepository } from '../domain/repository/session.repository';
import { EmotionRepository } from '../domain/repository/emotion.repository';
import { UserGenrePreferenceRepository } from '../domain/repository/userGenrePreferences.repository';
import { TrackRepository } from '../domain/repository/track.repository';
import { userEmotionRepository } from '../domain/repository/user-emotion.repository';
import { User } from '../domain/model/User';
import { Emotion } from '../domain/model/Emotion';
import { Track } from '../domain/model/Track';
import { UserGenrePreference } from '../domain/model/UserGenrePreferences';
import { UserEmotion } from '../domain/model/UserEmotion';
import { EmotionNotFoundError } from '../domain/error/EmotionNotFoundError';

export type GenerateSessionCommand = {
  userId: number;
  emotionStartId: number;
  emotionEndId: number;
  duration: number; // 30, 45 ou 60 minutes
};

interface PhaseValues {
  genreId: number;
  bpm: number;
  speechiness: number;
  energy: number;
}

export class GenerateSessionUseCase implements UseCase<GenerateSessionCommand, Session> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userEmotionRepository: userEmotionRepository,
    private readonly userGenrePreferenceRepository: UserGenrePreferenceRepository,
    private readonly trackRepository: TrackRepository,
    private readonly emotionRepository: EmotionRepository,
  ) {}

  private async validateEmotions(startId: number, endId: number): Promise<[Emotion, Emotion]> {
    const startEmotion = await this.emotionRepository.findById(startId);
    const endEmotion = await this.emotionRepository.findById(endId);

    if (!startEmotion) {
      throw new EmotionNotFoundError(startId);
    }
    if (!endEmotion) {
      throw new EmotionNotFoundError(endId);
    }
    
    return [startEmotion, endEmotion];
  }

  private async getUserEmotions(userId: number, emotionIds: number[]): Promise<UserEmotion[]> {
    const userEmotionArr = await this.userEmotionRepository.findByUserIdAndEmotionIds(userId, emotionIds);
    
    if (!userEmotionArr || userEmotionArr.length !== emotionIds.length) {
        throw new Error('UserEmotions not found for one or both emotions');
    }

    return userEmotionArr;
}

  private async getBestGenrePreferences(userEmotions: UserEmotion[]): Promise<[UserGenrePreference, UserGenrePreference]> {
    const startUserEmotion = userEmotions[0];
    const endUserEmotion = userEmotions[1];

    // Récupérer le meilleur genre pour chaque UserEmotion
    const startBestGenre = await this.userGenrePreferenceRepository.findBestRatingByEmotion(startUserEmotion.id);
    const endBestGenre = await this.userGenrePreferenceRepository.findBestRatingByEmotion(endUserEmotion.id);

    if (!startBestGenre || !endBestGenre) {
      throw new Error('Best genre preferences not found for emotions');
    }

    return [startBestGenre, endBestGenre];
  }

  private async getCommonGenrePreferences(
    userEmotionIds: number[],
    limit: number,
    genreIDsToBan: number[] 
  ): Promise<UserGenrePreference[]> {
    console.log('Recherche des genres communs pour UserEmotions:', userEmotionIds, 'avec une limite de', limit);
    // Trouver les genres communs entre les deux UserEmotions
    const commonGenres = await this.userGenrePreferenceRepository.findCommonGenres(
      userEmotionIds, limit, genreIDsToBan
    );
    console.log('Genres communs trouvés:', commonGenres);
    return commonGenres;
  }

  private calculateIntermediatePhaseValues(
    startValues: PhaseValues,
    endValues: PhaseValues,
    phaseIndex: number,
    totalPhases: number
  ): PhaseValues {
    const ratio = phaseIndex / (totalPhases - 1);

    return {
      genreId: startValues.genreId, 
      bpm: Math.round(startValues.bpm + (endValues.bpm - startValues.bpm) * ratio),
      speechiness: Math.round(startValues.speechiness + (endValues.speechiness - startValues.speechiness) * ratio),
      energy: Math.round((startValues.energy + (endValues.energy - startValues.energy) * ratio) * 100) / 100
    };
  }

  private async generatePhases(
    numberOfPhases: number,
    totalDuration: number,
    startGenre: UserGenrePreference,
    endGenre: UserGenrePreference,
    commonGenres: UserGenrePreference[]
  ): Promise<SessionPhase[]> {
    const phases: SessionPhase[] = [];
    const phaseDuration = 15; // Max 15 minutes par phase

    const startValues: PhaseValues = {
      genreId: startGenre.genreId,
      bpm: startGenre.bpm,
      speechiness: startGenre.speechiness,
      energy: startGenre.energy
    };

    const endValues: PhaseValues = {
      genreId: endGenre.genreId,
      bpm: endGenre.bpm,
      speechiness: endGenre.speechiness,
      energy: endGenre.energy
    };

    for (let i = 0; i < numberOfPhases; i++) {
      let phaseValues: PhaseValues;

      if (i === 0) {
        phaseValues = startValues;
      } else if (i === numberOfPhases - 1) {
        phaseValues = endValues;
      } else {
        // Fallback si pas de genre commun
        let commonGenre = commonGenres.length > 0
          ? commonGenres[(i - 1) % commonGenres.length]
          : startGenre; // ou endGenre selon ta logique

        phaseValues = this.calculateIntermediatePhaseValues(
          {
            genreId: commonGenre.genreId,
            bpm: commonGenre.bpm,
            speechiness: commonGenre.speechiness,
            energy: commonGenre.energy
          },
          endValues,
          i,
          numberOfPhases
        );
      }

      const phase = await this.generateSinglePhase(
        i + 1,
        phaseDuration,
        phaseValues,
        startValues,
        endValues,
        numberOfPhases
      );
        phases.push(phase);
      }
      return phases;
    }

  private async generateSinglePhase(
    phaseNumber: number,
    phaseDuration: number,
    phaseValues: PhaseValues,
    startValues: PhaseValues,
    endValues: PhaseValues,
    totalPhases: number
  ): Promise<SessionPhase> {

    // Rechercher les tracks avec max 0.1 d'écart
    const tracks = await this.trackRepository.findByGenreWithCriteria(
      phaseValues.genreId,
      phaseValues.bpm,
      phaseValues.speechiness,
      phaseValues.energy,
      10, // 10% de tolérance maximum
      10 // Récupérer plus de tracks pour pouvoir les trier
    );


    // Trier les tracks selon la progression bpm/energy/speechiness
    const sortedTracks = this.sortTracksForProgression(tracks, startValues, endValues, phaseNumber, totalPhases);

    // Limiter à 5-6 tracks par phase
    const selectedTracks = sortedTracks.slice(0, Math.min(6, sortedTracks.length));

    // Calculer les valeurs de début et fin de phase pour la transition
    const progressRatio = (phaseNumber - 1) / (totalPhases - 1);
    const nextProgressRatio = Math.min(1, phaseNumber / (totalPhases - 1));

    const phaseStartValues = this.interpolateValues(startValues, endValues, progressRatio);
    const phaseEndValues = this.interpolateValues(startValues, endValues, nextProgressRatio);

    const phaseId = Date.now() + phaseNumber;
    const phaseIdNumber = Math.floor(phaseId % Number.MAX_SAFE_INTEGER);

    return new SessionPhase(
      phaseIdNumber,
      phaseNumber,
      phaseDuration,
      phaseStartValues.bpm,
      phaseEndValues.bpm,
      phaseStartValues.speechiness,
      phaseEndValues.speechiness,
      phaseStartValues.energy,
      phaseEndValues.energy,
      selectedTracks
    );
  }

  private sortTracksForProgression(
    tracks: Track[],
    startValues: PhaseValues,
    endValues: PhaseValues,
    phaseNumber: number,
    totalPhases: number
  ): Track[] {
    const progressRatio = (phaseNumber - 1) / (totalPhases - 1);
    
    return tracks.sort((a, b) => {
      // Calculer la distance par rapport à la progression souhaitée
      const targetBpm = startValues.bpm + (endValues.bpm - startValues.bpm) * progressRatio;
      const targetEnergy = startValues.energy + (endValues.energy - startValues.energy) * progressRatio;
      const targetSpeechiness = startValues.speechiness + (endValues.speechiness - startValues.speechiness) * progressRatio;

      const distanceA = Math.abs(a.bpm - targetBpm) + Math.abs(a.energy - targetEnergy) + Math.abs(a.speechiness - targetSpeechiness);
      const distanceB = Math.abs(b.bpm - targetBpm) + Math.abs(b.energy - targetEnergy) + Math.abs(b.speechiness - targetSpeechiness);

      return distanceA - distanceB;
    });
  }

  private interpolateValues(startValues: PhaseValues, endValues: PhaseValues, ratio: number): PhaseValues {
    return {
      genreId: startValues.genreId,
      bpm: Math.round(startValues.bpm + (endValues.bpm - startValues.bpm) * ratio),
      speechiness: Math.round(startValues.speechiness + (endValues.speechiness - startValues.speechiness) * ratio),
      energy: startValues.energy + (endValues.energy - startValues.energy) * ratio
    };
  }


  async execute(command: GenerateSessionCommand): Promise<Session> {
    const { userId, emotionStartId, emotionEndId, duration } = command;

    // 1. Validation des émotions
    const [startEmotion, endEmotion] = await this.validateEmotions(emotionStartId, emotionEndId);

    // 2. Calcul du nombre de phases (durée / 15)
    const numberOfPhases = Math.floor(duration / 15);

    if (numberOfPhases < 2) {
      throw new Error('La durée doit permettre au moins 2 phases (minimum 30 minutes)');
    }

    // 3. Récupération des UserEmotions correspondantes
    const userEmotions = await this.getUserEmotions(userId, [emotionStartId, emotionEndId]);
    console.log('UserEmotions récupérés:', userEmotions);

    // 3.1. AJOUT: Récupérer le userEmotionProfileId depuis le premier UserEmotion
    // Tous les UserEmotions d'un utilisateur devraient avoir le même userEmotionProfileId
    const userEmotionProfileId = userEmotions[0].userEmotionProfileId;
    
    if (!userEmotionProfileId) {
      throw new Error('UserEmotionProfileId not found for user');
    }

    // 4. Récupération des meilleurs genres pour start et end
    const [startBestGenre, endBestGenre] = await this.getBestGenrePreferences(userEmotions);
    console.log('Meilleurs genres récupérés:', startBestGenre, endBestGenre);

    // 5. Récupération des genres communs pour les phases intermédiaires
    const userEmotionIds = userEmotions.map(ue => ue.id);
    const limit = numberOfPhases - 2;
    const genreIDsToBan = [startBestGenre.genreId, endBestGenre.genreId];
    const commonGenres = await this.getCommonGenrePreferences(userEmotionIds, limit, genreIDsToBan);
    console.log('Genres communs récupérés:', commonGenres);
    
    if (numberOfPhases > 2 && commonGenres.length === 0) {
      console.warn('Aucun genre commun trouvé pour les phases intermédiaires, utilisation des genres de début et fin');
    }

    // 6. Génération des phases avec les tracks
    const phases = await this.generatePhases(
      numberOfPhases,
      duration,
      startBestGenre,
      endBestGenre,
      commonGenres
    );

    // 7. Création de la session avec le bon userEmotionProfileId
    const session = new Session(
      0,
      userEmotionProfileId, // ✅ CORRECTION: utiliser userEmotionProfileId au lieu de userId
      duration,
      startEmotion,
      endEmotion,
      phases
    );

    return this.sessionRepository.create(session);
  }
}