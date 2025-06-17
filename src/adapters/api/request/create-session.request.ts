import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class GenerateSessionRequest {
  @ApiProperty({
    description: 'ID of the user',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'ID of the starting emotion',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  emotionStartId: number;

  @ApiProperty({
    description: 'ID of the target emotion',
    example: 5
  })
  @IsNumber()
  @IsPositive()
  emotionEndId: number;

  @ApiProperty({
    description: 'Duration of the session in minutes (30, 45, or 60)',
    example: 45,
    enum: [30, 45, 60]
  })
  @IsNumber()
  @Min(30)
  @Max(60)
  duration: number;

  constructor(userId:number, emotionStartId: number, emotionEndId: number, duration: number) {
    this.userId = userId;
    this.emotionStartId = emotionStartId;
    this.emotionEndId = emotionEndId;
    this.duration = duration;
  }
}