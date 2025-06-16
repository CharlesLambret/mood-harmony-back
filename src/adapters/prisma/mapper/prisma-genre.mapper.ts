import { EntityMapper } from '../../../core/base/entity-mapper';
import { Genre } from '../../../core/domain/model/Genre';
import { Injectable } from '@nestjs/common';

type GenreEntity = {
  id: number;
  name: string;
  iconUrl: string;
  updatedAt?: Date;
  createdAt?: Date;
};

@Injectable()
export class PrismaGenreMapper implements EntityMapper<Genre, GenreEntity> {
  fromDomain(model: Genre): GenreEntity {
    return {
      id: model.id,
      name: model.name,
      iconUrl: model.iconUrl,
      updatedAt: model.updatedAt,
      createdAt: model.createdAt,
    };
  }

  toDomain(entity: GenreEntity): Genre {
    return new Genre(
      entity.id,
      entity.name,
      entity.iconUrl,
      entity.updatedAt,
      entity.createdAt
    );
  }
}