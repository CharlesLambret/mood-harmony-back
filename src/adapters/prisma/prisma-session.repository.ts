import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../core/domain/repository/session.repository';
import { PrismaSessionMapper } from './mapper/prisma-session.mapper';
import { Session } from '../../core/domain/model/Session';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  private mapper: PrismaSessionMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new PrismaSessionMapper();
  }


  // ...existing code...
  async create(session: Session): Promise<Session> {
    const data = {
      userEmotionProfileId: session.userEmotionalProfileId,
      duration: session.duration,
      fromEmotionId: session.fromEmotion.id,
      toEmotionId: session.toEmotion.id,
      phases: {
        create: session.phases?.map((phase, idx) => ({
          sessionId: session.id,
          phaseNumber: phase.phaseNumber ?? idx + 1, // phaseNumber correspond à l'ordre dans ton modèle
          duration: phase.duration, // Ajout du champ duration requis par Prisma
          fromBpm: phase.fromBpm,
          toBpm: phase.toBpm,
          fromSpeechiness: phase.fromSpeechiness,
          toSpeechiness: phase.toSpeechiness,
          fromEnergy: phase.fromEnergy,
          toEnergy: phase.toEnergy,
          tracks: {
            create: phase.tracks?.map(track => ({
              trackId: track.id // Track est un modèle, donc .id
            })) || []
          }
        })) || []
      }
    };

    const createdEntity = await this.prisma.session.create({
      data,
      include: {
      fromEmotion: true,
      toEmotion: true,
      phases: {
        include: {
        tracks: {
          include: {
          track: true
          }
        }
        },
        select: {
        id: true,
        sessionId: true,
        phaseNumber: true,
        duration: true,
        fromBpm: true,
        toBpm: true,
        fromSpeechiness: true,
        toSpeechiness: true,
        fromEnergy: true,
        toEnergy: true,
        tracks: {
          include: {
          track: true
          }
        }
        },
        orderBy: {
        phaseNumber: 'asc'
        }
      }
      }
    });

    return this.mapper.toDomain(createdEntity);
  }
// ...existing code...
  async findById(id: number): Promise<Session | null> {
    const entity = await this.prisma.session.findUnique({ 
      where: { id },
      include: {
        fromEmotion: true,
        toEmotion: true,
        phases: {
          include: {
            tracks: {
              include: {
                track: true
              }
            }
          },
          orderBy: {
            phaseNumber: 'asc'
          }
        }
      }
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapper.toDomain(entity);
  }

  async findByUserId(userId: number): Promise<Session[]> {
    // Récupère d'abord le profil émotionnel de l'utilisateur
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        emotionProfile: true
      }
    });

    if (!userProfile || !userProfile.emotionProfileId) {
      return [];
    }

    const entities = await this.prisma.session.findMany({
      where: { 
        userEmotionProfileId: userProfile.emotionProfileId
      },
      include: {
        fromEmotion: true,
        toEmotion: true,
        phases: {
          include: {
            tracks: {
              include: {
                track: true
              }
            }
          },
          orderBy: {
            phaseNumber: 'asc'
          }
        }
      },
     
    });
    
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async findAll(): Promise<Session[]> {
    const entities = await this.prisma.session.findMany({
      include: {
        fromEmotion: true,
        toEmotion: true,
        phases: {
          include: {
            tracks: {
              include: {
                track: true
              }
            }
          },
          orderBy: {
            phaseNumber: 'asc'
          }
        }
      },
    
    });
    
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async update(id: number, session: Session): Promise<Session | null> {
    const entity = this.mapper.fromDomain(session);
    
    try {
      const updatedEntity = await this.prisma.session.update({
        where: { id },
        data: entity,
        include: {
          fromEmotion: true,
          toEmotion: true,
          phases: {
            include: {
              tracks: {
                include: {
                  track: true
                }
              }
            },
            orderBy: {
              phaseNumber: 'asc'
            }
          }
        }
      });
      
      return this.mapper.toDomain(updatedEntity);
    } catch (error) {
      return null;
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.sessionTrack.deleteMany({
        where: {
          sessionPhase: {
            sessionId: id
          }
        }
      });
      await tx.sessionPhase.deleteMany({
        where: {
          sessionId: id
        }
      });
      await tx.session.delete({
        where: { id }
      });
    });
  }

  async removeAll(): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.sessionTrack.deleteMany({});
      await tx.sessionPhase.deleteMany({});
      await tx.session.deleteMany({});
    });
  }
}