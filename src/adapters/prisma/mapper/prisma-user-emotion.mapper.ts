import { EntityMapper } from '../../../core/base/entity-mapper';
import { UserEmotion } from '../../../core/domain/model/UserEmotion';
import { Emotion } from '../../../core/domain/model/Emotion';
import { Genre } from '../../../core/domain/model/Genre';
import { Injectable } from '@nestjs/common';

// L'entité Prisma UserEmotion inclut les relations nécessaires
type UserEmotionEntity = {
  id: number;
  emotion: {
    id: number;
    name: string;
    icon_url: string;
    updatedAt?: Date;
    createdAt?: Date;
  };
  genres: {
    id: number;
    name: string;
    icon_url: string;
    updatedAt?: Date;
    createdAt?: Date;
  }[];
  updatedAt?: Date;
  createdAt?: Date;
};

@Injectable()
export class PrismaUserEmotionMapper implements EntityMapper<UserEmotion, UserEmotionEntity> {
  fromDomain(model: UserEmotion): UserEmotionEntity {
    return {
      id: model.id,
      emotion: {
        id: model.emotion.id,
        name: model.emotion.name,
        icon_url: model.emotion.iconUrl,
        updatedAt: model.emotion.updatedAt,
        createdAt: model.emotion.createdAt,
      },
      genres: model.genres.map(genre => ({
        id: genre.id,
        name: genre.name,
        icon_url: genre.iconUrl,
        updatedAt: genre.updatedAt,
        createdAt: genre.createdAt,
      })),
      updatedAt: model.updatedAt,
      createdAt: model.createdAt,
    };
  }

  toDomain(entity: UserEmotionEntity): UserEmotion {
    return new UserEmotion(
      entity.id,
      new Emotion(
        entity.emotion.id,
        entity.emotion.name,
        entity.emotion.icon_url,
        entity.emotion.updatedAt,
        entity.emotion.createdAt
      ),
      entity.genres.map(
        genre =>
          new Genre(
            genre.id,
            genre.name,
            genre.icon_url,
            genre.updatedAt,
            genre.createdAt
          )
      ),
      entity.updatedAt,
      entity.createdAt
    );
  }
}