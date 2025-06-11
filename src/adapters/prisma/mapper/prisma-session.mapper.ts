import { EntityMapper } from '../../../core/base/entity-mapper';
import { Session } from '../../../core/domain/model/Session';
import { SessionPhase } from '../../../core/domain/model/SessionPhase';
import { Track } from '../../../core/domain/model/Track';
import { Emotion } from '../../../core/domain/model/Emotion';
import { Injectable } from '@nestjs/common';
import {Genre} from '../../../core/domain/model/Genre';

// Types Prisma étendus pour inclure les relations
type SessionEntityWithRelations = {
  id: number;
  duration: number;
  userEmotionProfileId: number;
  fromEmotionId: number;
  toEmotionId: number;
  createdAt?: Date;
  updatedAt?: Date;
  phases?: {
    id: number;
    sessionId: number;
    name: string;
    order_index: number;
    fromBpm: number;
    toBpm: number;
    fromSpeechiness: number;
    toSpeechiness: number;
    fromEnergy: number;
    toEnergy: number;
    tracks?: {
      sessionPhaseId: number;
      trackId: number;
      track: {
        id: number;
        name: string;
        length: number;
        track_href: string;
        bpm: number;
        speechiness: number;
        energy: number;
        genreId: number;
      };
    }[];
  }[];
  fromEmotion?: {
    id: number;
    name: string;
    icon_url: string;
  };
  toEmotion?: {
    id: number;
    name: string;
    icon_url: string;
  };
};

type SessionEntityBasic = {
  id?: number;
  duration: number;
  userEmotionProfileId: number;
  fromEmotionId: number;
  toEmotionId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

@Injectable()
export class PrismaSessionMapper implements EntityMapper<Session, SessionEntityWithRelations | SessionEntityBasic> {
  
  fromDomain(model: Session): SessionEntityBasic {
    return {
      id: model.id > 0 ? model.id : undefined, // Ne pas inclure l'ID si c'est 0 (création)
      duration: model.duration,
      userEmotionProfileId: model.userEmotionalProfileId,
      fromEmotionId: model.fromEmotion.id,
      toEmotionId: model.toEmotion.id,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  toDomain(entity: SessionEntityWithRelations): Session {
    // Mapper les émotions
    const fromEmotion = new Emotion(
      entity.fromEmotion?.id || entity.fromEmotionId,
      entity.fromEmotion?.name || '',
      entity.fromEmotion?.icon_url || ''
    );

    const toEmotion = new Emotion(
      entity.toEmotion?.id || entity.toEmotionId,
      entity.toEmotion?.name || '',
      entity.toEmotion?.icon_url || ''
    );

    // Mapper les phases si elles existent
    const phases: SessionPhase[] = entity.phases?.map(phase => {
    const tracks: Track[] = phase.tracks?.map(sessionTrack =>
      new Track(
        sessionTrack.track.id,
        sessionTrack.track.name,
        sessionTrack.track.length,
        sessionTrack.track.track_href,
        sessionTrack.track.bpm,
        sessionTrack.track.speechiness,
        sessionTrack.track.energy,
        new Genre(sessionTrack.track.genreId, '', '')
      )
    ) || [];

    return new SessionPhase(
      phase.id,
      phase.sessionId,
      phase.order_index,      
      entity.duration,        
      phase.fromBpm,
      phase.toBpm,
      phase.fromSpeechiness,
      phase.toSpeechiness,
      phase.fromEnergy,
      phase.toEnergy,
      tracks
    );
  }) || [];

    return new Session(
      entity.id,
      entity.userEmotionProfileId,
      entity.duration,
      fromEmotion,
      toEmotion,
      phases,
      entity.updatedAt,
      entity.createdAt
    );
  }
}