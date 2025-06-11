import { DomainModel } from '../../base/domain-model';

export class Track extends DomainModel {
  name: string;
  length: number;
  trackHref: string;
  bpm: number;
  speechiness: number;
  energy: number;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: string,
    name: string,
    length: number,
    trackHref: string,
    bpm: number,
    speechiness: number,
    energy: number,
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);

    if (!name) {
      throw new Error('name is required');
    }

    if (!length) {
      throw new Error('length is required');
    }

    this.name = name;
    this.length = length;
    this.trackHref = trackHref;
    this.bpm = bpm;
    this.speechiness = speechiness;
    this.energy = energy;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
