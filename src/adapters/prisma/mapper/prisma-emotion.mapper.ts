import { EntityMapper } from '../../../core/base/entity-mapper';
import { Emotion } from '../../../core/domain/model/Emotion';
import { Injectable } from '@nestjs/common';

type EmotionEntity = {
  id: number;
  name: string;
  icon_url: string;
  updatedAt?: Date;
  createdAt?: Date;
};

@Injectable()
export class PrismaEmotionMapper implements EntityMapper<Emotion, EmotionEntity> {
  fromDomain(model: Emotion): EmotionEntity {
    return {
      id: model.id,
      name: model.name,
      icon_url: model.iconUrl,
      updatedAt: model.updatedAt,
      createdAt: model.createdAt,
    };
  }

  toDomain(entity: EmotionEntity): Emotion {
    return new Emotion(
      entity.id,
      entity.name,
      entity.icon_url,
      entity.updatedAt,
      entity.createdAt
    );
  }
}