import { PrismaClient } from '@prisma/client';
import { PrismaEmotionRepository } from '../src/adapters/prisma/prisma-emotion.repository';
import { PrismaGenreRepository } from '../src/adapters/prisma/prisma-genre.repository';
import { PrismaTrackRepository } from '../src/adapters/prisma/prisma-track.repository';
import { PrismaUserRepository } from '../src/adapters/prisma/prisma-user.repository';
import { PrismauserGenrePreferencesRepository } from '../src/adapters/prisma/prisma-user-genre-preferences.repository';
import { PrismaService } from '../src/adapters/prisma/prisma.service';
import { Emotion } from '../src/core/domain/model/Emotion';
import { Genre } from '../src/core/domain/model/Genre';
import { Track } from '../src/core/domain/model/Track';
import { User } from '../src/core/domain/model/User';
import { UserGenrePreference } from '../src/core/domain/model/UserGenrePreferences';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Initialize repositories
  const prismaService = new PrismaService();
  const emotionRepo = new PrismaEmotionRepository(prismaService);
  const genreRepo = new PrismaGenreRepository(prismaService);
  const trackRepo = new PrismaTrackRepository(prismaService);
  const userRepo = new PrismaUserRepository(prismaService);
  const userGenrePrefsRepo = new PrismauserGenrePreferencesRepository(prismaService);

  // 1. Create Emotions using repository
  console.log('Creating emotions...');
  const emotionData = [
    { name: 'Joie', iconUrl: 'joie-icon.png' },
    { name: 'Gratitude', iconUrl: 'gratitude-icon.png' },
    { name: 'Calme', iconUrl: 'calme-icon.png' },
    { name: 'Léthargie', iconUrl: 'lethargie-icon.png' },
    { name: 'Colère', iconUrl: 'colere-icon.png' },
    { name: 'Tristesse', iconUrl: 'tristesse-icon.png' },
    { name: 'Anxiété', iconUrl: 'anxiete-icon.png' },
    { name: 'Espoir', iconUrl: 'espoir-icon.png' }
  ];

  const emotions: Emotion[] = [];
  for (const data of emotionData) {
    const emotion = new Emotion(0, data.name, data.iconUrl);
    emotions.push(await emotionRepo.create(emotion));
  }

  // 2. Create Genres using repository
  console.log('Creating genres...');
  const genreData = [
    { name: 'Pop', iconUrl: 'pop-icon.png' },
    { name: 'Rock', iconUrl: 'rock-icon.png' },
    { name: 'Jazz', iconUrl: 'jazz-icon.png' },
    { name: 'Classical', iconUrl: 'classical-icon.png' },
    { name: 'Hip-Hop', iconUrl: 'hiphop-icon.png' },
    { name: 'Electronic', iconUrl: 'electronic-icon.png' },
    { name: 'R&B', iconUrl: 'rnb-icon.png' },
    { name: 'Blues', iconUrl: 'blues-icon.png' },
    { name: 'Reggae', iconUrl: 'reggae-icon.png' },
    { name: 'Folk', iconUrl: 'folk-icon.png' },
    { name: 'Country', iconUrl: 'country-icon.png' },
    { name: 'Funk', iconUrl: 'funk-icon.png' }
  ];

  const genres: Genre[] = [];
  for (const data of genreData) {
    const genre = new Genre(0, data.name, data.iconUrl);
    genres.push(await genreRepo.create(genre));
  }

  // 3. Create Tracks using repository
  console.log('Creating tracks...');
  const trackData = [
    // Pop tracks (4 tracks)
    { name: 'Sunshine Day', length: 210, trackHref: 'https://spotify.com/track1', bpm: 128, speechiness: 10, energy: 85, genreIndex: 0 },
    { name: 'Dancing Queen', length: 195, trackHref: 'https://spotify.com/track2', bpm: 132, speechiness: 12, energy: 90, genreIndex: 0 },
    { name: 'Feel Good Inc', length: 223, trackHref: 'https://spotify.com/track3', bpm: 130, speechiness: 15, energy: 80, genreIndex: 0 },
    { name: 'Happy Together', length: 180, trackHref: 'https://spotify.com/track4', bpm: 125, speechiness: 8, energy: 88, genreIndex: 0 },
    
    // Rock tracks (4 tracks)
    { name: 'Thunder Road', length: 285, trackHref: 'https://spotify.com/track5', bpm: 140, speechiness: 20, energy: 95, genreIndex: 1 },
    { name: 'Born to Run', length: 267, trackHref: 'https://spotify.com/track6', bpm: 138, speechiness: 18, energy: 92, genreIndex: 1 },
    { name: 'Highway Star', length: 245, trackHref: 'https://spotify.com/track7', bpm: 145, speechiness: 25, energy: 98, genreIndex: 1 },
    { name: 'Sweet Child O Mine', length: 356, trackHref: 'https://spotify.com/track8', bpm: 125, speechiness: 15, energy: 85, genreIndex: 1 },
    
    // Jazz tracks (4 tracks)
    { name: 'Take Five', length: 324, trackHref: 'https://spotify.com/track9', bpm: 85, speechiness: 5, energy: 45, genreIndex: 2 },
    { name: 'Blue in Green', length: 278, trackHref: 'https://spotify.com/track10', bpm: 90, speechiness: 3, energy: 40, genreIndex: 2 },
    { name: 'Autumn Leaves', length: 298, trackHref: 'https://spotify.com/track11', bpm: 88, speechiness: 4, energy: 50, genreIndex: 2 },
    { name: 'Summertime', length: 256, trackHref: 'https://spotify.com/track12', bpm: 92, speechiness: 6, energy: 42, genreIndex: 2 },
    
    // Classical tracks (4 tracks)
    { name: 'Clair de Lune', length: 345, trackHref: 'https://spotify.com/track13', bpm: 60, speechiness: 0, energy: 25, genreIndex: 3 },
    { name: 'Moonlight Sonata', length: 678, trackHref: 'https://spotify.com/track14', bpm: 55, speechiness: 0, energy: 30, genreIndex: 3 },
    { name: 'Canon in D', length: 567, trackHref: 'https://spotify.com/track15', bpm: 65, speechiness: 0, energy: 35, genreIndex: 3 },
    { name: 'Ave Maria', length: 423, trackHref: 'https://spotify.com/track16', bpm: 70, speechiness: 0, energy: 40, genreIndex: 3 },
    
    // Hip-Hop tracks (4 tracks)
    { name: 'Lose Yourself', length: 326, trackHref: 'https://spotify.com/track17', bpm: 86, speechiness: 85, energy: 88, genreIndex: 4 },
    { name: 'Good Kid', length: 287, trackHref: 'https://spotify.com/track18', bpm: 92, speechiness: 90, energy: 75, genreIndex: 4 },
    { name: 'Alright', length: 219, trackHref: 'https://spotify.com/track19', bpm: 95, speechiness: 88, energy: 82, genreIndex: 4 },
    { name: 'HUMBLE.', length: 177, trackHref: 'https://spotify.com/track20', bpm: 150, speechiness: 92, energy: 90, genreIndex: 4 },
    
    // Electronic tracks (4 tracks)
    { name: 'Strobe', length: 631, trackHref: 'https://spotify.com/track21', bpm: 128, speechiness: 2, energy: 85, genreIndex: 5 },
    { name: 'Clarity', length: 271, trackHref: 'https://spotify.com/track22', bpm: 132, speechiness: 35, energy: 88, genreIndex: 5 },
    { name: 'Levels', length: 203, trackHref: 'https://spotify.com/track23', bpm: 126, speechiness: 5, energy: 95, genreIndex: 5 },
    { name: 'Animals', length: 187, trackHref: 'https://spotify.com/track24', bpm: 135, speechiness: 8, energy: 92, genreIndex: 5 },
    
    // R&B tracks (4 tracks)
    { name: 'What\'s Going On', length: 231, trackHref: 'https://spotify.com/track25', bpm: 75, speechiness: 45, energy: 65, genreIndex: 6 },
    { name: 'Superstition', length: 245, trackHref: 'https://spotify.com/track26', bpm: 100, speechiness: 25, energy: 80, genreIndex: 6 },
    { name: 'Crazy in Love', length: 236, trackHref: 'https://spotify.com/track27', bpm: 99, speechiness: 35, energy: 85, genreIndex: 6 },
    { name: 'I Want You Back', length: 179, trackHref: 'https://spotify.com/track28', bpm: 95, speechiness: 30, energy: 88, genreIndex: 6 },

    // Blues tracks (4 tracks)
    { name: 'The Thrill Is Gone', length: 312, trackHref: 'https://spotify.com/track29', bpm: 72, speechiness: 35, energy: 50, genreIndex: 7 },
    { name: 'Sweet Home Chicago', length: 198, trackHref: 'https://spotify.com/track30', bpm: 78, speechiness: 40, energy: 60, genreIndex: 7 },
    { name: 'Cross Road Blues', length: 167, trackHref: 'https://spotify.com/track31', bpm: 82, speechiness: 38, energy: 55, genreIndex: 7 },
    { name: 'Stormy Monday', length: 234, trackHref: 'https://spotify.com/track32', bpm: 68, speechiness: 42, energy: 45, genreIndex: 7 },

    // Reggae tracks (4 tracks)
    { name: 'No Woman No Cry', length: 247, trackHref: 'https://spotify.com/track33', bpm: 76, speechiness: 25, energy: 70, genreIndex: 8 },
    { name: 'Three Little Birds', length: 180, trackHref: 'https://spotify.com/track34', bpm: 80, speechiness: 20, energy: 75, genreIndex: 8 },
    { name: 'Buffalo Soldier', length: 258, trackHref: 'https://spotify.com/track35', bpm: 85, speechiness: 30, energy: 65, genreIndex: 8 },
    { name: 'One Love', length: 172, trackHref: 'https://spotify.com/track36', bpm: 78, speechiness: 22, energy: 72, genreIndex: 8 },

    // Folk tracks (4 tracks)
    { name: 'Blowin\' in the Wind', length: 168, trackHref: 'https://spotify.com/track37', bpm: 65, speechiness: 55, energy: 40, genreIndex: 9 },
    { name: 'The Times They Are A-Changin\'', length: 214, trackHref: 'https://spotify.com/track38', bpm: 70, speechiness: 60, energy: 45, genreIndex: 9 },
    { name: 'Fire and Rain', length: 200, trackHref: 'https://spotify.com/track39', bpm: 72, speechiness: 50, energy: 38, genreIndex: 9 },
    { name: 'Both Sides Now', length: 228, trackHref: 'https://spotify.com/track40', bpm: 68, speechiness: 45, energy: 35, genreIndex: 9 }
  ];

  const tracks: Track[] = [];
  for (const data of trackData) {
    const track = new Track(
      0,
      data.name,
      data.length,
      data.trackHref,
      data.bpm,
      data.speechiness,
      data.energy,
      genres[data.genreIndex]
    );
    tracks.push(await trackRepo.create(track));
  }

  // 4. Create User using repository
  console.log('Creating user...');
  const user = new User(
    1,
    'john.doe@example.com',
    '$2b$10$rOzJqX8GZqKQOjX8GZqKQOjX8GZqKQOjX8GZqKQO', // hashed "password123"
    'John Doe',
    'John',
  );
  const createdUser = await userRepo.create(user);

  // 5. Create UserEmotionProfile using Prisma directly, with the correct userId
  console.log('Creating user emotion profile...');
  const userEmotionProfile = await prisma.userEmotionProfile.create({
    data: {
      userId: createdUser.id
    }
  });

  // 6. Create UserEmotions using direct Prisma (since repository seems to be incomplete)
  console.log('Creating user emotions...');
  const userEmotions = await Promise.all([
    // Joie - émotion de départ
    prisma.userEmotion.create({
      data: {
        userEmotionProfileId: userEmotionProfile.id,
        userId: createdUser.id,
        emotionId: emotions[0].id // Joie
      }
    }),
    // Calme - émotion d'arrivée
    prisma.userEmotion.create({
      data: {
        userEmotionProfileId: userEmotionProfile.id,
        userId: createdUser.id,
        emotionId: emotions[2].id // Calme
      }
    }),
    // Anxiété - émotion de départ alternative
    prisma.userEmotion.create({
      data: {
        userEmotionProfileId: userEmotionProfile.id,
        userId: createdUser.id,
        emotionId: emotions[6].id // Anxiété
      }
    }),
    // Gratitude - émotion d'arrivée alternative
    prisma.userEmotion.create({
      data: {
        userEmotionProfileId: userEmotionProfile.id,
        userId: createdUser.id,
        emotionId: emotions[1].id // Gratitude
      }
    })
  ]);

  // 7. Create UserGenrePreferences using repository
  console.log('Creating user genre preferences...');
  const genrePreferencesData = [
    // Pour Joie (userEmotion[0])
    { userEmotionId: userEmotions[0].id, genreIndex: 0, rating: 5, bpm: 128, speechiness: 10, energy: 85 }, // Pop
    { userEmotionId: userEmotions[0].id, genreIndex: 0, rating: 4, bpm: 130, speechiness: 12, energy: 88 }, // Pop
    { userEmotionId: userEmotions[0].id, genreIndex: 4, rating: 4, bpm: 95, speechiness: 88, energy: 82 }, // Hip-Hop
    { userEmotionId: userEmotions[0].id, genreIndex: 5, rating: 3, bpm: 128, speechiness: 5, energy: 85 }, // Electronic
    
    // Pour Calme (userEmotion[1])
    { userEmotionId: userEmotions[1].id, genreIndex: 2, rating: 5, bpm: 88, speechiness: 4, energy: 45 }, // Jazz
    { userEmotionId: userEmotions[1].id, genreIndex: 2, rating: 4, bpm: 90, speechiness: 3, energy: 40 }, // Jazz
    { userEmotionId: userEmotions[1].id, genreIndex: 3, rating: 5, bpm: 60, speechiness: 0, energy: 30 }, // Classical
    { userEmotionId: userEmotions[1].id, genreIndex: 9, rating: 4, bpm: 70, speechiness: 15, energy: 50 }, // Folk
    
    // Pour Anxiété (userEmotion[2])
    { userEmotionId: userEmotions[2].id, genreIndex: 1, rating: 3, bpm: 140, speechiness: 20, energy: 95 }, // Rock
    { userEmotionId: userEmotions[2].id, genreIndex: 5, rating: 4, bpm: 132, speechiness: 2, energy: 88 }, // Electronic
    { userEmotionId: userEmotions[2].id, genreIndex: 4, rating: 2, bpm: 150, speechiness: 92, energy: 90 }, // Hip-Hop
    
    // Pour Gratitude (userEmotion[3])
    { userEmotionId: userEmotions[3].id, genreIndex: 6, rating: 5, bpm: 95, speechiness: 30, energy: 80 }, // R&B
    { userEmotionId: userEmotions[3].id, genreIndex: 8, rating: 4, bpm: 80, speechiness: 20, energy: 70 }, // Reggae
    { userEmotionId: userEmotions[3].id, genreIndex: 2, rating: 4, bpm: 85, speechiness: 5, energy: 45 }, // Jazz
    { userEmotionId: userEmotions[3].id, genreIndex: 9, rating: 3, bpm: 75, speechiness: 25, energy: 60 }, // Folk
  ];

  for (const prefData of genrePreferencesData) {
    const userGenrePreference = new UserGenrePreference(
      0,
      prefData.userEmotionId,
      genres[prefData.genreIndex].id,
      prefData.rating,
      prefData.bpm,
      prefData.speechiness,
      prefData.energy,
    );
    await userGenrePrefsRepo.create(userGenrePreference, prefData.userEmotionId);
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`Created:
  - ${emotions.length} emotions
  - ${genres.length} genres
  - ${tracks.length} tracks
  - 1 user emotion profile
  - 1 user
  - ${userEmotions.length} user emotions
  - ${genrePreferencesData.length} user genre preferences`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });