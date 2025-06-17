import { UserGenrePreference } from "src/core/domain/model/UserGenrePreferences";
import { InMemoryUserGenrePreferenceRepository } from "../in-memory-genre-preferences.repository";

const userGenrePreferencesRepository = new InMemoryUserGenrePreferenceRepository();

async function createMockUserGenrePreferences() {
    const data = [
        // UserEmotion 1 (startEmotion) - Pop avec meilleur rating
        { userEmotionId: 1, genreId: 1, rating: 5, bpm: 120, speechiness: 10, energy: 0.8 },
        { userEmotionId: 1, genreId: 1, rating: 4, bpm: 122, speechiness: 11, energy: 0.75 },
        
        // UserEmotion 1 (startEmotion) - Rock
        { userEmotionId: 1, genreId: 2, rating: 3, bpm: 130, speechiness: 15, energy: 0.7 },
        { userEmotionId: 1, genreId: 2, rating: 2, bpm: 132, speechiness: 14, energy: 0.68 },
        
        // UserEmotion 1 (startEmotion) - Jazz (genre commun)
        { userEmotionId: 1, genreId: 3, rating: 3, bpm: 110, speechiness: 8, energy: 0.6 },
        
        // UserEmotion 2 (endEmotion) - Rock avec meilleur rating
        { userEmotionId: 2, genreId: 2, rating: 5, bpm: 135, speechiness: 16, energy: 0.8 },
        { userEmotionId: 2, genreId: 2, rating: 4, bpm: 137, speechiness: 15, energy: 0.78 },
        
        // UserEmotion 2 (endEmotion) - Pop
        { userEmotionId: 2, genreId: 1, rating: 3, bpm: 128, speechiness: 11, energy: 0.75 },
        { userEmotionId: 2, genreId: 1, rating: 2, bpm: 130, speechiness: 12, energy: 0.72 },
        
        // UserEmotion 2 (endEmotion) - Jazz (genre commun avec même genreId)
        { userEmotionId: 2, genreId: 3, rating: 4, bpm: 105, speechiness: 7, energy: 0.5 },
        
        // UserEmotion 2 (endEmotion) - Electro
        { userEmotionId: 2, genreId: 4, rating: 3, bpm: 125, speechiness: 13, energy: 0.85 },
    ];
    
    const userGenrePreferences: UserGenrePreference[] = [];
    for (const pref of data) {
        userGenrePreferences.push(await userGenrePreferencesRepository.create(pref));
    }

    return { userGenrePreferences, userGenrePreferencesRepository };
}

export { createMockUserGenrePreferences };