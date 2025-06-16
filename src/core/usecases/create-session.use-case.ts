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

    // 1. Pour chaque userEmotion, récupérer le genre avec le meilleur rating
    const bestGenres: UserGenrePreference[] = [];
    for (const userEmotion of userEmotions) {
      const bestGenre = await this.userGenrePreferenceRepository.findBestRatingByEmotion(userEmotion.id);
      if (bestGenre) {
        bestGenres.push(bestGenre);
      }
    }

    // 2. Récupérer les genres communs (nombre = durée/15 - 2)
    const commonGenresCount = Math.max(0, numberOfPhases - bestGenres.length);
    let commonGenres: UserGenrePreference[] = [];
    if (commonGenresCount > 0) {
      const userEmotionIds = userEmotions.map(ue => ue.id);
      commonGenres = await this.userGenrePreferenceRepository.findCommonGenres(userEmotionIds, commonGenresCount);

      // Exclure les genres déjà sélectionnés pour start/end
      const bestGenreIds = new Set(bestGenres.map(g => g.genreId));
      commonGenres = commonGenres.filter(g => !bestGenreIds.has(g.genreId));
    }

    // 3. Retourner la liste finale
    return {
    startGenre: bestGenres[0],
    endGenre: bestGenres[1] || bestGenres[0], // fallback si une seule émotion
    commonGenres
  };;
  }

  private async generatePhases(
  numberOfPhases: number, 
  totalDuration: number, 
  genrePrefObj: { startGenre: UserGenrePreference, endGenre: UserGenrePreference, commonGenres: UserGenrePreference[] }
  ): Promise<SessionPhase[]> {
    const phases: SessionPhase[] = [];
    const phaseDuration = Math.floor(totalDuration / numberOfPhases);

    // Construction de la séquence des genres pour chaque phase
    const genresForPhases: UserGenrePreference[] = [];
    genresForPhases.push(genrePrefObj.startGenre);
    for (let i = 0; i < numberOfPhases - 2; i++) {
      genresForPhases.push(genrePrefObj.commonGenres[i]);
    }
    genresForPhases.push(genrePrefObj.endGenre);

    for (let i = 1; i <= numberOfPhases; i++) {
      const phaseGenre = genresForPhases[i - 1];
      const phase = await this.generateSinglePhase(
        i, 
        phaseDuration, 
        [phaseGenre], // On passe un seul genre pour la phase
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
    console.log(`[PHASE ${phaseNumber}] progressRatio: ${progressRatio}, nombe de genres : ${genrePreferences.length}`);

    for (const genrePreference of genrePreferences) {
      console.log(`[PHASE ${phaseNumber}] Recherche de tracks pour genreId: ${genrePreference.genreId}, bpm: ${genrePreference.bpm}, speechiness: ${genrePreference.speechiness}, energy: ${genrePreference.energy}`);

      // 4 chansons avec maximum 10% de différence
      const similarTracks = await this.trackRepository.findByGenreWithCriteria(
        genrePreference.genreId,
        genrePreference.bpm,
        genrePreference.speechiness,
        genrePreference.energy,
        0.1, // 10% de tolérance
        4
      );
      console.log(`[PHASE ${phaseNumber}] Tracks similaires trouvés: ${similarTracks.length}`);
      tracks.push(...similarTracks);

      // 2 chansons avec transition progressive (50% d'écart max)
      console.log(`[PHASE ${phaseNumber}] Recherche de tracks de transition entre bpm: ${genrePreferences[0].bpm} -> ${genrePreferences[genrePreferences.length - 1].bpm}, speechiness: ${genrePreferences[0].speechiness} -> ${genrePreferences[genrePreferences.length - 1].speechiness}, energy: ${genrePreferences[0].energy} -> ${genrePreferences[genrePreferences.length - 1].energy}`);
      const transitionTracks = await this.trackRepository.findByGenreWithTransition(
        genrePreference.genreId,
        genrePreferences[0].bpm, // BPM de départ
        genrePreferences[genrePreferences.length - 1].bpm, // BPM d'arrivée
        genrePreferences[0].speechiness,
        genrePreferences[genrePreferences.length - 1].speechiness,
        genrePreferences[0].energy,
        genrePreferences[genrePreferences.length - 1].energy,
        0.5, // 50% d'écart max
        2
      );
      console.log(`[PHASE ${phaseNumber}] Tracks de transition trouvés: ${transitionTracks.length}`);
      tracks.push(...transitionTracks);
    }

    // Limiter à 5-6 musiques par phase
    const selectedTracks = this.selectTracksForPhase(tracks, 5, 6);

    // Calculer les valeurs de transition pour cette phase
    const startValues = this.calculatePhaseStartValues(genrePreferences, progressRatio);
    const endValues = this.calculatePhaseEndValues(genrePreferences, progressRatio);

    console.log(`[PHASE ${phaseNumber}] startValues: bpm=${startValues.bpm}, speechiness=${startValues.speechiness}, energy=${startValues.energy}`);
    console.log(`[PHASE ${phaseNumber}] endValues: bpm=${endValues.bpm}, speechiness=${endValues.speechiness}, energy=${endValues.energy}`);

    // Générer un ID unique pour la phase (par exemple, timestamp + phaseNumber)
    const phaseId = Date.now() + phaseNumber;
    const phaseIdNumber = Math.floor(phaseId % Number.MAX_SAFE_INTEGER);
    return new SessionPhase(
      phaseIdNumber, // ID généré
      phaseNumber,
      phaseDuration,
      startValues.bpm,
      endValues.bpm,
      startValues.speechiness,
      endValues.speechiness,
      startValues.energy,
      endValues.energy,
      await selectedTracks
    );
  }

  private async selectTracksForPhase(availableTracks: Track[], min: number, max: number): Promise<Track[]> {
    // Retirer les doublons
    const uniqueTracks = availableTracks.filter(
      (track, index, self) => self.findIndex(t => t.id === track.id) === index
    );
    console.log(`[DEBUG] Nombre total de tracks disponibles: ${availableTracks.length}`);
    console.log(`[DEBUG] Nombre de tracks uniques après filtrage: ${uniqueTracks.length}`);

    // Sélectionner aléatoirement entre min et max tracks
    const targetCount = Math.min(
      Math.max(min, Math.floor(Math.random() * (max - min + 1)) + min),
      uniqueTracks.length
    );
    console.log(`[DEBUG] Nombre de tracks à sélectionner pour la phase: ${targetCount}`);

    // Mélanger et sélectionner
    const shuffled = [...uniqueTracks].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, targetCount);

    // Afficher les IDs des tracks sélectionnés pour debug
    console.log(`[DEBUG] IDs des tracks sélectionnés:`, selected.map(t => t.id));

    return selected;
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
  async execute(command: GenerateSessionCommand): Promise<Session> {
    const { currentUser, emotionStartId, emotionEndId, duration } = command;

    // 1. Validation des émotions
    const [startEmotion, endEmotion] = await this.validateEmotions(emotionStartId, emotionEndId);

    // 2. Calcul du nombre de phases (durée / 15)
    const numberOfPhases = Math.floor(duration / 15);

    // 3. Récupération des UserEmotions correspondantes
    const userEmotions = await this.getUserEmotions(currentUser.id, [emotionStartId, emotionEndId]);

    // 4. Récupération des préférences de genre (nouvelle structure)
    const genrePrefObj = await this.getGenrePreferences(userEmotions, numberOfPhases);

    // 5. Génération des phases avec les tracks
    const phases = await this.generatePhases(numberOfPhases, duration, genrePrefObj);

    // 6. Création de la session
    const session = new Session(
      0,
      currentUser.id,
      duration,
      startEmotion,
      endEmotion,
      phases
    );

    return this.sessionRepository.create(session);
  }
}