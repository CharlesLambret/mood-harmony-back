import { GenerateSessionCommand, GenerateSessionUseCase } from '../create-session.use-case';
import { InMemoryEmotionRepository } from '../../../adapters/in-memory/in-memory-emotion.repository';
import { InMemoryUserGenrePreferenceRepository } from '../../../adapters/in-memory/in-memory-genre-preferences.repository';
import { InMemoryTrackRepository } from '../../../adapters/in-memory/in-memory-track.repository';
import { InMemoryUserEmotionRepository } from '../../../adapters/in-memory/in-memory-userEmotions.repository';
import { InMemorySessionRepository } from '../../../adapters/in-memory/in-memory-session.repository';
import { Session } from '../../domain/model/Session';
import { Emotion } from '../../domain/model/Emotion';
import { UserGenrePreference } from '../../domain/model/UserGenrePreferences';
import { Genre } from '../../domain/model/Genre';
import { Track } from '../../domain/model/Track';

describe('GenerateSessionUseCase', () => {
  let sessionRepository: InMemorySessionRepository;
  let emotionRepository: InMemoryEmotionRepository;
  let userGenrePreferenceRepository: InMemoryUserGenrePreferenceRepository;
  let trackRepository: InMemoryTrackRepository;
  let userEmotionRepo: InMemoryUserEmotionRepository;
  let useCase: GenerateSessionUseCase;

  beforeEach(() => {
    sessionRepository = new InMemorySessionRepository();
    emotionRepository = new InMemoryEmotionRepository();
    userGenrePreferenceRepository = new InMemoryUserGenrePreferenceRepository();
    trackRepository = new InMemoryTrackRepository();
    userEmotionRepo = new InMemoryUserEmotionRepository();

    useCase = new GenerateSessionUseCase(
      sessionRepository,
      userEmotionRepo,
      userGenrePreferenceRepository,
      trackRepository,
      emotionRepository
    );
  });

  describe('validateEmotions', () => {
    it('should return both emotions if found', async () => {
      const startEmotion = await emotionRepository.create({ name: 'Happy', iconUrl: 'icon1.png' });
      const endEmotion = await emotionRepository.create({ name: 'Calm', iconUrl: 'icon2.png' });
      const result = await (useCase as any).validateEmotions(startEmotion.id, endEmotion.id);
      expect(result).toEqual([startEmotion, endEmotion]);
    });

    it('should throw if one emotion is missing', async () => {
      await expect((useCase as any).validateEmotions(1, 2)).rejects.toThrow('One or both emotions not found');
    });
  });

  describe('getUserEmotions', () => {
    it('should call userEmotionRepository.findByUserIdAndEmotionIds', async () => {
      // Setup
      const userEmotionalProfile = { id: 1 } as any;
      const emotion = await emotionRepository.create({ name: 'Happy', iconUrl: 'icon.png' });
      const userEmotion = await userEmotionRepo.create({
        userEmotionalProfile,
        emotion,
        genres: [],
      });
      const result = await (useCase as any).getUserEmotions(1, [emotion.id]);
      expect(result).toEqual([userEmotion]);
    });
  });

  describe('getGenrePreferences', () => {
    it('should return best genres and common genres', async () => {
      const genre = { id: 1, name: 'Pop', iconUrl: 'icon.png' } as Genre;
      const userEmotionalProfile = { id: 1 } as any;
      const emotion = await emotionRepository.create({ name: 'Happy', iconUrl: 'icon.png' });
      const userEmotion = await userEmotionRepo.create({
        userEmotionalProfile,
        emotion,
        genres: [genre],
      });
      const pref = await userGenrePreferenceRepository.create({
        userEmotion,
        genre,
        rating: 5,
        bpm: 120,
        speechiness: 10,
        energy: 0.8,
      });
      const result = await (useCase as any).getGenrePreferences([userEmotion], 3);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toEqual(pref);
    });
  });

  describe('generatePhases', () => {
    it('should generate the correct number of phases', async () => {
      const genre = { id: 1, name: 'Pop', iconUrl: 'icon.png' } as Genre;
      const userEmotionalProfile = { id: 1 } as any;
      const emotion = await emotionRepository.create({ name: 'Happy', iconUrl: 'icon.png' });
      const userEmotion = await userEmotionRepo.create({
        userEmotionalProfile,
        emotion,
        genres: [genre],
      });
      const pref = await userGenrePreferenceRepository.create({
        userEmotion,
        genre,
        rating: 5,
        bpm: 120,
        speechiness: 10,
        energy: 0.8,
      });
      jest.spyOn(useCase as any, 'generateSinglePhase').mockResolvedValue({} as any);
      const result = await (useCase as any).generatePhases(3, 45, [pref]);
      expect(result.length).toBe(3);
      expect((useCase as any).generateSinglePhase).toHaveBeenCalledTimes(3);
    });
  });

  describe('generateSinglePhase', () => {
    it('should call trackRepository and return a SessionPhase', async () => {
      const genre = { id: 1, name: 'Pop', iconUrl: 'icon.png' } as Genre;
      const userEmotionalProfile = { id: 1 } as any;
      const emotion = await emotionRepository.create({ name: 'Happy', iconUrl: 'icon.png' });
      const userEmotion = await userEmotionRepo.create({
        userEmotionalProfile,
        emotion,
        genres: [genre],
      });
      const pref = await userGenrePreferenceRepository.create({
        userEmotion,
        genre,
        rating: 5,
        bpm: 120,
        speechiness: 10,
        energy: 0.8,
      });
      const track = await trackRepository.create({
        name: 'Track 1',
        length: 180,
        trackHref: 'href',
        bpm: 120,
        speechiness: 10,
        energy: 0.8,
        genre,
      });
      jest.spyOn(useCase as any, 'selectTracksForPhase').mockReturnValue([track]);
      jest.spyOn(useCase as any, 'calculatePhaseStartValues').mockReturnValue({ bpm: 120, speechiness: 10, energy: 0.8 });
      jest.spyOn(useCase as any, 'calculatePhaseEndValues').mockReturnValue({ bpm: 130, speechiness: 20, energy: 0.9 });

      // Patch trackRepository methods to return the track
      jest.spyOn(trackRepository, 'findByGenreWithCriteria').mockResolvedValue([track]);
      jest.spyOn(trackRepository, 'findByGenreWithTransition').mockResolvedValue([track]);

      const phase = await (useCase as any).generateSinglePhase(1, 15, [pref], 3);
      expect(trackRepository.findByGenreWithCriteria).toHaveBeenCalled();
      expect(trackRepository.findByGenreWithTransition).toHaveBeenCalled();
      expect(phase.tracks.length).toBeGreaterThan(0);
      expect(phase.fromBpm).toBe(120);
      expect(phase.toBpm).toBe(130);
    });
  });

  describe('selectTracksForPhase', () => {
    it('should return unique tracks and respect min/max', () => {
      const genre = new Genre(1, 'Pop', 'icon.png');
      const track1 = new Track(1, 'A', 100, 'href', 120, 10, 0.8, genre);
      const track2 = new Track(2, 'B', 100, 'href', 120, 10, 0.8, genre);
      const track3 = new Track(1, 'A', 100, 'href', 120, 10, 0.8, genre); // duplicate
      const result = (useCase as any).selectTracksForPhase([track1, track2, track3], 1, 2);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.length).toBeLessThanOrEqual(2);
      expect(result.find(t => t.id === 1)).toBeDefined();
      expect(result.find(t => t.id === 2)).toBeDefined();
    });
  });

  describe('calculatePhaseStartValues', () => {
    it('should interpolate values between preferences', async () => {
      const genre = new Genre(1, 'Pop', 'icon.png');
      const user = { id: 1 } as any;
      const userEmotionalProfile = {
        id: 1,
        user,
        userEmotions: [],
        updatedAt: new Date(),
        createdAt: new Date(),
      } as any;
      // Create a dummy emotion and userEmotion for the test
      const emotion = await emotionRepository.create({ name: 'Happy', iconUrl: 'icon.png' });
      const userEmotion = await userEmotionRepo.create({
        userEmotionalProfile,
        emotion,
        genres: [genre],
      });
      const pref1 = await userGenrePreferenceRepository.create({
        userEmotion: userEmotion,
        genre,
        rating: 5,
        bpm: 120,
        speechiness: 10,
        energy: 0.8,
      });
      const pref2 = await userGenrePreferenceRepository.create({
        userEmotion: userEmotion,
        genre,
        rating: 5,
        bpm: 180,
        speechiness: 20,
        energy: 0.7,
      });
      const result = (useCase as any).calculatePhaseStartValues([pref1, pref2], 0.5);
      expect(result.bpm).toBe(150);
      expect(result.speechiness).toBe(15);
      expect(result.energy).toBeCloseTo(0.75);
    });
  });

  describe('calculatePhaseEndValues', () => {
    it('should call calculatePhaseStartValues with next progress', async () => {
      const genre = new Genre(1, 'Pop', 'icon.png');
      const user = { id: 1 } as any;

      const userEmotionalProfile = {
        id: 1,
        user,
        userEmotions: [],
        updatedAt: new Date(),
        createdAt: new Date(),
      } as any;
      // Create a dummy emotion and userEmotion for the test
      const emotion = await emotionRepository.create({ name: 'Happy', iconUrl: 'icon.png' });
      const userEmotion = await userEmotionRepo.create({
        userEmotionalProfile,
        emotion,
        genres: [genre],
      });
      const pref1 = await userGenrePreferenceRepository.create({
        userEmotion: userEmotion,
        genre,
        rating: 5,
        bpm: 120,
        speechiness: 10,
        energy: 0.8,
      });
      const pref2 = await userGenrePreferenceRepository.create({
        userEmotion: userEmotion,
        genre,
        rating: 5,
        bpm: 180,
        speechiness: 20,
        energy: 0.7,
      });
      const spy = jest.spyOn(useCase as any, 'calculatePhaseStartValues');
      (useCase as any).calculatePhaseEndValues([pref1, pref2], 0.5);
      expect(spy).toHaveBeenCalled();
    });
  });
});