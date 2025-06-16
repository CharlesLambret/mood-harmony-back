import { UserGenrePreference } from "src/core/domain/model/UserGenrePreferences";
import { InMemoryUserGenrePreferenceRepository } from "../in-memory-genre-preferences.repository";

const userGenrePreferencesRepository = new InMemoryUserGenrePreferenceRepository();

async function createMockUserGenrePreferences() {
    const data = [
        // Pop pour emotion 1
        { useremotionId: 1, genreId: 1, rating: 5, bpm: 120, speechiness: 10, energy: 0.8 },
        { useremotionId: 1, genreId: 1, rating: 4, bpm: 122, speechiness: 11, energy: 0.75 },
        { useremotionId: 1, genreId: 1, rating: 3, bpm: 124, speechiness: 12, energy: 0.7 },

        // Rock pour emotion 1
        { useremotionId: 1, genreId: 2, rating: 4, bpm: 130, speechiness: 15, energy: 0.7 },
        { useremotionId: 1, genreId: 2, rating: 3, bpm: 132, speechiness: 14, energy: 0.68 },
        { useremotionId: 1, genreId: 2, rating: 2, bpm: 134, speechiness: 13, energy: 0.65 },

        // Jazz pour emotion 1
        { useremotionId: 1, genreId: 3, rating: 3, bpm: 110, speechiness: 8, energy: 0.6 },
        { useremotionId: 1, genreId: 3, rating: 2, bpm: 112, speechiness: 9, energy: 0.58 },
        { useremotionId: 1, genreId: 3, rating: 1, bpm: 114, speechiness: 10, energy: 0.55 },

        // Electro pour emotion 1
        { useremotionId: 1, genreId: 4, rating: 2, bpm: 125, speechiness: 12, energy: 0.9 },
        { useremotionId: 1, genreId: 4, rating: 1, bpm: 127, speechiness: 13, energy: 0.88 },
        { useremotionId: 1, genreId: 4, rating: 1, bpm: 129, speechiness: 14, energy: 0.85 },

        // Pop pour emotion 2
        { useremotionId: 2, genreId: 1, rating: 4, bpm: 128, speechiness: 11, energy: 0.75 },
        { useremotionId: 2, genreId: 1, rating: 3, bpm: 130, speechiness: 12, energy: 0.72 },
        { useremotionId: 2, genreId: 1, rating: 2, bpm: 132, speechiness: 13, energy: 0.7 },

        // Rock pour emotion 2
        { useremotionId: 2, genreId: 2, rating: 5, bpm: 135, speechiness: 16, energy: 0.8 },
        { useremotionId: 2, genreId: 2, rating: 4, bpm: 137, speechiness: 15, energy: 0.78 },
        { useremotionId: 2, genreId: 2, rating: 3, bpm: 139, speechiness: 14, energy: 0.75 },

        // Jazz pour emotion 2
        { useremotionId: 2, genreId: 3, rating: 2, bpm: 105, speechiness: 7, energy: 0.5 },
        { useremotionId: 2, genreId: 3, rating: 1, bpm: 107, speechiness: 8, energy: 0.48 },
        { useremotionId: 2, genreId: 3, rating: 1, bpm: 109, speechiness: 9, energy: 0.45 },

        // Electro pour emotion 2
        { useremotionId: 2, genreId: 4, rating: 3, bpm: 122, speechiness: 13, energy: 0.85 },
        { useremotionId: 2, genreId: 4, rating: 2, bpm: 124, speechiness: 14, energy: 0.82 },
        { useremotionId: 2, genreId: 4, rating: 1, bpm: 126, speechiness: 15, energy: 0.8 }
    ];
    
    const userGenrePreferences: UserGenrePreference[] = [];
    for (const pref of data) {
        userGenrePreferences.push(await userGenrePreferencesRepository.create(pref));
    }

    return { userGenrePreferences, userGenrePreferencesRepository };
}

export { createMockUserGenrePreferences };