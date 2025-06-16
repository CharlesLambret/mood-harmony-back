import { GenerateSessionUseCase } from '../create-session.use-case';
import { createMockEmotions } from '../../../adapters/in-memory/mocks/emotions';
import { createMockGenres } from '../../../adapters/in-memory/mocks/genres';
import { createMockUserGenrePreferences } from '../../../adapters/in-memory/mocks/user-genre-preferences';
import { createMockTracks } from '../../../adapters/in-memory/mocks/tracks';
import { createMockUser } from '../../../adapters/in-memory/mocks/user';
import { createMockUserEmotion } from '../../../adapters/in-memory/mocks/user-emotion';
import { InMemorySessionRepository } from '../../../adapters/in-memory/in-memory-session.repository';

describe('GenerateSessionUseCase', () => {
  let sessionRepository: InMemorySessionRepository;
  let useCase: GenerateSessionUseCase;
  let tracks, trackRepository;
  let genre1, genre2, genre3, genre4, genre5, genreRepository;
  let startEmotion, endEmotion, emotionRepository;
  let userGenrePreferences, userGenrePreferencesRepository;
  let startUserEmotion, endUserEmotion, userEmotions, userEmotionRepository;
  let user;

  beforeEach(async () => {
    sessionRepository = new InMemorySessionRepository();

    // Tracks
    const tracksFunction = await createMockTracks();
    trackRepository = tracksFunction.trackRepository;
    tracks = tracksFunction.tracks;

    // Genres
    const genres = await createMockGenres();
    genre1 = genres.genre1;
    genre2 = genres.genre2;
    genre3 = genres.genre3;
    genre4 = genres.genre4;
    genre5 = genres.genre5;
    genreRepository = genres.genreRepository;

    // Emotions
    const emotions = await createMockEmotions();
    startEmotion = emotions.startEmotion;
    endEmotion = emotions.endEmotion;
    emotionRepository = emotions.emotionRepository;

    // UserGenrePreferences
    const userGenrePreferencesMock = await createMockUserGenrePreferences();
    userGenrePreferences = userGenrePreferencesMock.userGenrePreferences;
    userGenrePreferencesRepository = userGenrePreferencesMock.userGenrePreferencesRepository;

    // UserEmotion
    const userEmotionMock = await createMockUserEmotion();
    startUserEmotion = userEmotionMock.startUserEmotion;
    endUserEmotion = userEmotionMock.endUserEmotion;
    userEmotions = userEmotionMock.userEmotions;
    userEmotionRepository = userEmotionMock.userEmotionRepository;

    // User
    user = await createMockUser();

    useCase = new GenerateSessionUseCase(
      sessionRepository,
      userEmotionRepository,
      userGenrePreferencesRepository,
      trackRepository,
      emotionRepository,
    );
  });

  describe('validateEmotions', () => {
    it('should return both emotions if found', async () => {
      const result = await (useCase as any).validateEmotions(startEmotion.id, endEmotion.id);
      expect(result).toEqual([startEmotion, endEmotion]);
    });

    it('should throw if one emotion is missing', async () => {
      await expect((useCase as any).validateEmotions(999, 1000)).rejects.toThrow('One or both emotions not found');
    });
  });

  // Alternative: Fix the test to match current implementation
  describe('getUserEmotions', () => {
    it('should return UserEmotions for given user and emotion IDs', async () => {
      // Mock to return an array containing both UserEmotions
      jest.spyOn(userEmotionRepository, 'findByUserIdAndEmotionIds')
        .mockResolvedValue([startUserEmotion, endUserEmotion]);

      const result = await (useCase as any).getUserEmotions(1, [startEmotion.id, endEmotion.id]);
      
      expect(result).toEqual([startUserEmotion, endUserEmotion]);
      expect(userEmotionRepository.findByUserIdAndEmotionIds).toHaveBeenCalledWith(1, [startEmotion.id, endEmotion.id]);
    });

    it('should throw if UserEmotions are not found', async () => {
      jest.spyOn(userEmotionRepository, 'findByUserIdAndEmotionIds').mockResolvedValue([]);

      await expect((useCase as any).getUserEmotions(1, [startEmotion.id, endEmotion.id]))
        .rejects.toThrow('UserEmotions not found for one or both emotions');
    });
  });

  describe('getBestGenrePreferences', () => {
    it('should return best genre preferences for start and end emotions', async () => {
      const startBestGenre = userGenrePreferences.find(ugp => ugp.useremotionId === 1 && ugp.rating === 5);
      const endBestGenre = userGenrePreferences.find(ugp => ugp.useremotionId === 2 && ugp.rating === 5);

      jest.spyOn(userGenrePreferencesRepository, 'findBestRatingByEmotion')
        .mockResolvedValueOnce(startBestGenre)
        .mockResolvedValueOnce(endBestGenre);

      const result = await (useCase as any).getBestGenrePreferences([startUserEmotion, endUserEmotion]);

      expect(result).toEqual([startBestGenre, endBestGenre]);
    });

    it('should throw if best genre preferences are not found', async () => {
      jest.spyOn(userGenrePreferencesRepository, 'findBestRatingByEmotion').mockResolvedValue(null);

      await expect((useCase as any).getBestGenrePreferences([startUserEmotion, endUserEmotion]))
        .rejects.toThrow('Best genre preferences not found for emotions');
    });
  });

  describe('getCommonGenrePreferences', () => {
    it('should return common genre preferences between two UserEmotions', async () => {
      const commonGenres = userGenrePreferences.filter(ugp => ugp.genreId === 3); // Jazz est commun

      jest.spyOn(userGenrePreferencesRepository, 'findCommonGenres')
        .mockResolvedValue(commonGenres);

      const result = await (useCase as any).getCommonGenrePreferences(startUserEmotion.id, endUserEmotion.id);

      expect(result).toEqual(commonGenres);
      expect(userGenrePreferencesRepository.findCommonGenres)
      .toHaveBeenCalledWith([startUserEmotion.id, endUserEmotion.id], 3);
    });
  });

  describe('calculateIntermediatePhaseValues', () => {
    it('should calculate intermediate values correctly', () => {
      const startValues = { genreId: 1, bpm: 120, speechiness: 10, energy: 0.8 };
      const endValues = { genreId: 2, bpm: 140, speechiness: 20, energy: 0.9 };

      const result = (useCase as any).calculateIntermediatePhaseValues(startValues, endValues, 1, 3);

      expect(result.bpm).toBe(130); // 120 + (140-120) * 0.5
      expect(result.speechiness).toBe(15); // 10 + (20-10) * 0.5
      expect(result.energy).toBe(0.85); // 0.8 + (0.9-0.8) * 0.5
      expect(result.genreId).toBe(1); // Genre reste le même
    });
  });

  describe('generatePhases', () => {
    it('should generate the correct number of phases', async () => {
      const startBestGenre = userGenrePreferences.find(ugp => ugp.useremotionId === 1 && ugp.rating === 5);
      const endBestGenre = userGenrePreferences.find(ugp => ugp.useremotionId === 2 && ugp.rating === 5);
      const commonGenres = userGenrePreferences.filter(ugp => ugp.genreId === 3);

      jest.spyOn(useCase as any, 'generateSinglePhase').mockResolvedValue({
        id: 1,
        phaseNumber: 1,
        duration: 15,
        startBpm: 120,
        endBpm: 125,
        startSpeechiness: 10,
        endSpeechiness: 12,
        startEnergy: 0.8,
        endEnergy: 0.82,
        tracks: []
      });

      const result = await (useCase as any).generatePhases(3, 45, startBestGenre, endBestGenre, commonGenres);

      expect(result.length).toBe(3);
      expect((useCase as any).generateSinglePhase).toHaveBeenCalledTimes(3);
    });
  });

  describe('generateSinglePhase', () => {
    it('should generate a single phase with tracks', async () => {
      const phaseValues = { genreId: 1, bpm: 120, speechiness: 10, energy: 0.8 };
      const startValues = { genreId: 1, bpm: 120, speechiness: 10, energy: 0.8 };
      const endValues = { genreId: 2, bpm: 140, speechiness: 20, energy: 0.9 };

      jest.spyOn(trackRepository, 'findByGenreWithCriteria').mockResolvedValue(tracks.slice(0, 3));
      jest.spyOn(useCase as any, 'sortTracksForProgression').mockReturnValue(tracks.slice(0, 3));

      const result = await (useCase as any).generateSinglePhase(
        1, 15, phaseValues, startValues, endValues, 3
      );

      expect(trackRepository.findByGenreWithCriteria).toHaveBeenCalledWith(1, 120, 10, 0.8, 0.1, 10);
      expect(result.tracks.length).toBeGreaterThan(0);
      expect(result.phaseNumber).toBe(1);
      expect(result.duration).toBe(15);
    });
  });

  describe('sortTracksForProgression', () => {
    it('should sort tracks according to progression', () => {
      const phaseValues = { genreId: 1, bpm: 120, speechiness: 10, energy: 0.8 };
      const startValues = { genreId: 1, bpm: 120, speechiness: 10, energy: 0.8 };
      const endValues = { genreId: 2, bpm: 140, speechiness: 20, energy: 0.9 };

      const result = (useCase as any).sortTracksForProgression(
        tracks.slice(0, 3), startValues, endValues, 1, 3
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });
  });

  describe('execute', () => {
    it('should create a session with correct phases and tracks', async () => {
      const command = {
        currentUser: { id: 1 },
        emotionStartId: startEmotion.id,
        emotionEndId: endEmotion.id,
        duration: 30
      };

      // FIX: Mock to return an array containing both UserEmotions
      jest.spyOn(userEmotionRepository, 'findByUserIdAndEmotionIds')
        .mockResolvedValue([startUserEmotion, endUserEmotion]); // Return array, not individual calls

      const startBestGenre = userGenrePreferences.find(ugp => ugp.useremotionId === 1 && ugp.rating === 5);
      const endBestGenre = userGenrePreferences.find(ugp => ugp.useremotionId === 2 && ugp.rating === 5);
      const commonGenres = userGenrePreferences.filter(ugp => ugp.genreId === 3);

      jest.spyOn(userGenrePreferencesRepository, 'findBestRatingByEmotion')
        .mockResolvedValueOnce(startBestGenre)
        .mockResolvedValueOnce(endBestGenre);

      jest.spyOn(userGenrePreferencesRepository, 'findCommonGenres')
        .mockResolvedValue(commonGenres);

      jest.spyOn(trackRepository, 'findByGenreWithCriteria').mockResolvedValue(tracks.slice(0, 3));

      const session = await useCase.execute(command);

      expect(session).toBeDefined();
      expect(session.phases.length).toBe(Math.floor(command.duration / 15)); // 2 phases pour 30 minutes
      expect(session.fromEmotion).toEqual(startEmotion);
      expect(session.toEmotion).toEqual(endEmotion);
      expect(session.duration).toBe(30);
    });

    it('should throw if duration is too short', async () => {
      const command = {
        currentUser: { id: 1 },
        emotionStartId: startEmotion.id,
        emotionEndId: endEmotion.id,
        duration: 15 // Seulement 15 minutes = 1 phase
      };

      await expect(useCase.execute(command)).rejects.toThrow('La durée doit permettre au moins 2 phases (minimum 30 minutes)');
    });

    it('should throw if emotions are not found', async () => {
      const command = {
        currentUser: { id: 1 },
        emotionStartId: 999,
        emotionEndId: 1000,
        duration: 30
      };

      await expect(useCase.execute(command)).rejects.toThrow('One or both emotions not found');
    });

    it('should handle cases with no common genres', async () => {
      const command = {
        currentUser: { id: 1 },
        emotionStartId: startEmotion.id,
        emotionEndId: endEmotion.id,
        duration: 45 // 3 phases
      };

      // FIX: Mock to return an array containing both UserEmotions
      jest.spyOn(userEmotionRepository, 'findByUserIdAndEmotionIds')
        .mockResolvedValue([startUserEmotion, endUserEmotion]); // Return array, not individual calls

      const startBestGenre = userGenrePreferences.find(ugp => ugp.useremotionId === 1 && ugp.rating === 5);
      const endBestGenre = userGenrePreferences.find(ugp => ugp.useremotionId === 2 && ugp.rating === 5);

      jest.spyOn(userGenrePreferencesRepository, 'findBestRatingByEmotion')
        .mockResolvedValueOnce(startBestGenre)
        .mockResolvedValueOnce(endBestGenre);

      jest.spyOn(userGenrePreferencesRepository, 'findCommonGenres')
        .mockResolvedValue([]); // Aucun genre commun

      jest.spyOn(trackRepository, 'findByGenreWithCriteria').mockResolvedValue(tracks.slice(0, 3));

      const session = await useCase.execute(command);

      expect(session).toBeDefined();
      expect(session.phases.length).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle empty tracks gracefully', async () => {
      const phaseValues = { genreId: 1, bpm: 120, speechiness: 10, energy: 0.8 };
      const startValues = { genreId: 1, bpm: 120, speechiness: 10, energy: 0.8 };
      const endValues = { genreId: 2, bpm: 140, speechiness: 20, energy: 0.9 };

      jest.spyOn(trackRepository, 'findByGenreWithCriteria').mockResolvedValue([]);

      const result = await (useCase as any).generateSinglePhase(
        1, 15, phaseValues, startValues, endValues, 3
      );

      expect(result.tracks).toEqual([]);
    });

    it('should handle interpolation at boundaries', () => {
      const startValues = { genreId: 1, bpm: 120, speechiness: 10, energy: 0.8 };
      const endValues = { genreId: 2, bpm: 140, speechiness: 20, energy: 0.9 };

      // Test au début (ratio = 0)
      const startResult = (useCase as any).interpolateValues(startValues, endValues, 0);
      expect(startResult.bpm).toBe(120);
      expect(startResult.speechiness).toBe(10);
      expect(startResult.energy).toBe(0.8);

      // Test à la fin (ratio = 1)
      const endResult = (useCase as any).interpolateValues(startValues, endValues, 1);
      expect(endResult.bpm).toBe(140);
      expect(endResult.speechiness).toBe(20);
      expect(endResult.energy).toBe(0.9);
    });
  });
});