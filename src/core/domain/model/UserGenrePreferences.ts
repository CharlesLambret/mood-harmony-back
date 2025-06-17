import { DomainModel } from '../../base/domain-model';
import { UserEmotion } from './UserEmotion';
import { Genre } from './Genre';
import { UserEmotionalProfile } from './UserEmotionalProfile';

export class UserGenrePreference extends DomainModel {
  userEmotionId: number;
  genreId: number;
  rating: number;
  bpm: number;
  speechiness: number;
  energy: number;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    
    userEmotionId: number,
    genreId: number,
    rating: number,
    bpm: number,
    speechiness: number,
    energy: number,
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);
    this.userEmotionId = userEmotionId;
    this.genreId = genreId;
    this.rating = rating;
    this.bpm = bpm;
    this.speechiness = speechiness;
    this.energy = energy;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
