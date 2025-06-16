import { InMemoryUserEmotionRepository } from "../in-memory-user-emotions.repository";
import { createMockEmotions } from "./emotions";
import { createMockUserGenrePreferences } from "./user-genre-preferences";

const userEmotionRepository = new InMemoryUserEmotionRepository();

async function createMockUserEmotion() {
    const { startEmotion, endEmotion } = await createMockEmotions();
    const { userGenrePreferences } = await createMockUserGenrePreferences();
    
    // Créer UserEmotion pour startEmotion
    const startUserEmotion = await userEmotionRepository.create({
        emotion: startEmotion,
        userGenrePreferences: userGenrePreferences.filter(ugp => ugp.useremotionId === 1),
        userId: 1,
        userEmotionProfileId: 1,
    });

    // Créer UserEmotion pour endEmotion
    const endUserEmotion = await userEmotionRepository.create({
        emotion: endEmotion,
        userGenrePreferences: userGenrePreferences.filter(ugp => ugp.useremotionId === 2),
        userId: 1,
        userEmotionProfileId: 1,
    });

    return { 
        startUserEmotion, 
        endUserEmotion, 
        userEmotions: [startUserEmotion, endUserEmotion],
        userEmotionRepository 
    };
}

export { createMockUserEmotion };