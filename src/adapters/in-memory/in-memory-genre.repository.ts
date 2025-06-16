import { Injectable } from '@nestjs/common';
import { GenreRepository } from '../../core/domain/repository/genre.repository';
import { Genre } from '../../core/domain/model/Genre';

@Injectable()
export class InMemoryGenreRepository extends GenreRepository {
  private genres: Map<number, Genre> = new Map();
  private autoIncrement = 1;

  async create(data: Partial<Genre>): Promise<Genre> {
    const id = data.id ?? this.autoIncrement++;
    const genre = new Genre(
      id,
      data.name!,
      data.iconUrl!,
      data.updatedAt,
      data.createdAt
    );
    this.genres.set(id, genre);
    return genre;
  }

  async findById(id: number): Promise<Genre | null> {
    return this.genres.get(id) || null;
  }

  async findAll(): Promise<Genre[]> {
    return Array.from(this.genres.values());
  }

  async update(id: number, data: Partial<Genre>): Promise<Genre | null> {
    const existing = this.genres.get(id);
    if (!existing) return null;
    const updated = new Genre(
      id,
      data.name ?? existing.name,
      data.iconUrl ?? existing.iconUrl,
      data.updatedAt ?? new Date(),
      data.createdAt ?? existing.createdAt
    );
    this.genres.set(id, updated);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.genres.delete(id);
  }

  async removeAll(): Promise<void> {
    this.genres.clear();
  }
}