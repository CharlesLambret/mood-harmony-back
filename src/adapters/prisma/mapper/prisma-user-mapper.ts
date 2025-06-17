import { EntityMapper } from '../../../core/base/entity-mapper';
import { User } from '../../../core/domain/model/User';
import { User as UserEntity, UserEmotionProfile as UserEmotionProfileEntity } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UserEmotionalProfile } from '../../../core/domain/model/UserEmotionalProfile';

@Injectable()
export class PrismaUserMapper implements EntityMapper<User, UserEntity> {
  fromDomain(model: User): UserEntity {
    return {
      id: model.id,
      name: model.name,
      firstName: model.firstName,
      password: model.password,
      email: model.email,
      emotionProfileId: model.emotionProfile ? model.emotionProfile.id : null,
    };
  }

  toDomain(entity: UserEntity & { emoProfile?: UserEmotionProfileEntity }): User {
    let emotionProfile: UserEmotionalProfile | null = null;
    
    if (entity.emoProfile) {
      const emoProfileEntity = entity.emoProfile;
      // Fix: You need to provide all required constructor parameters for UserEmotionalProfile
      // Based on your domain model, you likely need to check what parameters the constructor expects
      // This is a guess - you may need to adjust based on your actual UserEmotionalProfile constructor
      emotionProfile = new UserEmotionalProfile(
        emoProfileEntity.id,
        [], // Empty array for userEmotions
        emoProfileEntity.userId
      );
    }

    // Fix: Always return a User instance
    return new User(
      entity.id,
      entity.name,
      entity.firstName,
      entity.password,
      entity.email,
      new Date(), // updatedAt
      new Date(), // createdAt
      emotionProfile || undefined // Made optional in your User constructor
    );
  }

  fromPartialDomain(data: Partial<User>): Partial<UserEntity> {
    const entity: Partial<UserEntity> = {};
    
    if (data.id !== undefined) entity.id = data.id;
    if (data.email !== undefined) entity.email = data.email;
    // Fix: Use correct field name from Prisma schema
    if (data.password !== undefined) entity.password = data.password; // Changed from passwordHash
    if (data.name !== undefined) entity.name = data.name;
    // Fix: Use correct field name from Prisma schema
    if (data.firstName !== undefined) entity.firstName = data.firstName; // Changed from first_name
    
    // Gestion du profil émotionnel
    if (data.emotionProfile !== undefined) {
      // Fix: Use correct field name from Prisma schema
      entity.emotionProfileId = data.emotionProfile?.id ?? null; // Changed from emoProfileId
    }
    
    return entity;
  }
}