import { SessionController } from './adapters/api/controller/session.controller';
import { GenerateSessionUseCase } from './core/usecases/create-session.use-case';
import { SessionRepository } from './core/domain/repository/session.repository';
import { EmotionRepository } from './core/domain/repository/emotion.repository';
import { UserGenrePreferenceRepository } from './core/domain/repository/userGenrePreferences.repository';
import { TrackRepository } from './core/domain/repository/track.repository';
import { userEmotionRepository } from './core/domain/repository/userEmotion.repository';
import { PrismaSessionRepository } from './adapters/prisma/prisma-session.repository';
import { PrismaEmotionRepository
import { PrismaUserGenrePreferenceRepository } from './adapters/prisma/prisma-userGenrePreference.repository';
import { PrismaTrackRepository } from './adapters/prisma/prisma-track.repository';
import { PrismaUserEmotionRepository } from './adapters/prisma/prisma-userEmotion.repository';
import { PrismaService } from './adapters/prisma/prisma.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [
    SessionController,
  ],
  providers: [
    PrismaService,
    {
      provide: SessionRepository,
      useFactory: (prisma: PrismaService) => new PrismaSessionRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: EmotionRepository,
      useFactory: (prisma: PrismaService) => new PrismaEmotionRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: UserGenrePreferenceRepository,
      useFactory: (prisma: PrismaService) => new PrismaUserGenrePreferenceRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: TrackRepository,
      useFactory: (prisma: PrismaService) => new PrismaTrackRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: userEmotionRepository,
      useFactory: (prisma: PrismaService) => new PrismaUserEmotionRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: GenerateSessionUseCase,
      useFactory: (
        sessionRepository: SessionRepository,
        userEmotionRepository: userEmotionRepository,
        userGenrePreferenceRepository: UserGenrePreferenceRepository,
        trackRepository: TrackRepository,
        emotionRepository: EmotionRepository,
      ) =>
        new GenerateSessionUseCase(
          sessionRepository,
          userEmotionRepository,
          userGenrePreferenceRepository,
          trackRepository,
          emotionRepository,
        ),
      inject: [
        SessionRepository,
        userEmotionRepository,
        UserGenrePreferenceRepository,
        TrackRepository,
        EmotionRepository,
      ],
    },
  ],
})
export class AppModule {}