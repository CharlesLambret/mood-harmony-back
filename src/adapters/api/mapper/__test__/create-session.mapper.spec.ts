import { GenerateSessionMapper } from '../create-session.mapper';
import { GenerateSessionRequest } from '../../request/create-session.request';
import { ProfileRequest } from '../../request/profile.request';
import { Session } from '../../../../core/domain/model/Session';
import { Emotion } from '../../../../core/domain/model/Emotion';
import { SessionPhase } from '../../../../core/domain/model/SessionPhase';
import { Track } from '../../../../core/domain/model/Track';
import { Genre } from '../../../../core/domain/model/Genre';
import { userWithEmotionProfileMock } from './mocks/userEmotionalProfile';
describe('GenerateSessionMapper', () => {
  describe('toDomain', () => {
      it('should map ProfileRequest and GenerateSessionRequest to GenerateSessionCommand', () => {
        // Utilisation du mock pour le profil utilisateur
        const profile = {
          id: userWithEmotionProfileMock.id,
          email: userWithEmotionProfileMock.email,
          name: userWithEmotionProfileMock.name,
          firstName: userWithEmotionProfileMock.firstName,
          emotionProfile: userWithEmotionProfileMock.emotionProfile,
        };

        const request = new GenerateSessionRequest(2, 3, 45);

        const command = GenerateSessionMapper.toDomain(profile, request);

        expect(command).toEqual({
          currentUser: { id: userWithEmotionProfileMock.id },
          emotionStartId: 2,
          emotionEndId: 3,
          duration: 45,
        });
      });
    });

  describe('fromDomain', () => {
    it('should map Session domain model to GenerateSessionResponse', () => {
      const genre = new Genre(1, 'Pop', 'pop.png');
      const track = new Track(
        1, 'Track 1', 180, 'url', 120, 0.1, 0.8, genre
      );
      const emotion1 = new Emotion(1, 'Calm', 'icon1.png');
      const emotion2 = new Emotion(2, 'Happy', 'icon2.png');
      const phase = {
        id: 1,
        sessionId: 10,
        phaseNumber: 1,
        duration: 15,
        fromBpm: 100,
        toBpm: 120,
        fromSpeechiness: 0.1,
        toSpeechiness: 0.2,
        fromEnergy: 0.3,
        toEnergy: 0.4,
        tracks: [track],
        actualDuration: 15,
      } as unknown as SessionPhase;

      const session = new Session(
        10,
        99,
        45,
        emotion1,
        emotion2,
        [phase],
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-01-01T00:00:00Z')
      );

      const response = GenerateSessionMapper.fromDomain(session);

      expect(response.id).toBe(10);
      expect(response.userEmotionalProfileId).toBe(99);
      expect(response.duration).toBe(45);
      expect(response.fromEmotion).toEqual({
        id: 1,
        name: 'Calm',
        iconUrl: 'icon1.png',
      });
      expect(response.toEmotion).toEqual({
        id: 2,
        name: 'Happy',
        iconUrl: 'icon2.png',
      });
      expect(response.phases.length).toBe(1);
      expect(response.phases[0].tracks[0].genre.name).toBe('Pop');
      expect(response.totalDuration).toBe(15);
      expect(response.numberOfPhases).toBe(1);
      expect(response.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
      expect(response.updatedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    });
  });
});