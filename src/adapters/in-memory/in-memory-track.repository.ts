import { Injectable } from '@nestjs/common';
import { TrackRepository } from '../../core/domain/repository/track.repository';
import { Track } from '../../core/domain/model/Track';

@Injectable()
export class InMemoryTrackRepository extends TrackRepository {
  private tracks: Map<number, Track> = new Map();
  private autoIncrement = 1;

  async create(data: Partial<Track>): Promise<Track> {
    const id = data.id ?? this.autoIncrement++;
    const track = new Track(
      id,
      data.name!,
      data.length!,
      data.trackHref!,
      data.bpm!,
      data.speechiness!,
      data.energy!,
      data.genre!,
      data.updatedAt,
      data.createdAt
    );
    this.tracks.set(id, track);
    return track;
  }

  async findById(id: number): Promise<Track | null> {
    return this.tracks.get(id) || null;
  }

  async findAll(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async update(id: number, data: Partial<Track>): Promise<Track | null> {
    const existing = this.tracks.get(id);
    if (!existing) return null;
    const updated = new Track(
      id,
      data.name ?? existing.name,
      data.length ?? existing.length,
      data.trackHref ?? existing.trackHref,
      data.bpm ?? existing.bpm,
      data.speechiness ?? existing.speechiness,
      data.energy ?? existing.energy,
      data.genre ?? existing.genre,
      data.updatedAt ?? new Date(),
      data.createdAt ?? existing.createdAt
    );
    this.tracks.set(id, updated);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.tracks.delete(id);
  }

  async removeAll(): Promise<void> {
    this.tracks.clear();
  }

  async findByGenreWithCriteria(
    genreId: number,
    bpm: number,
    speechiness: number,
    energy: number,
    tolerance: number,
    limit: number
  ): Promise<Track[]> {
    return Array.from(this.tracks.values())
      .filter(
        t =>
          t.genre.id === genreId &&
          Math.abs(t.bpm - bpm) <= tolerance &&
          Math.abs(t.speechiness - speechiness) <= tolerance &&
          Math.abs(t.energy - energy) <= tolerance
      )
      .slice(0, limit);
  }

  async findByGenreWithTransition(
    genreId: number,
    fromBpm: number, toBpm: number,
    fromSpeechiness: number, toSpeechiness: number,
    fromEnergy: number, toEnergy: number,
    maxDifference: number,
    limit: number
  ): Promise<Track[]> {
    return Array.from(this.tracks.values())
      .filter(
        t =>
          t.genre.id === genreId &&
          Math.abs(t.bpm - fromBpm) <= maxDifference &&
          Math.abs(t.bpm - toBpm) <= maxDifference &&
          Math.abs(t.speechiness - fromSpeechiness) <= maxDifference &&
          Math.abs(t.speechiness - toSpeechiness) <= maxDifference &&
          Math.abs(t.energy - fromEnergy) <= maxDifference &&
          Math.abs(t.energy - toEnergy) <= maxDifference
      )
      .slice(0, limit);
  }
}