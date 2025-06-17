import { Injectable } from '@nestjs/common';
import { userEmotionRepository } from '../../core/domain/repository/user-emotion.repository';
import { UserEmotion } from '../../core/domain/model/UserEmotion';
import { PrismaService } from './prisma.service';
import { PrismaUserEmotionMapper } from './mapper/prisma-user-emotion.mapper';

@Injectable()
export class PrismaUserEmotionRepository extends userEmotionRepository {
  private mapper: PrismaUserEmotionMapper;

  constructor(private readonly prisma: PrismaService) {
    super();
    this.mapper = new PrismaUserEmotionMapper();
  }

  async create(data: Partial<UserEmotion>): Promise<UserEmotion> {
    const created = await this.prisma.userEmotion.create({
      data: {
        emotionId: data.emotion!.id,
        userId: data.userId!,
        userEmotionProfileId: data.userEmotionProfileId!,
        // Les préférences sont à créer séparément si besoin
      },
      include: {
        emotion: true,
        userGenrePreferences: true,
      },
    });
    return this.mapper.toDomain(created);
  }

  async findById(id: number): Promise<UserEmotion | null> {
    const entity = await this.prisma.userEmotion.findUnique({
      where: { id },
      include: {
        emotion: true,
        userGenrePreferences: true,
      },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<UserEmotion[]> {
    const entities = await this.prisma.userEmotion.findMany({
      include: {
        emotion: true,
        userGenrePreferences: true,
      },
      orderBy: { id: 'asc' },
    });
    return entities.map(e => this.mapper.toDomain(e));
  }

  async update(id: number, data: Partial<UserEmotion>): Promise<UserEmotion | null> {
    try {
      const updated = await this.prisma.userEmotion.update({
        where: { id },
        data: {
          emotionId: data.emotion?.id,
          userId: data.userId,
          userEmotionProfileId: data.userEmotionProfileId,
          // Les préférences sont à gérer séparément si besoin
        },
        include: {
          emotion: true,
          userGenrePreferences: true,
        },
      });
      return this.mapper.toDomain(updated);
    } catch {
      return null;
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.userEmotion.delete({ where: { id } });
  }

  async removeAll(): Promise<void> {
    await this.prisma.userEmotion.deleteMany();
  }

  async findByUserIdAndEmotionIds(userId: number, emotionIds: number[]): Promise<UserEmotion[]> {
    const entities = await this.prisma.userEmotion.findMany({
      where: {
        userId,
        emotionId: { in: emotionIds },
      },
      include: {
        emotion: true,
        userGenrePreferences: true,
      },
      orderBy: { id: 'asc' },
    });
    return entities.map(e => this.mapper.toDomain(e));
  }
}