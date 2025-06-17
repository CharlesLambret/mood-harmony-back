import { EntityMapper } from '../../../core/base/entity-mapper';
import { UserGenrePreference } from '../../../core/domain/model/UserGenrePreferences';
import { Injectable } from '@nestjs/common';

type UserGenrePreferenceEntity = {
  id: number;
  userEmotion: {
    id: number;
  };
  genre: {
    id: number;
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
        id: model.userEmotionId,
      },
      genre: {
        id: model.genreId,
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
      entity.userEmotion.id,
      entity.genre.id,
      entity.rating,
      entity.bpm,
      entity.speechiness,
      entity.energy,
      entity.updatedAt,
      entity.createdAt
    );
  }
}