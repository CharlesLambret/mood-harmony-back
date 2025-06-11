import { Injectable } from '@nestjs/common';
import { EmotionRepository } from '../../core/domain/repository/emotion.repository';
import { Emotion } from '../../core/domain/model/Emotion';

@Injectable()
export class InMemoryEmotionRepository implements EmotionRepository {
  private emotions: Map<number, Emotion> = new Map();
  private autoIncrement = 1;

  async create(data: Partial<Emotion>): Promise<Emotion> {
    const id = data.id ?? this.autoIncrement++;
    const emotion = new Emotion(
      id,
      data.name!,
      data.iconUrl!,
      data.updatedAt,
      data.createdAt
    );
    this.emotions.set(id, emotion);
    return emotion;
  }

  async findById(id: number): Promise<Emotion | null> {
    return this.emotions.get(id) || null;
  }

  async findAll(): Promise<Emotion[]> {
    return Array.from(this.emotions.values());
  }

  async update(id: number, data: Partial<Emotion>): Promise<Emotion | null> {
    const existing = this.emotions.get(id);
    if (!existing) return null;
    const updated = new Emotion(
      id,
      data.name ?? existing.name,
      data.iconUrl ?? existing.iconUrl,
      data.updatedAt ?? new Date(),
      data.createdAt ?? existing.createdAt
    );
    this.emotions.set(id, updated);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.emotions.delete(id);
  }

  async removeAll(): Promise<void> {
    this.emotions.clear();
  }
}