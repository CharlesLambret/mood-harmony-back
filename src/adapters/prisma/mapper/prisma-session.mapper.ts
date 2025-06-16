import { EntityMapper } from 'src/core/base/entity-mapper';
import { Session } from '../../../core/domain/model/Session';
import { SessionPhase } from '../../../core/domain/model/SessionPhase';
import { Track } from '../../../core/domain/model/Track';
import { Emotion } from '../../../core/domain/model/Emotion';
import { Injectable } from '@nestjs/common';
import { Genre } from '../../../core/domain/model/Genre';

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
    phaseNumber: number;
    duration: number;
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
    iconUrl: string;
  };
  toEmotion?: {
    id: number;
    name: string;
    iconUrl: string;
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
      entity.fromEmotion?.iconUrl || ''
    );

    const toEmotion = new Emotion(
      entity.toEmotion?.id || entity.toEmotionId,
      entity.toEmotion?.name || '',
      entity.toEmotion?.iconUrl || ''
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
          new Genre(
            sessionTrack.track.genreId,
            'Pop', // TODO: Récupérer le vrai nom du genre depuis la DB
            'icon.url'  // TODO: Récupérer la vraie URL d'icône depuis la DB
          )
        )
      ) || [];

      return new SessionPhase(
        phase.id,
        phase.phaseNumber,
        phase.duration, // CORRECTION: Utiliser phase.duration au lieu de entity.duration
        phase.fromBpm,
        phase.toBpm,
        phase.fromSpeechiness,
        phase.toSpeechiness,
        phase.fromEnergy,
        phase.toEnergy,
        tracks,
        phase.sessionId,

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