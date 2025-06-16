import { EntityMapper } from '../../../core/base/entity-mapper';
import { Track } from '../../../core/domain/model/Track';
import { Genre } from '../../../core/domain/model/Genre';
import { Injectable } from '@nestjs/common';

type TrackEntity = {
  id: number;
  name: string;
  length: number;
  track_href: string;
  bpm: number;
  speechiness: number;
  energy: number;
  genre: {
    id: number;
    name: string;
    iconUrl: string;
    updatedAt?: Date;
    createdAt?: Date;
  };
  updatedAt?: Date;
  createdAt?: Date;
};

@Injectable()
export class PrismaTrackMapper implements EntityMapper<Track, TrackEntity> {
  fromDomain(model: Track): TrackEntity {
    return {
      id: model.id,
      name: model.name,
      length: model.length,
      track_href: model.trackHref,
      bpm: model.bpm,
      speechiness: model.speechiness,
      energy: model.energy,
      genre: {
        id: model.genre.id,
        name: model.genre.name,
        iconUrl: model.genre.iconUrl,
        updatedAt: model.genre.updatedAt,
        createdAt: model.genre.createdAt,
      },
      updatedAt: model.updatedAt,
      createdAt: model.createdAt,
    };
  }

  toDomain(entity: TrackEntity): Track {
    return new Track(
      entity.id,
      entity.name,
      entity.length,
      entity.track_href,
      entity.bpm,
      entity.speechiness,
      entity.energy,
      new Genre(
        entity.genre.id,
        entity.genre.name,
        entity.genre.iconUrl,
        entity.genre.updatedAt,
        entity.genre.createdAt
      ),
      entity.updatedAt,
      entity.createdAt
    );
  }
}