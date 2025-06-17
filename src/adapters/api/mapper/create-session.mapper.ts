import { GenerateSessionCommand } from '../../../core/usecases/create-session.use-case';
import { GenerateSessionRequest } from '../request/create-session.request';
import { Session } from '../../../core/domain/model/Session';
import { GenerateSessionResponse, SessionPhaseResponse, TrackResponse } from '../response/create-session.response';

export class GenerateSessionMapper {
  static toDomain(
    request: GenerateSessionRequest,
  ): GenerateSessionCommand {
    return {
      userId: request.userId,
      emotionStartId: request.emotionStartId,
      emotionEndId: request.emotionEndId,
      duration: request.duration,
    };
  }

  static fromDomain(session: Session): GenerateSessionResponse {
    return {
      id: session.id,
      userEmotionalProfileId: session.userEmotionalProfileId,
      duration: session.duration,
      fromEmotion: {
        id: session.fromEmotion.id,
        name: session.fromEmotion.name,
        iconUrl: session.fromEmotion.iconUrl,
      },
      toEmotion: {
        id: session.toEmotion.id,
        name: session.toEmotion.name,
        iconUrl: session.toEmotion.iconUrl,
      },
      phases: session.phases.map(phase => this.mapPhaseToResponse(phase)),
      totalDuration: session.totalDuration,
      numberOfPhases: session.numberOfPhases,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  private static mapPhaseToResponse(phase: any): SessionPhaseResponse {
    return {
      id: phase.id,
      sessionId: phase.sessionId,
      phaseNumber: phase.phaseNumber,
      duration: phase.duration,
      fromBpm: phase.fromBpm,
      toBpm: phase.toBpm,
      fromSpeechiness: phase.fromSpeechiness,
      toSpeechiness: phase.toSpeechiness,
      fromEnergy: phase.fromEnergy,
      toEnergy: phase.toEnergy,
      tracks: phase.tracks.map(track => this.mapTrackToResponse(track)),
    };
  }

  private static mapTrackToResponse(track: any): TrackResponse {
    return {
      id: track.id,
      name: track.name,
      length: track.length,
      trackHref: track.trackHref,
      bpm: track.bpm,
      speechiness: track.speechiness,
      energy: track.energy,
      genre: {
        id: track.genre.id,
        name: track.genre.name,
        iconUrl: track.genre.iconUrl,
      },
    };
  }
}