import { DomainModel } from '../../base/domain-model';
import { UserEmotionalProfile } from './UserEmotionalProfile';

export class User extends DomainModel {
  email: string;
  password: string;
  name: string;
  firstName: string;
  emotionProfile : UserEmotionalProfile;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    email: string,
    password: string,
    emotionProfile : UserEmotionalProfile,

    name: string,
    firstName: string,
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);
    this.email = email;
    this.password = password;
    this.name = name;
    this.firstName = firstName;
    this.emotionProfile = emotionProfile;

    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
