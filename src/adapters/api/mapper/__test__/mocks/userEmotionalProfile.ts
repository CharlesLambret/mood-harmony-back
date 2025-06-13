
import { User } from 'src/core/domain/model/User';
import { UserEmotionalProfile } from 'src/core/domain/model/UserEmotionalProfile';
import { Emotion } from 'src/core/domain/model/Emotion';
import { Genre } from 'src/core/domain/model/Genre';

// Define a mock UserEmotion class for testing
class UserEmotionMock {
  constructor(
    public id: number,
    public emotion: Emotion,
    public genres: Genre[],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}

// Création des genres
const popGenre = new Genre(1, 'Pop', 'pop.png');
const rockGenre = new Genre(2, 'Rock', 'rock.png');

// Création des émotions
const happyEmotion = new Emotion(1, 'Happy', 'happy.png', new Date(), new Date());

const sadEmotion = new Emotion(1, 'Sad', 'sad.png', new Date(), new Date());


// Création de l'utilisateur
const userWithEmotionProfileMock = new User(
  1,
  'test@example.com',
  'password',
  'name', // password or other required string
  'firstName', // firstName or other required string
  {} as UserEmotionalProfile, // emotionProfile will be injected later
  new Date(), // createdAt
  new Date()  // updatedAt
  // Add more arguments if required by your User constructor
);

// Création des UserEmotionMock
const userEmotionHappy = new UserEmotionMock(
  1,
  happyEmotion,
  [popGenre, rockGenre]
);

const userEmotionSad = new UserEmotionMock(
  2,
  sadEmotion,
  [rockGenre]
);

// Création du UserEmotionalProfile (avec user et userEmotions)
const userEmotionalProfile = new UserEmotionalProfile(
  1,
  [userEmotionHappy, userEmotionSad],
);

userWithEmotionProfileMock.emotionProfile = userEmotionalProfile;


// Résultat final : userEmotionalProfile est complet et cohérent

export  {userWithEmotionProfileMock}; 