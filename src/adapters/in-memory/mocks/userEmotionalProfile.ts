import { UserEmotionalProfile } from "../../../core/domain/model/UserEmotionalProfile";
import { createMockUserEmotion } from "./user-emotion";

async function createMockUserEmotionalProfile(): Promise<UserEmotionalProfile> {
  // Crée un mock de UserEmotion minimal
  const { userEmotions } = await createMockUserEmotion();

  return new UserEmotionalProfile(
    1,                   // id
    userEmotions,        // userEmotions
    1,                   // userId
    new Date(),          // updatedAt
    new Date()           // createdAt
  );
}

export { createMockUserEmotionalProfile };