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
  // Ajoutez ces méthodes à votre PrismauserGenrePreferencesRepository

async removeAll(): Promise<void> {
  await this.prisma.userGenrePreference.deleteMany();
}

async findByUserEmotionIds(userEmotionIds: number[]): Promise<UserGenrePreference[]> {
  const entities = await this.prisma.userGenrePreference.findMany({
    where: {
      userEmotionId: {
        in: userEmotionIds
      }
    },
    include: {
      userEmotion: { include: { emotion: true } },
      genre: true,
    },
    orderBy: { id: 'asc' },
  });
  return entities.map(e => this.mapper.toDomain(e));
}

async findBestRatingByEmotion(userEmotionId: number): Promise<UserGenrePreference | null> {
  const entity = await this.prisma.userGenrePreference.findFirst({
    where: { userEmotionId },
    include: {
      userEmotion: { include: { emotion: true } },
      genre: true,
    },
    orderBy: { rating: 'desc' },
  });
  return entity ? this.mapper.toDomain(entity) : null;
}

async findCommonGenres(userEmotionIds: number[], limit: number, genreIDsToBan: number[] = []): Promise<UserGenrePreference[]> {
    // 1. Récupérer toutes les préférences concernées, hors genres à bannir
    const allPrefs = await this.prisma.userGenrePreference.findMany({
      where: {
        userEmotionId: { in: userEmotionIds },
        genreId: { notIn: genreIDsToBan.length ? genreIDsToBan : undefined },
      },
      include: {
        userEmotion: { include: { emotion: true } },
        genre: true,
      },
    });

    // 2. Grouper par genreId
    const genreMap = new Map<number, UserGenrePreference[]>();
    for (const pref of allPrefs) {
      const domainPref = this.mapper.toDomain(pref);
      if (!genreMap.has(domainPref.genreId)) genreMap.set(domainPref.genreId, []);
      genreMap.get(domainPref.genreId)!.push(domainPref);
    }

    // 3. Identifier les genres communs à tous les userEmotionIds
    const commonGenres: { genreId: number, averageRating: number, preferences: UserGenrePreference[] }[] = [];
    for (const [genreId, prefs] of genreMap.entries()) {
      const emotionIds = prefs.map(p => p.userEmotionId);
      const uniqueEmotionIds = new Set(emotionIds);
      const hasAllEmotions = userEmotionIds.every(eid => uniqueEmotionIds.has(eid));
      if (hasAllEmotions && uniqueEmotionIds.size === userEmotionIds.length) {
        const totalRating = prefs.reduce((sum, pref) => sum + pref.rating, 0);
        const averageRating = totalRating / prefs.length;
        commonGenres.push({ genreId, averageRating, preferences: prefs });
      }
    }

    // 4. Trier par rating moyen décroissant et limiter
    const sortedCommonGenres = commonGenres
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);

    // 5. Pour chaque genre commun, retourner la préférence avec le meilleur rating
    const result: UserGenrePreference[] = sortedCommonGenres.map(item => {
      // Find the best preference (highest rating) among the original Prisma entities
      const bestPreferenceEntity = allPrefs
        .filter(pref => pref.genreId === item.genreId && item.preferences.some(p => p.id === pref.id))
        .reduce((best, curr) => (curr.rating > best.rating ? curr : best));
      return this.mapper.toDomain(bestPreferenceEntity);
    });

    return result;
  }
}