import { DomainModel } from '../../base/domain-model';

export class Genre extends DomainModel {
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
      throw new Error('Name is required');
    }

    if (!iconUrl) {
      throw new Error('Description is required');
    }

    this.name = name;
    this.iconUrl = iconUrl;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
