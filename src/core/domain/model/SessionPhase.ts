import { Track } from "./Track";

export class SessionPhase {
  sessionId: string;
  phaseNumber: number;
  duration: number;
  targetBpm: number;
  targetEnergy: number;
  targetSpeechiness: number;
  tracks: Track[];

  constructor(
    sessionId: string,
    phaseNumber: number,
    duration: number,
    targetBpm: number,
    targetEnergy: number,
    targetSpeechiness: number,
    tracks: Track[] = []
  ) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    if (phaseNumber < 1) {
      throw new Error('Phase number must be greater than 0');
    }

    if (duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    if (targetBpm <= 0) {
      throw new Error('Target BPM must be greater than 0');
    }

    if (targetEnergy < 0 || targetEnergy > 100) {
      throw new Error('Target energy must be between 0 and 100');
    }

    if (targetSpeechiness < 0 || targetSpeechiness > 100) {
      throw new Error('Target speechiness must be between 0 and 100');
    }

    this.sessionId = sessionId;
    this.phaseNumber = phaseNumber;
    this.duration = duration;
    this.targetBpm = targetBpm;
    this.targetEnergy = targetEnergy;
    this.targetSpeechiness = targetSpeechiness;
    this.tracks = tracks;
  }

  get actualDuration(): number {
    return this.tracks.reduce((sum, track) => sum + track.length, 0);
  }

  addTrack(track: Track): void {
    this.tracks.push(track);
  }
  deleteTrack(trackId: string): void {
    this.tracks = this.tracks.filter(track => track.id !== trackId);
  }
}