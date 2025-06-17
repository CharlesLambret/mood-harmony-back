import { InMemoryUserRepository } from "../in-memory-user.repository";
import { createMockUserEmotionalProfile } from "./userEmotionalProfile";
const userRepository = new InMemoryUserRepository();

async function createMockUser() {
    const emotionalProfile = await createMockUserEmotionalProfile();
    const user = await userRepository.create({
        id: 1,
        email: 'john@gmail.com',
        password: 'password123',
        name: 'John Doe',
        firstName: 'John',
        emotionProfile: emotionalProfile,
    });
    return user;
}

export { createMockUser, userRepository };
