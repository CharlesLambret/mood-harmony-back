import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Track } from '../../core/domain/model/Track';
import { PrismaTrackMapper } from './mapper/prisma-track.mapper';

@Injectable()
export class PrismaTrackRepository {
  private mapper: PrismaTrackMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new PrismaTrackMapper();
  }

  async create(track: Track): Promise<Track> {
    const entity = this.mapper.fromDomain(track);
    const created = await this.prisma.track.create({
      data: {
        name: entity.name,
        length: entity.length,
        track_href: entity.track_href,
        bpm: entity.bpm,
        speechiness: entity.speechiness,
        energy: entity.energy,
        genreId: entity.genre.id,
       
      },
      include: {
        genre: true,
      },
    });
    return this.mapper.toDomain(created);
  }

  async findById(id: number): Promise<Track | null> {
    const entity = await this.prisma.track.findUnique({
      where: { id },
      include: { genre: true },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Track[]> {
    const entities = await this.prisma.track.findMany({
      include: { genre: true },
      orderBy: { id: 'asc' },
    });
    return entities.map(e => this.mapper.toDomain(e));
  }
  
  async findByGenreWithCriteria(
    genreId: number,
    bpm: number,
    speechiness: number,
    energy: number,
    tolerance: number,
    limit: number
  ): Promise<Track[]> {
    const entities = await this.prisma.track.findMany({
      where: {
        genreId,
        bpm: { gte: bpm - tolerance, lte: bpm + tolerance },
        speechiness: { gte: speechiness - tolerance, lte: speechiness + tolerance },
        energy: { gte: energy - tolerance, lte: energy + tolerance },
      },
      include: { genre: true },
      take: limit,
      orderBy: { id: 'asc' },
    });
    return entities.map(e => this.mapper.toDomain(e));
  }

  async findByGenreWithTransition(
    genreId: number,
    fromBpm: number, toBpm: number,
    fromSpeechiness: number, toSpeechiness: number,
    fromEnergy: number, toEnergy: number,
    maxDifference: number,
    limit: number
  ): Promise<Track[]> {
    const entities = await this.prisma.track.findMany({
      where: {
        genreId,
        AND: [
          { bpm: { gte: fromBpm - maxDifference, lte: fromBpm + maxDifference } },
          { bpm: { gte: toBpm - maxDifference, lte: toBpm + maxDifference } },
          { speechiness: { gte: fromSpeechiness - maxDifference, lte: fromSpeechiness + maxDifference } },
          { speechiness: { gte: toSpeechiness - maxDifference, lte: toSpeechiness + maxDifference } },
          { energy: { gte: fromEnergy - maxDifference, lte: fromEnergy + maxDifference } },
          { energy: { gte: toEnergy - maxDifference, lte: toEnergy + maxDifference } },
        ],
      },
      include: { genre: true },
      take: limit,
      orderBy: { id: 'asc' },
    });
    return entities.map(e => this.mapper.toDomain(e));
  }

  async update(id: number, track: Track): Promise<Track | null> {
    const entity = this.mapper.fromDomain(track);
    try {
      const updated = await this.prisma.track.update({
        where: { id },
        data: {
          name: entity.name,
          length: entity.length,
          track_href: entity.track_href,
          bpm: entity.bpm,
          speechiness: entity.speechiness,
          energy: entity.energy,
          genreId: entity.genre.id,
         
        },
        include: { genre: true },
      });
      return this.mapper.toDomain(updated);
    } catch {
      return null;
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.track.delete({ where: { id } });
  }

}