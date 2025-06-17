import { DomainModel } from '../../base/domain-model';
import { UserEmotionalProfile } from './UserEmotionalProfile';

export class User extends DomainModel {
  emotionProfile?: UserEmotionalProfile; // Made optional

  email: string;
  password: string;
  name: string;
  firstName: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: number,
    name: string,
    firstName: string,
    password: string,
    email: string,
    updatedAt?: Date,
    createdAt?: Date,
    emotionProfile?: UserEmotionalProfile, // Made optional

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