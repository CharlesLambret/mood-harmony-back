import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserGenrePreference } from '../../core/domain/model/UserGenrePreferences';
import { PrismaUserGenrePreferenceMapper } from './mapper/prisma-user-genre-preferences.mapper';

@Injectable()
export class PrismauserGenrePreferencesRepository {
  private mapper: PrismaUserGenrePreferenceMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new PrismaUserGenrePreferenceMapper();
  }

  async create(userGenrePreference: UserGenrePreference, userEmotionId: number): Promise<UserGenrePreference> {
    const entity = this.mapper.fromDomain(userGenrePreference);
    const created = await this.prisma.userGenrePreference.create({
      data: {
        userEmotionId,
        genreId: entity.genre.id,
        rating: entity.rating,
        bpm: entity.bpm,
        speechiness: entity.speechiness,
        energy: entity.energy,
     
      },
      include: {
        userEmotion: {
          include: { emotion: true },
        },
        genre: true,
      },
    });
    return this.mapper.toDomain(created);
  }

  async findById(id: number): Promise<UserGenrePreference | null> {
    const entity = await this.prisma.userGenrePreference.findUnique({
      where: { id },
      include: {
        userEmotion: { include: { emotion: true } },
        genre: true,
      },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<UserGenrePreference[]> {
    const entities = await this.prisma.userGenrePreference.findMany({
      include: {
        userEmotion: { include: { emotion: true } },
        genre: true,
      },
      orderBy: { id: 'asc' },
    });
    return entities.map(e => this.mapper.toDomain(e));
  }

  async update(id: number, userGenrePreference: UserGenrePreference): Promise<UserGenrePreference | null> {
    const entity = this.mapper.fromDomain(userGenrePreference);
    try {
      const updated = await this.prisma.userGenrePreference.update({
        where: { id },
        data: {
          genreId: entity.genre.id,
          rating: entity.rating,
          bpm: entity.bpm,
          speechiness: entity.speechiness,
          energy: entity.energy,
        },
        include: {
          userEmotion: { include: { emotion: true} },
          genre: true,
        },
      });
      return this.mapper.toDomain(updated);
    } catch {
      return null;
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.userGenrePreference.delete({ where: { id } });
  }
}