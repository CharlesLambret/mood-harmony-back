import { Track } from "./Track";
import { DomainModel } from '../../base/domain-model';

export class SessionPhase extends DomainModel {
  sessionId: number;
  phaseNumber: number;
  duration: number;
  fromBpm : number
  toBpm: number;
  fromSpeechiness: number;
  toSpeechiness: number;
  fromEnergy: number;
  toEnergy: number;
  tracks: Track[];

  constructor(
    id: number,

    sessionId: number,
    phaseNumber: number,
    duration: number,
    fromBpm : number,
    toBpm: number,
    fromSpeechiness: number,
    toSpeechiness: number,
    fromEnergy: number,
    toEnergy: number,
    tracks: Track[] = []
  ) {
    super(id);

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    if (phaseNumber < 1) {
      throw new Error('Phase number must be greater than 0');
    }

    if (duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    if (fromBpm <= 0 || toBpm <= 0) {
      throw new Error('Start and target BPM must be greater than 0');
    }

    if (fromEnergy < 0 || fromEnergy > 1 || toEnergy < 0 || toEnergy > 1 ) {
      throw new Error(' Start and target energy must be between 0 and 1');
    }

    if (fromSpeechiness < 0 || fromSpeechiness > 100 || toSpeechiness < 0 || toSpeechiness > 100 ) {
      throw new Error('Target speechiness must be between 0 and 100');
    }

    this.sessionId = sessionId;
    this.phaseNumber = phaseNumber;
    this.duration = duration;
    this.toBpm = toBpm;
    this.fromBpm = fromBpm;
    this.fromSpeechiness = fromSpeechiness;
    this.toSpeechiness = toSpeechiness;
    this.fromEnergy = fromEnergy;
    this.toEnergy = toEnergy;
    this.tracks = tracks;
  }

  get actualDuration(): number {
    return this.tracks.reduce((sum, track) => sum + track.length, 0);
  }

  addTrack(track: Track): void {
    this.tracks.push(track);
  }
  deleteTrack(trackId: string): void {
    this.tracks = this.tracks.filter(track => track.id !== Number(trackId));
  }
}