import { UserType } from '../../../core/domain/type/UserType';

export type ProfileRequest = {
  id: number;
  email: string;
  type: UserType;
};
