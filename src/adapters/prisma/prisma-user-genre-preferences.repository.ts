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
    return this.mapper.toDomain({
      ...created,
      speechiness: typeof created.speechiness === 'object' && created.speechiness !== null && typeof (created.speechiness as any).toNumber === 'function'
        ? (created.speechiness as any).toNumber()
        : Number(created.speechiness),
      energy: typeof created.energy === 'object' && created.energy !== null && typeof (created.energy as any).toNumber === 'function'
        ? (created.energy as any).toNumber()
        : Number(created.energy),
    });
  }

  async findById(id: number): Promise<UserGenrePreference | null> {
    const entity = await this.prisma.userGenrePreference.findUnique({
      where: { id },
      include: {
        userEmotion: { include: { emotion: true } },
        genre: true,
      },
    });
    return entity
      ? this.mapper.toDomain({
          ...entity,
          speechiness: typeof entity.speechiness === 'object' && entity.speechiness !== null && typeof (entity.speechiness as any).toNumber === 'function'
            ? (entity.speechiness as any).toNumber()
            : Number(entity.speechiness),
          energy: typeof entity.energy === 'object' && entity.energy !== null && typeof (entity.energy as any).toNumber === 'function'
            ? (entity.energy as any).toNumber()
            : Number(entity.energy),
        })
      : null;
  }

  async findAll(): Promise<UserGenrePreference[]> {
    const entities = await this.prisma.userGenrePreference.findMany({
      include: {
        userEmotion: { include: { emotion: true } },
        genre: true,
      },
      orderBy: { id: 'asc' },
    });
    return entities.map(e =>
      this.mapper.toDomain({
        ...e,
        speechiness: typeof e.speechiness === 'object' && e.speechiness !== null && typeof (e.speechiness as any).toNumber === 'function'
          ? (e.speechiness as any).toNumber()
          : Number(e.speechiness),
        energy: typeof e.energy === 'object' && e.energy !== null && typeof (e.energy as any).toNumber === 'function'
          ? (e.energy as any).toNumber()
          : Number(e.energy),
      })
    );
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
      return this.mapper.toDomain({
        ...updated,
        speechiness: typeof updated.speechiness === 'object' && updated.speechiness !== null && typeof (updated.speechiness as any).toNumber === 'function'
          ? (updated.speechiness as any).toNumber()
          : Number(updated.speechiness),
        energy: typeof updated.energy === 'object' && updated.energy !== null && typeof (updated.energy as any).toNumber === 'function'
          ? (updated.energy as any).toNumber()
          : Number(updated.energy),
      });
    } catch {
      return null;
    }
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
    return entities.map(e =>
      this.mapper.toDomain({
        ...e,
        speechiness: typeof e.speechiness === 'object' && e.speechiness !== null && typeof (e.speechiness as any).toNumber === 'function'
          ? (e.speechiness as any).toNumber()
          : Number(e.speechiness),
        energy: typeof e.energy === 'object' && e.energy !== null && typeof (e.energy as any).toNumber === 'function'
          ? (e.energy as any).toNumber()
          : Number(e.energy),
      })
    );
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
    return entity
      ? this.mapper.toDomain({
          ...entity,
          speechiness: typeof entity.speechiness === 'object' && entity.speechiness !== null && typeof (entity.speechiness as any).toNumber === 'function'
            ? (entity.speechiness as any).toNumber()
            : Number(entity.speechiness),
          energy: typeof entity.energy === 'object' && entity.energy !== null && typeof (entity.energy as any).toNumber === 'function'
            ? (entity.energy as any).toNumber()
            : Number(entity.energy),
        })
      : null;
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
      const domainPref = this.mapper.toDomain({
        ...pref,
        speechiness: typeof pref.speechiness === 'object' && pref.speechiness !== null && typeof (pref.speechiness as any).toNumber === 'function'
          ? (pref.speechiness as any).toNumber()
          : Number(pref.speechiness),
        energy: typeof pref.energy === 'object' && pref.energy !== null && typeof (pref.energy as any).toNumber === 'function'
          ? (pref.energy as any).toNumber()
          : Number(pref.energy),
      });
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
      return this.mapper.toDomain({
        ...bestPreferenceEntity,
        speechiness: typeof bestPreferenceEntity.speechiness === 'object' && bestPreferenceEntity.speechiness !== null && typeof (bestPreferenceEntity.speechiness as any).toNumber === 'function'
          ? (bestPreferenceEntity.speechiness as any).toNumber()
          : Number(bestPreferenceEntity.speechiness),
        energy: typeof bestPreferenceEntity.energy === 'object' && bestPreferenceEntity.energy !== null && typeof (bestPreferenceEntity.energy as any).toNumber === 'function'
          ? (bestPreferenceEntity.energy as any).toNumber()
          : Number(bestPreferenceEntity.energy),
      });
    });

    return result;
  }

}