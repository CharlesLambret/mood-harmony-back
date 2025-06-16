import { Injectable } from '@nestjs/common';
import { UserGenrePreferenceRepository } from '../../core/domain/repository/userGenrePreferences.repository';
import { UserGenrePreference } from '../../core/domain/model/UserGenrePreferences';

@Injectable()
export class InMemoryUserGenrePreferenceRepository extends UserGenrePreferenceRepository {
  private preferences: Map<number, UserGenrePreference> = new Map();
  private autoIncrement = 1;
  
  async create(data: Partial<UserGenrePreference>): Promise<UserGenrePreference> {
    const id = data.id ?? this.autoIncrement++;
    // Removed usage of undefined emotionRepository and userEmotionRepo
    // Assume data.userEmotion and data.genre are provided in data
    const preference = new UserGenrePreference(
      id,
      data.useremotionId!,
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
      data.useremotionId!,
      data.genreId!,
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
      userEmotionIds.includes(pref.useremotionId)
    );
  }

  async findBestRatingByEmotion(userEmotionId: number): Promise<UserGenrePreference | null> {
    const prefs = Array.from(this.preferences.values()).filter(
      pref => pref.useremotionId === userEmotionId
    );
    if (prefs.length === 0) return null;
    return prefs.reduce((best, curr) => (curr.rating > best.rating ? curr : best), prefs[0]);
  }

  async findCommonGenres(userEmotionIds: number[], limit: number): Promise<UserGenrePreference[]> {
    const prefs = Array.from(this.preferences.values()).filter(pref =>
      userEmotionIds.includes(pref.useremotionId)
    );
    // Group by genre id and count occurrences
    const genreCount = new Map<number, { pref: UserGenrePreference; count: number }>();
    for (const pref of prefs) {
      const genreId = pref.genreId;
      if (!genreCount.has(genreId)) {
        genreCount.set(genreId, { pref, count: 1 });
      } else {
        genreCount.get(genreId)!.count += 1;
      }
    }
    // Sort by count desc, then by rating desc
    const sorted = Array.from(genreCount.values())
      .sort((a, b) =>
        b.count !== a.count
          ? b.count - a.count
          : b.pref.rating - a.pref.rating
      )
      .map(g => g.pref)
      .slice(0, limit);
    return sorted;
  }
}