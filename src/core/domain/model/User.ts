import { DomainModel } from '../../base/domain-model';
import { UserType } from '../type/UserType';

export class User extends DomainModel {
  email: string;
  passwordHash: string;
  name: string;
  firstName: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    id: string,
    email: string,
    passwordHash: string,
    type: UserType,
    name: string,
    firstName: string,
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    super(id);
    this.email = email;
    this.passwordHash = passwordHash;
    this.name = name;
    this.firstName = firstName;
    this.updatedAt = updatedAt || new Date();
    this.createdAt = createdAt || new Date();
  }
}
