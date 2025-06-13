import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import { SessionRepository } from 'src/core/domain/repository/session.repository';
import { PrismaSessionMapper } from './mapper/prisma-session.mapper';
import { Session } from 'src/core/domain/model/Session';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  private mapper: PrismaSessionMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new PrismaSessionMapper();
  }

  async create(session: Session): Promise<Session> {
    const entity = this.mapper.fromDomain(session);
    
    const createdEntity = await this.prisma.session.create({ 
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
            order_index: 'asc'
          }
        }
      }
    });
    
    return this.mapper.toDomain(createdEntity);
  }

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
            order_index: 'asc'
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
    // D'abord, récupérer l'UserEmotionProfile de l'utilisateur
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        emoProfile: true
      }
    });

    if (!userProfile) {
      return [];
    }

    const entities = await this.prisma.session.findMany({
      where: { 
        userEmotionProfileId: userProfile.emoProfile.id 
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
            order_index: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
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
            order_index: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
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
              order_index: 'asc'
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
    // Supprimer en cascade : d'abord les SessionTrack, puis les SessionPhase, puis la Session
    await this.prisma.$transaction(async (tx) => {
      // Supprimer les SessionTrack associées
      await tx.sessionTrack.deleteMany({
        where: {
          sessionPhase: {
            sessionId: id
          }
        }
      });
      
      // Supprimer les SessionPhase associées
      await tx.sessionPhase.deleteMany({
        where: {
          sessionId: id
        }
      });
      
      // Supprimer la Session
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