import { InMemoryUserRepository } from "../in-memory-user.repository";

const userRepository = new InMemoryUserRepository();

async function createMockUser() {
    const user = await userRepository.create({
        id: 1,
        email: 'john@gmail.com',
        password: 'password123',
        name: 'John Doe',
        firstName: 'John',
        emotionProfile: {
            id: 1,
            userEmotions: [],
            updatedAt: new Date(),
            createdAt: new Date()
        },
    });
    return user;
}

export { createMockUser, userRepository };
