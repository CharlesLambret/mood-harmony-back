import { User } from '../../../../../core/domain/model/User';
import { UserEmotionalProfile } from '../../../../../core/domain/model/UserEmotionalProfile';
import { Emotion } from '../../../../../core/domain/model/Emotion';
import { Genre } from '../../../../../core/domain/model/Genre';
import { UserGenrePreference } from '../../../../../core/domain/model/UserGenrePreferences';

// Define a mock UserEmotion class for testing
class UserEmotionMock {
  constructor(
    public id: number,
    public emotion: Emotion,
    public genres: Genre[],
    public userGenrePreferences: UserGenrePreference[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public userId: number = 1,
    public userEmotionProfileId: number = 1
  ) {}
}

// Création des genres
const popGenre = new Genre(1, 'Pop', 'pop.png');
const rockGenre = new Genre(2, 'Rock', 'rock.png');

// Création des émotions
const happyEmotion = new Emotion(1, 'Happy', 'happy.png', new Date(), new Date());
const sadEmotion = new Emotion(2, 'Sad', 'sad.png', new Date(), new Date());

// Création des UserGenrePreferences mocks
const popPreference = new UserGenrePreference(
  1, // id
  1, // useremotionId
  1, // genreId (Pop)
  5, // rating
  120, // bpm
  10, // speechiness
  0.8 // energy
);

const rockPreference = new UserGenrePreference(
  2, // id
  1, // useremotionId
  2, // genreId (Rock)
  4, // rating
  130, // bpm
  15, // speechiness
  0.7 // energy
);

const sadRockPreference = new UserGenrePreference(
  3, // id
  2, // useremotionId (Sad)
  2, // genreId (Rock)
  3, // rating
  110, // bpm
  8, // speechiness
  0.5 // energy
);

// Création de l'utilisateur
const userWithEmotionProfileMock = new User(
  1,
  'test@example.com',
  'password',
  'name',
  'firstName',
  {} as UserEmotionalProfile, // emotionProfile will be injected later
  new Date(),
  new Date()
);
const userEmotionHappy = new UserEmotionMock(
  1,
  happyEmotion,
  [popGenre, rockGenre],
  [popPreference, rockPreference],
  new Date(),
  new Date(),
  userWithEmotionProfileMock.id,
  1
);

const userEmotionSad = new UserEmotionMock(
  2,
  sadEmotion,
  [rockGenre],
  [sadRockPreference],
  new Date(),
  new Date(),
  userWithEmotionProfileMock.id,
  1
);
  [sadRockPreference]


// Création du UserEmotionalProfile (avec user et userEmotions)
const userEmotionalProfile = new UserEmotionalProfile(
  1,
  [userEmotionHappy, userEmotionSad],
);

userWithEmotionProfileMock.emotionProfile = userEmotionalProfile;

// Résultat final : userEmotionalProfile est complet et cohérent

export { userWithEmotionProfileMock };