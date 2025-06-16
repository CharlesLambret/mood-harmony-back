import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Genre } from '../../core/domain/model/Genre';
import { PrismaGenreMapper } from './mapper/prisma-genre.mapper';

@Injectable()
export class PrismaGenreRepository {
  private mapper: PrismaGenreMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new PrismaGenreMapper();
  }

  async create(genre: Genre): Promise<Genre> {
    const entity = this.mapper.fromDomain(genre);
    const created = await this.prisma.genre.create({
      data: {
        name: entity.name,
        iconUrl: entity.iconUrl,
       
      },
    });
    return this.mapper.toDomain(created);
  }

  async findById(id: number): Promise<Genre | null> {
    const entity = await this.prisma.genre.findUnique({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Genre[]> {
    const entities = await this.prisma.genre.findMany({ orderBy: { id: 'asc' } });
    return entities.map(e => this.mapper.toDomain(e));
  }

  async update(id: number, genre: Genre): Promise<Genre | null> {
    const entity = this.mapper.fromDomain(genre);
    try {
      const updated = await this.prisma.genre.update({
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
    await this.prisma.genre.delete({ where: { id } });
  }
}