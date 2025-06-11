import { UseCase } from '../base/use-case';
import { Session } from '../domain/model/Session';
import { SessionPhase } from '../domain/model/SessionPhase';
import { SessionRepository } from '../domain/repository/session.repository';
import { EmotionRepository } from '../domain/repository/emotion.repository';
import { UserGenrePreferenceRepository } from '../domain/repository/userGenrePreferences.repository';
import { TrackRepository } from '../domain/repository/track.repository';
import { userEmotionRepository } from '../domain/repository/userEmotion.repository';
import { User } from '../domain/model/User';
import { Emotion } from '../domain/model/Emotion';
import { Track } from '../domain/model/Track';
import { UserGenrePreference } from '../domain/model/UserGenrePreferences';

export type GenerateSessionCommand = {
  currentUser: Pick<User, 'id'>;
  emotionStartId: number;
  emotionEndId: number;
  duration: number; // 30, 45 ou 60 minutes
};

export class GenerateSessionUseCase implements UseCase<GenerateSessionCommand, Session> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userEmotionRepository: userEmotionRepository,
    private readonly userGenrePreferenceRepository: UserGenrePreferenceRepository,
    private readonly trackRepository: TrackRepository,
    private readonly emotionRepository: EmotionRepository,
  ) {}

  async execute(command: GenerateSessionCommand): Promise<Session> {
    const { currentUser, emotionStartId, emotionEndId, duration } = command;

    // 1. Validation des émotions
    const [startEmotion, endEmotion] = await this.validateEmotions(emotionStartId, emotionEndId);

    // 2. Calcul du nombre de phases (durée / 15)
    const numberOfPhases = Math.floor(duration / 15);
    
    // 3. Récupération des UserEmotions correspondantes
    const userEmotions = await this.getUserEmotions(currentUser.id, [emotionStartId, emotionEndId]);
    
    // 4. Récupération des préférences de genre
    const genrePreferences = await this.getGenrePreferences(userEmotions, numberOfPhases);
    
    // 5. Génération des phases avec les tracks
    const phases = await this.generatePhases(numberOfPhases, duration, genrePreferences);
    
    // 6. Création de la session
    const session = new Session(
      0, // ID sera généré par la DB
      currentUser.id, // Passer l'ID utilisateur (number)
      duration,
      startEmotion,
      endEmotion,
      phases
    );

    return this.sessionRepository.create(session);
  }

  private async validateEmotions(startId: number, endId: number): Promise<[Emotion, Emotion]> {
    const startEmotion = await this.emotionRepository.findById(startId);
    const endEmotion = await this.emotionRepository.findById(endId);

    if (!startEmotion || !endEmotion) {
      throw new Error('One or both emotions not found');
    }

    return [startEmotion, endEmotion];
  }

  private async getUserEmotions(userId: number, emotionIds: number[]) {
    // Vous devrez implémenter cette méthode dans votre userEmotionRepository
    return this.userEmotionRepository.findByUserIdAndEmotionIds(userId, emotionIds);
  }

  private async getGenrePreferences(userEmotions: any[], numberOfPhases: number) {
    const preferences: UserGenrePreference[] = [];
    
    // Récupérer le genre avec le meilleur rating pour chaque émotion
    for (const userEmotion of userEmotions) {
      const bestGenre = await this.userGenrePreferenceRepository.findBestRatingByEmotion(userEmotion.id);
      if (bestGenre) {
        preferences.push(bestGenre);
      }
    }

    // Récupérer les genres communs (nombre = durée/15 - 2)
    const commonGenresCount = Math.max(0, numberOfPhases - 2);
    if (commonGenresCount > 0) {
      const userEmotionIds = userEmotions.map(ue => ue.id);
      const commonGenres = await this.userGenrePreferenceRepository.findCommonGenres(
        userEmotionIds, 
        commonGenresCount
      );
      preferences.push(...commonGenres);
    }

    return preferences;
  }

  private async generatePhases(
    numberOfPhases: number, 
    totalDuration: number, 
    genrePreferences: UserGenrePreference[]
  ): Promise<SessionPhase[]> {
    const phases: SessionPhase[] = [];
    const phaseDuration = Math.floor(totalDuration / numberOfPhases);

    for (let i = 1; i <= numberOfPhases; i++) {
      const phase = await this.generateSinglePhase(
        i, 
        phaseDuration, 
        genrePreferences, 
        numberOfPhases
      );
      phases.push(phase);
    }

    return phases;
  }

  private async generateSinglePhase(
    phaseNumber: number, 
    phaseDuration: number, 
    genrePreferences: UserGenrePreference[],
    totalPhases: number
  ): Promise<SessionPhase> {
    const tracks: Track[] = [];
    
    // Calculer la progression entre les émotions de départ et d'arrivée
    const progressRatio = (phaseNumber - 1) / (totalPhases - 1);
    
    for (const genrePreference of genrePreferences) {
      // 4 chansons avec maximum 10% de différence
      const similarTracks = await this.trackRepository.findByGenreWithCriteria(
        genrePreference.genre.id,
        genrePreference.bpm,
        genrePreference.speechiness,
        genrePreference.energy,
        0.1, // 10% de tolérance
        4
      );
      tracks.push(...similarTracks);

      // 2 chansons avec transition progressive (50% d'écart max)
      const transitionTracks = await this.trackRepository.findByGenreWithTransition(
        genrePreference.genre.id,
        genrePreferences[0].bpm, // BPM de départ
        genrePreferences[genrePreferences.length - 1].bpm, // BPM d'arrivée
        genrePreferences[0].speechiness,
        genrePreferences[genrePreferences.length - 1].speechiness,
        genrePreferences[0].energy,
        genrePreferences[genrePreferences.length - 1].energy,
        0.5, // 50% d'écart max
        2
      );
      tracks.push(...transitionTracks);
    }

    // Limiter à 5-6 musiques par phase
    const selectedTracks = this.selectTracksForPhase(tracks, 5, 6);

    // Calculer les valeurs de transition pour cette phase
    const startValues = this.calculatePhaseStartValues(genrePreferences, progressRatio);
    const endValues = this.calculatePhaseEndValues(genrePreferences, progressRatio);

    return new SessionPhase(
      0, // ID sera généré
      0, // sessionId sera défini plus tard
      phaseNumber,
      phaseDuration,
      startValues.bpm,
      endValues.bpm,
      startValues.speechiness,
      endValues.speechiness,
      startValues.energy,
      endValues.energy,
      selectedTracks
    );
  }

  private selectTracksForPhase(availableTracks: Track[], min: number, max: number): Track[] {
    // Retirer les doublons
    const uniqueTracks = availableTracks.filter(
      (track, index, self) => self.findIndex(t => t.id === track.id) === index
    );

    // Sélectionner aléatoirement entre min et max tracks
    const targetCount = Math.min(
      Math.max(min, Math.floor(Math.random() * (max - min + 1)) + min),
      uniqueTracks.length
    );

    // Mélanger et sélectionner
    const shuffled = [...uniqueTracks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, targetCount);
  }

  private calculatePhaseStartValues(preferences: UserGenrePreference[], progressRatio: number) {
    // Calculer les valeurs de départ en interpolant entre les préférences
    const startPreference = preferences[0];
    const endPreference = preferences[preferences.length - 1];

    return {
      bpm: Math.round(startPreference.bpm + (endPreference.bpm - startPreference.bpm) * progressRatio),
      speechiness: Math.round(startPreference.speechiness + (endPreference.speechiness - startPreference.speechiness) * progressRatio),
      energy: startPreference.energy + (endPreference.energy - startPreference.energy) * progressRatio
    };
  }

  private calculatePhaseEndValues(preferences: UserGenrePreference[], progressRatio: number) {
    // Calculer les valeurs de fin pour la phase suivante
    const nextProgressRatio = Math.min(1, progressRatio + (1 / (preferences.length - 1)));
    return this.calculatePhaseStartValues(preferences, nextProgressRatio);
  }
}