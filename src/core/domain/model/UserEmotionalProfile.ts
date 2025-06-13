import { DomainModel } from '../../base/domain-model';
import { UserEmotion } from './UserEmotion';
import { User } from './User';

export class UserEmotionalProfile extends DomainModel {
  userEmotions : UserEmotion[];
  
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    userEmotions: UserEmotion[],
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);

    

    if (!userEmotions) {
      throw new Error('At least one emotion is required is required');
    }

    this.userEmotions = userEmotions;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
