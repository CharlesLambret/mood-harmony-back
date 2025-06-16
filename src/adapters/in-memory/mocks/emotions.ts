import { InMemoryEmotionRepository } from "../in-memory-emotion.repository";

const emotionRepository = new InMemoryEmotionRepository();

async function createMockEmotions() {
    const startEmotion = await emotionRepository.create({
        name: 'Happy',
        iconUrl: 'icon1.png'
    });
    const endEmotion = await emotionRepository.create({
        name: 'Calm',
        iconUrl: 'icon2.png'
    });
    const emotion = await emotionRepository.create({
        name: 'Happy',
        iconUrl: 'icon1.png'
    });
    return { startEmotion, endEmotion, emotion ,  emotionRepository };
}

export { createMockEmotions };
