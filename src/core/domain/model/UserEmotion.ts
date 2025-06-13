import { DomainModel } from '../../base/domain-model';
import { Emotion } from './Emotion';
import { Genre } from './Genre';

export class UserEmotion extends DomainModel {
  emotion: Emotion;
  genres: Genre[];
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    emotion: Emotion,
    genres: Genre[],
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);

    this.emotion = emotion;
    this.genres = genres;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
