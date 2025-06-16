import { InMemoryUserEmotionRepository } from "../in-memory-user-emotions.repository";
import { createMockEmotions } from "./emotions";
import { createMockUserGenrePreferences } from "./user-genre-preferences";

const userEmotionRepository = new InMemoryUserEmotionRepository();
async function createMockUserEmotion() {
    const emotion = (await createMockEmotions()).emotion;
    const userGenrePreferences = (await createMockUserGenrePreferences()).userGenrePreferences;
    const userEmotion = await userEmotionRepository.create({
        emotion,
        userGenrePreferences: userGenrePreferences,
        userId: 1,
        userEmotionProfileId: 1,
    });
    return {userEmotion, userEmotionRepository};
}

export { createMockUserEmotion };
