import { DomainModel } from '../../base/domain-model';
import { UserEmotion } from './UserEmotion';
import { User } from './User';

export class UserEmotionalProfile extends DomainModel {
  user: User;
  userEmotions : UserEmotion[];
  
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    user: User,
    userEmotions: UserEmotion[],
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);

    if (!user) {
      throw new Error('User is required');
    }

    if (!userEmotions) {
      throw new Error('At least one emotion is required is required');
    }

    this.user = user;
    this.userEmotions = userEmotions;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
