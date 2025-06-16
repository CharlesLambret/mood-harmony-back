import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Emotion } from '../../core/domain/model/Emotion';
import { PrismaEmotionMapper } from './mapper/prisma-emotion.mapper';

@Injectable()
export class PrismaEmotionRepository {
  private mapper: PrismaEmotionMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new PrismaEmotionMapper();
  }

  async create(emotion: Emotion): Promise<Emotion> {
    const entity = this.mapper.fromDomain(emotion);
    const created = await this.prisma.emotion.create({
      data: {
        name: entity.name,
        iconUrl: entity.iconUrl,
      },
    });
    return this.mapper.toDomain(created);
  }

  async findById(id: number): Promise<Emotion | null> {
    const entity = await this.prisma.emotion.findUnique({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Emotion[]> {
    const entities = await this.prisma.emotion.findMany({ orderBy: { id: 'asc' } });
    return entities.map(e => this.mapper.toDomain(e));
  }

  async update(id: number, emotion: Emotion): Promise<Emotion | null> {
    const entity = this.mapper.fromDomain(emotion);
    try {
      const updated = await this.prisma.emotion.update({
        where: { id },
        data: {
          name: entity.name,
          iconUrl: entity.iconUrl,
        },
      });
      return this.mapper.toDomain(updated);
    } catch {
      return null;
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.emotion.delete({ where: { id } });
  }
}