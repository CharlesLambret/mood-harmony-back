import { DomainModel } from '../../base/domain-model';
import { Emotion } from './Emotion';
import { UserGenrePreference } from './UserGenrePreferences';

export class UserEmotion extends DomainModel {
  emotion: Emotion;
  userId: number;
  userEmotionProfileId: number; // Assuming this is the ID of the UserEmotionalProfile this UserEmotion belongs to
  userGenrePreferences: UserGenrePreference[];
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    emotion: Emotion,
    userId: number,
    userEmotionProfileId: number,
    userGenrePreferences: UserGenrePreference[],
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);

    this.emotion = emotion;
    this.userId = userId;
    this.userEmotionProfileId = userEmotionProfileId;
    this.userGenrePreferences = userGenrePreferences;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}