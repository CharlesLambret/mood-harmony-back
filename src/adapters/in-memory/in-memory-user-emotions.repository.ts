import { Injectable } from '@nestjs/common';
import { userEmotionRepository } from '../../core/domain/repository/user-emotion.repository';
import { UserEmotion } from '../../core/domain/model/UserEmotion';

@Injectable()
export class InMemoryUserEmotionRepository extends userEmotionRepository {
  private userEmotions: Map<number, UserEmotion> = new Map();
  private autoIncrement = 1;

  async create(data: Partial<UserEmotion>): Promise<UserEmotion> {
    const id = data.id ?? this.autoIncrement++;
    const userEmotion = new UserEmotion(
      id,
      data.emotion!,
      data.userId!,
      data.userEmotionProfileId!,
      data.userGenrePreferences ?? [],
      data.updatedAt ?? new Date(),
      data.createdAt ?? new Date()
    );
    this.userEmotions.set(id, userEmotion);
    return userEmotion;
  }

  async findById(id: number): Promise<UserEmotion | null> {
    return this.userEmotions.get(id) || null;
  }

  async findAll(): Promise<UserEmotion[]> {
    return Array.from(this.userEmotions.values());
  }

  async update(id: number, data: Partial<UserEmotion>): Promise<UserEmotion | null> {
    const existing = this.userEmotions.get(id);
    if (!existing) return null;
    const updated = new UserEmotion(
      id,
      data.emotion ?? existing.emotion,
      data.userId ?? existing.userId,
      data.userEmotionProfileId ?? existing.userEmotionProfileId,
      data.userGenrePreferences ?? existing.userGenrePreferences,
      data.updatedAt ?? new Date(),
      data.createdAt ?? existing.createdAt
    );
    this.userEmotions.set(id, updated);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.userEmotions.delete(id);
  }

  async removeAll(): Promise<void> {
    this.userEmotions.clear();
  }

  async findByUserIdAndEmotionIds(userId: number, emotionIds: number[]): Promise<UserEmotion[]> {
    return Array.from(this.userEmotions.values()).filter(
      ue =>
        ue.userId === userId &&
        ue.emotion &&
        emotionIds.includes(ue.emotion.id)
    );
  }

 
}