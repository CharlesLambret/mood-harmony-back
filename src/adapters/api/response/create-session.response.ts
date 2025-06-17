import { ApiProperty } from '@nestjs/swagger';

export class TrackResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  length: number;

  @ApiProperty()
  trackHref: string;

  @ApiProperty()
  bpm: number;

  @ApiProperty({ type: 'number', format: 'float' })
  speechiness: number;

  @ApiProperty()
  energy: number;

  @ApiProperty()
  genre: {
    id: number;
    name: string;
    iconUrl: string;
  };
}

export class SessionPhaseResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  sessionId: number;

  @ApiProperty()
  phaseNumber: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  fromBpm: number;

  @ApiProperty()
  toBpm: number;

  @ApiProperty({ type: 'number', format: 'float' })
  fromSpeechiness: number;

  @ApiProperty({ type: 'number', format: 'float' })
  toSpeechiness: number;

  @ApiProperty({ type: 'number', format: 'float' })
  fromEnergy: number;

  @ApiProperty({ type: 'number', format: 'float' })
  toEnergy: number;

  @ApiProperty({ type: [TrackResponse] })
  tracks: TrackResponse[];
}

export class GenerateSessionResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userEmotionalProfileId: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  fromEmotion: {
    id: number;
    name: string;
    iconUrl: string;
  };

  @ApiProperty()
  toEmotion: {
    id: number;
    name: string;
    iconUrl: string;
  };

  @ApiProperty({ type: [SessionPhaseResponse] })
  phases: SessionPhaseResponse[];

  @ApiProperty()
  totalDuration: number;

  @ApiProperty()
  numberOfPhases: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}