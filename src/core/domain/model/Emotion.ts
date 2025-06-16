import { DomainModel } from '../../base/domain-model';

export class Emotion extends DomainModel {
  name: string;
  iconUrl: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    name: string,
    iconUrl: string,
   
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);

    if (!name) {
      this.name = 'Unknown Emotion';
    }

    if (!iconUrl) {
      this.iconUrl = 'https://example.com/default-icon.png';
    }

    this.name = name;
    this.iconUrl = iconUrl;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
