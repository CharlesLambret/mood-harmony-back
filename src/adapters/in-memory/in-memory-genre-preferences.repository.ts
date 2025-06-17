import { Injectable } from '@nestjs/common';
import { UserGenrePreferenceRepository } from '../../core/domain/repository/userGenrePreferences.repository';
import { UserGenrePreference } from '../../core/domain/model/UserGenrePreferences';

@Injectable()
export class InMemoryUserGenrePreferenceRepository extends UserGenrePreferenceRepository {
  private preferences: Map<number, UserGenrePreference> = new Map();
  private autoIncrement = 1;

  async create(data: Partial<UserGenrePreference>): Promise<UserGenrePreference> {
    const id = data.id ?? this.autoIncrement++;
    const preference = new UserGenrePreference(
      id,
      data.userEmotionId!,
      data.genreId!,
      data.rating!,
      data.bpm!,
      data.speechiness!,
      data.energy!,
      data.updatedAt,
      data.createdAt
    );
    this.preferences.set(id, preference);
    return preference;
  }

  async findById(id: number): Promise<UserGenrePreference | null> {
    return this.preferences.get(id) || null;
  }

  async findAll(): Promise<UserGenrePreference[]> {
    return Array.from(this.preferences.values());
  }

  async update(id: number, data: Partial<UserGenrePreference>): Promise<UserGenrePreference | null> {
    const existing = this.preferences.get(id);
    if (!existing) return null;
    const updated = new UserGenrePreference(
      id,
      data.userEmotionId ?? existing.userEmotionId,
      data.genreId ?? existing.genreId,
      data.rating ?? existing.rating,
      data.bpm ?? existing.bpm,
      data.speechiness ?? existing.speechiness,
      data.energy ?? existing.energy,
      data.updatedAt ?? new Date(),
      data.createdAt ?? existing.createdAt
    );
    this.preferences.set(id, updated);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.preferences.delete(id);
  }

  async removeAll(): Promise<void> {
    this.preferences.clear();
  }

  async findByUserEmotionIds(userEmotionIds: number[]): Promise<UserGenrePreference[]> {
    return Array.from(this.preferences.values()).filter(pref =>
      userEmotionIds.includes(pref.userEmotionId)
    );
  }

  async findBestRatingByEmotion(userEmotionId: number): Promise<UserGenrePreference | null> {
    const prefs = Array.from(this.preferences.values()).filter(
      pref => pref.userEmotionId === userEmotionId
    );
    if (prefs.length === 0) return null;
    return prefs.reduce((best, curr) => (curr.rating > best.rating ? curr : best), prefs[0]);
  }

  async findCommonGenres(userEmotionIds: number[], limit: number, genreIDsToBan: number[]): Promise<UserGenrePreference[]> {
    console.log('=== DEBUG findCommonGenres ===');
    console.log('Input userEmotionIds:', userEmotionIds);
    console.log('Input limit:', limit);
    console.log('Input genreIDsToBan:', genreIDsToBan);
    console.log('Total preferences in repository:', this.preferences.size);

    // 1. Filtrer les préférences pour les userEmotionIds transmis ET exclure les genres à bannir
    const filteredPrefs = Array.from(this.preferences.values()).filter(pref =>
      userEmotionIds.includes(pref.userEmotionId) &&
      !genreIDsToBan.includes(pref.genreId)
    );

    console.log('Filtered preferences:', filteredPrefs.map(p => ({
      id: p.id,
      userEmotionId: p.userEmotionId,
      genreId: p.genreId,
      rating: p.rating
    })));

    // 2. Grouper par genreId pour identifier les genres communs
    const genreMap = new Map<number, UserGenrePreference[]>();

    for (const pref of filteredPrefs) {
      if (!genreMap.has(pref.genreId)) {
        genreMap.set(pref.genreId, []);
      }
      genreMap.get(pref.genreId)!.push(pref);
    }

    console.log('Grouped by genreId:');
    for (const [genreId, prefs] of genreMap.entries()) {
      console.log(`  Genre ${genreId}:`, prefs.map(p => ({
        userEmotionId: p.userEmotionId,
        rating: p.rating
      })));
    }

    // 3. Identifier les genres communs et calculer leur rating moyen
    const commonGenres: { genreId: number, averageRating: number, preferences: UserGenrePreference[] }[] = [];

    for (const [genreId, preferences] of genreMap.entries()) {
      // Vérifier que ce genre a une préférence pour chaque userEmotionId
      const emotionIds = preferences.map(p => p.userEmotionId);
      const uniqueEmotionIds = new Set(emotionIds);

      console.log(`Genre ${genreId}:`);
      console.log(`  Has preferences for emotions:`, Array.from(uniqueEmotionIds));
      console.log(`  Required emotions:`, userEmotionIds);

      // Un genre est commun s'il a une préférence pour chaque userEmotionId
      const hasAllEmotions = userEmotionIds.every(emotionId => uniqueEmotionIds.has(emotionId));

      if (hasAllEmotions && uniqueEmotionIds.size === userEmotionIds.length) {
        console.log(`✓ Genre ${genreId} is common!`);

        // Calculer le rating moyen (normalement 2 préférences, une par émotion)
        const totalRating = preferences.reduce((sum, pref) => sum + pref.rating, 0);
        const averageRating = totalRating / preferences.length;

        console.log(`  Ratings:`, preferences.map(p => `emotion ${p.userEmotionId}: ${p.rating}`));
        console.log(`  Average rating: ${averageRating}`);

        commonGenres.push({
          genreId,
          averageRating,
          preferences
        });
      } else {
        console.log(`✗ Genre ${genreId} is NOT common`);
      }
    }

    console.log('Common genres found:', commonGenres.length);

    // 4. Trier par rating moyen décroissant et limiter
    const sortedCommonGenres = commonGenres
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);

    // 5. Pour chaque genre commun, retourner la préférence avec le meilleur rating
    const result: UserGenrePreference[] = sortedCommonGenres.map(item => {
      const bestPreference = item.preferences.reduce((best, curr) =>
        curr.rating > best.rating ? curr : best
      );
      return bestPreference;
    });

    console.log('Final result:', result.map(p => ({
      id: p.id,
      userEmotionId: p.userEmotionId,
      genreId: p.genreId,
      rating: p.rating,
      averageRating: sortedCommonGenres.find(cg => cg.genreId === p.genreId)?.averageRating
    })));
    console.log('=== END DEBUG ===');

    return result;
  }
}
