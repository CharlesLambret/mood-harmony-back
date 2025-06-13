import { EntityMapper } from '../../../core/base/entity-mapper';
import { Genre } from '../../../core/domain/model/Genre';
import { Injectable } from '@nestjs/common';

type GenreEntity = {
  id: number;
  name: string;
  icon_url: string;
  updatedAt?: Date;
  createdAt?: Date;
};

@Injectable()
export class PrismaGenreMapper implements EntityMapper<Genre, GenreEntity> {
  fromDomain(model: Genre): GenreEntity {
    return {
      id: model.id,
      name: model.name,
      icon_url: model.iconUrl,
      updatedAt: model.updatedAt,
      createdAt: model.createdAt,
    };
  }

  toDomain(entity: GenreEntity): Genre {
    return new Genre(
      entity.id,
      entity.name,
      entity.icon_url,
      entity.updatedAt,
      entity.createdAt
    );
  }
}