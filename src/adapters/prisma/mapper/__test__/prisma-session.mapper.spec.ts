import { PrismaSessionMapper } from '../prisma-session.mapper';
import { Session } from '../../../../core/domain/model/Session';
import { SessionPhase } from '../../../../core/domain/model/SessionPhase';
import { Track } from '../../../../core/domain/model/Track';
import { Emotion } from '../../../../core/domain/model/Emotion';
import { createMockGenres } from 'src/adapters/in-memory/mocks/genres';
import { createMockEmotions } from 'src/adapters/in-memory/mocks/emotions';
import { createMockTracks } from 'src/adapters/in-memory/mocks/tracks';
import { create } from 'domain';

async function setupMocks() {
    const  startEmotion  = (await createMockEmotions()).startEmotion;
    const endEmotion = (await createMockEmotions()).endEmotion;
    const tracks = await createMockTracks();
    const genre  = await createMockGenres();
    return { startEmotion, endEmotion, tracks, genre };
  }

describe('PrismaSessionMapper', () => {
  const mapper = new PrismaSessionMapper();
  let startEmotion: Emotion;
  let endEmotion: Emotion;
  let tracks: Track[];
  let genre: any;
  let genreFunction: any;
  let track: Track;
  let phase: SessionPhase;
  let fromEmotion: Emotion;
  let toEmotion: Emotion;

  beforeAll(async () => {
    const mocks = await setupMocks();
    startEmotion = mocks.startEmotion;
    endEmotion = mocks.endEmotion;
    track = mocks.tracks.track1;
    genre = mocks.genre;
    genreFunction = await createMockGenres();
    track = new Track(10, 'Track 1', 180, 'href', 120, 10, 0.8, genre);
    phase = new SessionPhase(
      100,
      1,
      1,
      600,
      120,
      130,
      10,
      20,
      0.7,
      [track]
    );
    fromEmotion = new Emotion(1, 'Happy', 'icon1.png');
    toEmotion = new Emotion(2, 'Calm', 'icon2.png');
  });

  it('should map Session to SessionEntityBasic', () => {
    const session = new Session(
      1,
      1,
      600,
      fromEmotion,
      toEmotion,
      [phase],
      new Date('2023-10-01T10:00:00Z'),
      new Date('2023-10-01T11:00:00Z')
    );

    const entity = mapper.fromDomain(session);

    expect(entity).toEqual({
      id: 1,
      duration: 600,
      userEmotionProfileId: 1,
      fromEmotionId: 1,
      toEmotionId: 2,
      createdAt: new Date('2023-10-01T11:00:00Z'),
      updatedAt: new Date('2023-10-01T10:00:00Z'),
    });
  });

  it('should map SessionEntityWithRelations to Session', () => {
    const entity = {
      id: 1,
      duration: 600,
      userEmotionProfileId: 1,
      fromEmotionId: 1,
      toEmotionId: 2,
      createdAt: new Date('2023-10-01T11:00:00Z'),
      updatedAt: new Date('2023-10-01T10:00:00Z'),
      fromEmotion: {
        id: 1,
        name: 'Happy',
        iconUrl: 'icon1.png',
      },
      toEmotion: {
        id: 2,
        name: 'Calm',
        iconUrl: 'icon2.png',
      },
      phases: [
        {
          id: 100,
          sessionId: 1,
          phaseNumber: 1,
          duration: 600,
          fromBpm: 120,
          toBpm: 130,
          fromSpeechiness: 10,
          toSpeechiness: 20,
          fromEnergy: 0.7,
          toEnergy: 0.8,
          tracks: [
            {
              sessionPhaseId: 100,
              trackId: 10,
              track: {
                id: 10,
                name: 'Track 1',
                length: 180,
                track_href: 'href',
                bpm: 120,
                speechiness: 10,
                energy: 0.8,
                genreId: 1,
                genre: {
                  id: 1,
                  name: 'Pop',
                  iconUrl: 'icon.png',
                },
              },
            },
          ],
        },
      ],
    };

    const session = mapper.toDomain(entity);

    expect(session.id).toBe(1);
    expect(session.duration).toBe(600);
    expect(session.fromEmotion.id).toBe(1);
    expect(session.fromEmotion.name).toBe('Happy');
    expect(session.toEmotion.id).toBe(2);
    expect(session.toEmotion.name).toBe('Calm');
    expect(session.phases.length).toBe(1);
    expect(session.phases[0].tracks.length).toBe(1);
    expect(session.phases[0].tracks[0].name).toBe('Track 1');
    expect(session.phases[0].tracks[0].genre.id).toBe(1);
    expect(session.phases[0].tracks[0].genre.name).toBe('Pop');
  });
});