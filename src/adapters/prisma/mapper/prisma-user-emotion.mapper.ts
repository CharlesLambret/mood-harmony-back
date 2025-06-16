import { EntityMapper } from '../../../core/base/entity-mapper';
import { UserEmotion } from '../../../core/domain/model/UserEmotion';
import { Emotion } from '../../../core/domain/model/Emotion';
import { UserGenrePreference } from '../../../core/domain/model/UserGenrePreferences';
import { Injectable } from '@nestjs/common';

type UserEmotionEntity = {
  id: number;
  
  emotion: {
    id: number;
    name: string;
    iconUrl: string;
    updatedAt?: Date;
    createdAt?: Date;
  };
  userId: number; 
  userEmotionProfileId: number;
  userGenrePreferences: {
    id: number;
    genreId: number;
    rating: number;
    bpm: number;
    speechiness: number;
    energy: number;
    updatedAt?: Date;
    createdAt?: Date;
    // ... autres champs si besoin
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
        iconUrl: model.emotion.iconUrl,
        updatedAt: model.emotion.updatedAt,
        createdAt: model.emotion.createdAt,
      },
      userId: model.userId,
      userEmotionProfileId: model.userEmotionProfileId,
      userGenrePreferences: model.userGenrePreferences.map(pref => ({
        id: pref.id,
        genreId: pref.genreId,
        rating: pref.rating,
        bpm: pref.bpm,
        speechiness: pref.speechiness,
        energy: pref.energy,
        updatedAt: pref.updatedAt,
        createdAt: pref.createdAt,
        // ... autres champs si besoin
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
      entity.emotion.iconUrl,
      entity.emotion.updatedAt,
      entity.emotion.createdAt
      ),
      entity.userId,
      entity.userEmotionProfileId,
      entity.userGenrePreferences.map(
        pref =>
          new UserGenrePreference(
            pref.id,
            entity.id, // userEmotionId
            pref.genreId, // genreId (assure-toi que ce champ existe dans l'entité)
            pref.rating,
            pref.bpm,
            pref.speechiness,
            pref.energy,
            pref.updatedAt,
            pref.createdAt
          )
      ),
      entity.updatedAt,
      entity.createdAt
    );
  }
}