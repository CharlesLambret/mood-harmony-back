import { EntityMapper } from '../../../core/base/entity-mapper';
import { UserGenrePreference } from '../../../core/domain/model/UserGenrePreferences';
import { UserEmotion } from '../../../core/domain/model/UserEmotion';
import { Emotion } from '../../../core/domain/model/Emotion';
import { Genre } from '../../../core/domain/model/Genre';
import { Injectable } from '@nestjs/common';

// L'entité Prisma UserGenrePreference inclut les relations nécessaires
type UserGenrePreferenceEntity = {
  id: number;
  userEmotion: {
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
  genre: {
    id: number;
    name: string;
    icon_url: string;
    updatedAt?: Date;
    createdAt?: Date;
  };
  rating: number;
  bpm: number;
  speechiness: number;
  energy: number;
  updatedAt?: Date;
  createdAt?: Date;
};

@Injectable()
export class PrismaUserGenrePreferenceMapper implements EntityMapper<UserGenrePreference, UserGenrePreferenceEntity> {
  fromDomain(model: UserGenrePreference): UserGenrePreferenceEntity {
    return {
      id: model.id,
      userEmotion: {
        id: model.userEmotion.id,
        emotion: {
          id: model.userEmotion.emotion.id,
          name: model.userEmotion.emotion.name,
          icon_url: model.userEmotion.emotion.iconUrl,
          updatedAt: model.userEmotion.emotion.updatedAt,
          createdAt: model.userEmotion.emotion.createdAt,
        },
        genres: model.userEmotion.genres.map(genre => ({
          id: genre.id,
          name: genre.name,
          icon_url: genre.iconUrl,
          updatedAt: genre.updatedAt,
          createdAt: genre.createdAt,
        })),
        updatedAt: model.userEmotion.updatedAt,
        createdAt: model.userEmotion.createdAt,
      },
      genre: {
        id: model.genre.id,
        name: model.genre.name,
        icon_url: model.genre.iconUrl,
        updatedAt: model.genre.updatedAt,
        createdAt: model.genre.createdAt,
      },
      rating: model.rating,
      bpm: model.bpm,
      speechiness: model.speechiness,
      energy: model.energy,
      updatedAt: model.updatedAt,
      createdAt: model.createdAt,
    };
  }

  toDomain(entity: UserGenrePreferenceEntity): UserGenrePreference {
    return new UserGenrePreference(
      entity.id,
      {} as any, // userEmotionalProfile non utilisé dans le constructeur ici
      new UserEmotion(
        entity.userEmotion.id,
        new Emotion(
          entity.userEmotion.emotion.id,
          entity.userEmotion.emotion.name,
          entity.userEmotion.emotion.icon_url,
          entity.userEmotion.emotion.updatedAt,
          entity.userEmotion.emotion.createdAt
        ),
        entity.userEmotion.genres.map(
          genre =>
            new Genre(
              genre.id,
              genre.name,
              genre.icon_url,
              genre.updatedAt,
              genre.createdAt
            )
        ),
        entity.userEmotion.updatedAt,
        entity.userEmotion.createdAt
      ),
      new Genre(
        entity.genre.id,
        entity.genre.name,
        entity.genre.icon_url,
        entity.genre.updatedAt,
        entity.genre.createdAt
      ),
      entity.rating,
      entity.bpm,
      entity.speechiness,
      entity.energy,
      entity.updatedAt,
      entity.createdAt
    );
  }
}