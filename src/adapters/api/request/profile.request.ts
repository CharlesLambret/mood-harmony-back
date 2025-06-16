import { UserEmotionalProfile } from "../../../core/domain/model/UserEmotionalProfile";

export type ProfileRequest = {
  id: number;
  email: string;
  name: string;
  firstName: string;
  emotionProfile: UserEmotionalProfile
};