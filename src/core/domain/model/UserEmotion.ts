import { DomainModel } from '../../base/domain-model';
import { Emotion } from './Emotion';
import { Genre } from './Genre';
import { UserEmotionalProfile } from './UserEmotionalProfile';

export class UserEmotion extends DomainModel {
  userEmotionalProfile: UserEmotionalProfile;
  emotion: Emotion;
  genres: Genre[];
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    userEmotionalProfile: UserEmotionalProfile,
    emotion: Emotion,
    genres: Genre[],
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);

    this.userEmotionalProfile = userEmotionalProfile;
    this.emotion = emotion;
    this.genres = genres;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
