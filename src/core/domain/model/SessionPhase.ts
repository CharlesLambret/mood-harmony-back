import { Track } from "./Track";
import { DomainModel } from '../../base/domain-model';

export class SessionPhase extends DomainModel {
  phaseNumber: number;
  duration: number;
  fromBpm : number
  toBpm: number;
  fromSpeechiness: number;
  toSpeechiness: number;
  fromEnergy: number;
  toEnergy: number;
  tracks: Track[];
  sessionId?: number;

  constructor(
    id: number,

    phaseNumber: number,
    duration: number,
    fromBpm : number,
    toBpm: number,
    fromSpeechiness: number,
    toSpeechiness: number,
    fromEnergy: number,
    toEnergy: number,
    tracks: Track[] = [],
    sessionId?: number,

  ) {
    super(id);




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