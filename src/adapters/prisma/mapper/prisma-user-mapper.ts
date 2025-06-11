import { EntityMapper } from '../../../core/base/entity-mapper';
import { User } from '../../../core/domain/model/User';
import { User as UserEntity} from '@prisma/client';
import { Injectable } from '@nestjs/common';


@Injectable()
export class PrismaUserMapper implements EntityMapper<User, UserEntity> {
  fromDomain(model: User): UserEntity {
    return {
      id: model.id,
      email: model.email,
      password: model.password,
      updatedAt: model.updatedAt,
      createdAt: model.createdAt,
      name: model.name,
      firstName: model.firstName,
      emotionProfile: model.emotionProfile,
    };
  }

  toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
      name: entity.name,
      firstName: entity.firstName,
      emotionProfile: entity.emotionProfile,
    };
  }

  fromPartialDomain(data: Partial<User>): Partial<UserEntity> {
    const entity: Partial<UserEntity> = {};
    if (data.id !== undefined) entity.id = data.id;
    if (data.email !== undefined) entity.email = data.email;
    if (data.password !== undefined) entity.password = data.password;
    if (data.updatedAt !== undefined) entity.updatedAt = data.updatedAt;
    if (data.createdAt !== undefined) entity.createdAt = data.createdAt;
    if (data.name !== undefined) entity.name = data.name;
    if (data.firstName !== undefined) entity.firstName = data.firstName;
    if (data.emotionProfile !== undefined) entity.emotionProfile = data.emotionProfile;
    return entity;
  }
  
}