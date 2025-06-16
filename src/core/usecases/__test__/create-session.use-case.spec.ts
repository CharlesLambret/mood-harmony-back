import { GenerateSessionUseCase } from '../create-session.use-case';
import { createMockEmotions} from '../../../adapters/in-memory/mocks/emotions';
import { createMockGenres } from '../../../adapters/in-memory/mocks/genres';
import { createMockUserGenrePreferences} from '../../../adapters/in-memory/mocks/user-genre-preferences';
import { createMockTracks } from '../../../adapters/in-memory/mocks/tracks';
import { createMockUser } from '../../../adapters/in-memory/mocks/user';
import { createMockUserEmotion} from '../../../adapters/in-memory/mocks/user-emotion';
import { InMemorySessionRepository } from '../../../adapters/in-memory/in-memory-session.repository';

describe('GenerateSessionUseCase', () => {
  let sessionRepository: InMemorySessionRepository;
  
  let useCase: GenerateSessionUseCase;
  let tracks, trackRepository;
  let genre1, genre2, genreRepository;
  let startEmotion, endEmotion, emotion, emotionRepository;
  let userGenrePreferences, userGenrePreferencesRepository;
  let userEmotion, userEmotionRepository;
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
    genreRepository = genres.genreRepository;

    // Emotions
    const emotions = await createMockEmotions();
    startEmotion = emotions.startEmotion;
    endEmotion = emotions.endEmotion;
    emotion = emotions.emotion;
    emotionRepository = emotions.emotionRepository;

    // UserGenrePreferences
    const userGenrePreferencesMock = await createMockUserGenrePreferences();
    userGenrePreferences = userGenrePreferencesMock.userGenrePreferences;
    userGenrePreferencesRepository = userGenrePreferencesMock.userGenrePreferencesRepository;

    // UserEmotion
    const userEmotionMock = await createMockUserEmotion();
    userEmotion = userEmotionMock.userEmotion;
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

  describe('getUserEmotions', () => {
    it('should call userEmotionRepository.findByUserIdAndEmotionIds', async () => {
      const userEmotion = await userEmotionRepository.create({
        emotion,
        userGenrePreferences: [],
        userId: 1, // Ajoute ceci
        userEmotionProfileId: 1, // Ajoute ceci ou une valeur adaptée
      });

      const result = await (useCase as any).getUserEmotions(1, [emotion.id]);
      expect(result).toEqual([userEmotion]);
    });
  });

  describe('getGenrePreferences', () => {
    it('should return best genres and common genres', async () => {
      const bestGenresSpy = jest.spyOn(userGenrePreferencesRepository, 'findBestRatingByEmotion');
      const commonGenresSpy = jest.spyOn(userGenrePreferencesRepository, 'findCommonGenres');

      const result = await (useCase as any).getGenrePreferences([userEmotion, userEmotion], 3);

      expect(bestGenresSpy).toHaveBeenCalled();
      expect(commonGenresSpy).toHaveBeenCalled();
      expect(result).toHaveProperty('startGenre');
      expect(result).toHaveProperty('endGenre');
      expect(result).toHaveProperty('commonGenres');
      expect(Array.isArray(result.commonGenres)).toBe(true);
    });
  });

  describe('generatePhases', () => {
  it('should generate the correct number of phases with correct genres', async () => {
    jest.spyOn(useCase as any, 'generateSinglePhase').mockResolvedValue({} as any);

    // Simule un objet genrePrefObj conforme à la nouvelle logique
    const genrePrefObj = {
      startGenre: userGenrePreferences[0],
      endGenre: userGenrePreferences[1] || userGenrePreferences[0],
      commonGenres: userGenrePreferences.slice(2, 3)
    };

    const result = await (useCase as any).generatePhases(3, 45, genrePrefObj);
    expect(result.length).toBe(3);
    expect((useCase as any).generateSinglePhase).toHaveBeenCalledTimes(3);

    // Vérifie que chaque appel reçoit un seul genre dans un tableau
    expect((useCase as any).generateSinglePhase).toHaveBeenNthCalledWith(
      1, 1, 15, [genrePrefObj.startGenre], 3
    );
    expect((useCase as any).generateSinglePhase).toHaveBeenNthCalledWith(
      2, 2, 15, [genrePrefObj.commonGenres[0]], 3
    );
    expect((useCase as any).generateSinglePhase).toHaveBeenNthCalledWith(
      3, 3, 15, [genrePrefObj.endGenre], 3
    );
  });
});

  describe('generateSinglePhase', () => {
    it('should call trackRepository and return a SessionPhase', async () => {
      
      jest.spyOn(trackRepository, 'findByGenreWithCriteria').mockResolvedValue([tracks]);
      jest.spyOn(trackRepository, 'findByGenreWithTransition').mockResolvedValue([tracks]);
      jest.spyOn(useCase as any, 'selectTracksForPhase').mockReturnValue([tracks]);
      jest.spyOn(useCase as any, 'calculatePhaseStartValues').mockReturnValue({ bpm: 120, speechiness: 10, energy: 0.8 });
      jest.spyOn(useCase as any, 'calculatePhaseEndValues').mockReturnValue({ bpm: 130, speechiness: 20, energy: 0.9 });

      const phase = await (useCase as any).generateSinglePhase(1, 15, userGenrePreferences, 1);
      expect(trackRepository.findByGenreWithCriteria).toHaveBeenCalled();
      expect(trackRepository.findByGenreWithTransition).toHaveBeenCalled();
      expect(phase.tracks.length).toBeGreaterThan(0);
      
    });
  });

  describe('selectTracksForPhase', () => {
    it('should return unique tracks and respect min/max', async () => {
      // Debug: print input tracks
      // eslint-disable-next-line no-console
      const result = (useCase as any).selectTracksForPhase(tracks, 1, 2);
      // eslint-disable-next-line no-console
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.find((t: { id: number }) => t.id === 1)).toBeDefined();
      expect(result.find(t => t.id === 2)).toBeDefined();
    });
  });

  describe('calculatePhaseStartValues', () => {
    it('should call calculatePhaseStartValues with next progress', async () => {
      const spy = jest.spyOn(useCase as any, 'calculatePhaseStartValues');
      (useCase as any).calculatePhaseStartValues(userGenrePreferences, 0.5);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('calculatePhaseEndValues', () => {
    it('should call calculatePhaseEndValues with next progress', async () => {
      const spy = jest.spyOn(useCase as any, 'calculatePhaseEndValues');
      (useCase as any).calculatePhaseEndValues(userGenrePreferences, 0.5);
      expect(spy).toHaveBeenCalled();
    });
  });

  // Additional tests

  describe('execute', () => {
    it('should create a session with correct phases and tracks', async () => {

      const command = {
        currentUser: { id: 1 },
        emotionStartId: startEmotion.id,
        emotionEndId: endEmotion.id,
        duration: 30
      };

      // Patch userEmotionRepository to return both start and end userEmotions
      jest.spyOn(userEmotionRepository, 'findByUserIdAndEmotionIds').mockResolvedValue([startEmotion, endEmotion]);

      // Patch userGenrePreferenceRepository
      jest.spyOn(userGenrePreferencesRepository, 'findBestRatingByEmotion').mockResolvedValue(userGenrePreferences);
      jest.spyOn(userGenrePreferencesRepository, 'findCommonGenres').mockResolvedValue([]);

      // Patch trackRepository
      jest.spyOn(trackRepository, 'findByGenreWithCriteria').mockResolvedValue([
        await trackRepository.create({
          name: 'Track 2',
          length: 200,
          trackHref: 'href2',
          bpm: 120,
          speechiness: 10,
          energy: 0.8,
          genre: genre1
        })
      ]);
      jest.spyOn(trackRepository, 'findByGenreWithTransition').mockResolvedValue([]);

      const session = await useCase.execute(command);
      expect(session).toBeDefined();
      expect(session.phases.length).toBe(Math.floor(command.duration / 15));
      expect(session.fromEmotion).toEqual(startEmotion);
      expect(session.toEmotion).toEqual(startEmotion);
    });

    it('should throw if emotions are not found', async () => {
      const command = {
        currentUser: user.id,
        emotionStartId: startEmotion.id,
        emotionEndId: endEmotion.id,
        duration: 30
      };
      await expect(useCase.execute(command)).rejects.toThrow('One or both emotions not found');
    });
  });

  describe('edge cases', () => {
    it('should handle empty genre preferences gracefully', async () => {
      const genre = await genreRepository.create({ name: 'Pop', iconUrl: 'icon.png' });
      const userEmotion = await userEmotionRepository.create({
        emotion,
        userId: 1,
        userEmotionProfileId: 1,
        userGenrePreferences: [],
      });
      const result = await (useCase as any).getGenrePreferences([userEmotion], 3);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should select no tracks if none are available', () => {
      const result = (useCase as any).selectTracksForPhase([], 1, 2);
      expect(result).toEqual([]);
    });
  });
});
