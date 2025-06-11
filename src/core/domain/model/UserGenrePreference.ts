import { DomainModel } from '../../base/domain-model';
import { Emotion } from './Emotion';
import { Genre } from './Genre';
import { UserEmotionalProfile } from './UserEmotionalProfile';

export class UserGenrePreference extends DomainModel {
  userEmotionalProfile: UserEmotionalProfile;
  emotion: Emotion;
  genre: Genre;
  rating: number;
  bpm: number;
  speechiness: number;
  energy: number;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: string,
    userEmotionalProfile: UserEmotionalProfile,
    emotion: Emotion,
    genre: Genre,
    rating: number,
    bpm: number,
    speechiness: number,
    energy: number,
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);
    this.userEmotionalProfile = userEmotionalProfile;
    this.emotion = emotion;
    this.genre = genre;
    this.rating = rating;
    this.bpm = bpm;
    this.speechiness = speechiness;
    this.energy = energy;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
