import { PrismaSessionMapper } from '../prisma-session.mapper';
import { Session } from '../../../../core/domain/model/Session';
import { SessionPhase } from '../../../../core/domain/model/SessionPhase';
import { Track } from '../../../../core/domain/model/Track';
import { Emotion } from '../../../../core/domain/model/Emotion';
import { Genre } from '../../../../core/domain/model/Genre';
import { createMockGenres } from '../../../../adapters/in-memory/mocks/genres';
import { createMockEmotions } from '../../../../adapters/in-memory/mocks/emotions';
import { createMockTracks } from '../../../../adapters/in-memory/mocks/tracks';

async function setupMocks() {
  const { startEmotion } = await createMockEmotions();
  const { endEmotion } = await createMockEmotions();
  const tracks = await createMockTracks();
  const genre = await createMockGenres();
  return { startEmotion, endEmotion, tracks, genre };
}

describe('PrismaSessionMapper', () => {
  const mapper = new PrismaSessionMapper();
  let startEmotion: Emotion;
  let endEmotion: Emotion;
  let tracks: Track[];
  let genre: any;
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
    
    // Création d'un genre pour le test
    const testGenre = new Genre(1, 'Pop', 'icon.png');
    
    // Création d'un track de test
    track = new Track(10, 'Track 1', 180, 'href', 120, 10, 0.8, testGenre);
    
    // Création d'une phase de test avec les bons paramètres du constructeur
    phase = new SessionPhase(
      100,        // id
      1,          // phaseNumber
      600,        // duration
      120,        // fromBpm
      130,        // toBpm
      10,         // fromSpeechiness
      20,         // toSpeechiness
      0.7,        // fromEnergy
      0.8,        // toEnergy
      [track],    // tracks
      1           // sessionId
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
              },
            },
          ],
        },
      ],
    };

    const session = mapper.toDomain(entity);

    expect(session.id).toBe(1);
    expect(session.duration).toBe(600);
    expect(session.userEmotionalProfileId).toBe(1);
    expect(session.fromEmotion.id).toBe(1);
    expect(session.fromEmotion.name).toBe('Happy');
    expect(session.toEmotion.id).toBe(2);
    expect(session.toEmotion.name).toBe('Calm');
    expect(session.phases.length).toBe(1);
    
    // Test de la phase
    const mappedPhase = session.phases[0];
    expect(mappedPhase.id).toBe(100);
    expect(mappedPhase.phaseNumber).toBe(1);
    expect(mappedPhase.fromBpm).toBe(120);
    expect(mappedPhase.toBpm).toBe(130);
    expect(mappedPhase.sessionId).toBe(1);
    
    // Test des tracks
    expect(mappedPhase.tracks.length).toBe(1);
    const mappedTrack = mappedPhase.tracks[0];
    expect(mappedTrack.id).toBe(10);
    expect(mappedTrack.name).toBe('Track 1');
    expect(mappedTrack.length).toBe(180);
    expect(mappedTrack.bpm).toBe(120);
    
    // Test du genre (avec les valeurs hardcodées du mapper)
    expect(mappedTrack.genre.id).toBe(1);
    expect(mappedTrack.genre.name).toBe('Pop'); // Valeur hardcodée dans le mapper
    expect(mappedTrack.genre.iconUrl).toBe('icon.url'); // Valeur hardcodée dans le mapper
  });

  it('should handle session creation without ID', () => {
    const session = new Session(
      0, // ID = 0 pour création
      1,
      600,
      fromEmotion,
      toEmotion,
      [phase],
      new Date('2023-10-01T10:00:00Z'),
      new Date('2023-10-01T11:00:00Z')
    );

    const entity = mapper.fromDomain(session);

    expect(entity.id).toBeUndefined(); // L'ID ne doit pas être inclus
    expect(entity.duration).toBe(600);
    expect(entity.userEmotionProfileId).toBe(1);
  });

  it('should handle entity without relations', () => {
    const entityWithoutRelations = {
      id: 1,
      duration: 600,
      userEmotionProfileId: 1,
      fromEmotionId: 1,
      toEmotionId: 2,
      createdAt: new Date('2023-10-01T11:00:00Z'),
      updatedAt: new Date('2023-10-01T10:00:00Z'),
    };

    const session = mapper.toDomain(entityWithoutRelations);

    expect(session.id).toBe(1);
    expect(session.fromEmotion.id).toBe(1);
    expect(session.fromEmotion.name).toBe(''); // Valeur par défaut
    expect(session.toEmotion.id).toBe(2);
    expect(session.toEmotion.name).toBe(''); // Valeur par défaut
    expect(session.phases).toEqual([]); // Pas de phases
  });
});