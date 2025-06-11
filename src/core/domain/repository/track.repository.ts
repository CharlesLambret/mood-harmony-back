import { Repository } from '../../base/repository';
import { Track } from '../model/Track';

export abstract class TrackRepository extends Repository<Track> {
  abstract findByGenreWithCriteria(
    genreId: number, 
    bpm: number, 
    speechiness: number, 
    energy: number,
    tolerance: number,
    limit: number
  ): Promise<Track[]>;
  
  abstract findByGenreWithTransition(
    genreId: number,
    fromBpm: number, toBpm: number,
    fromSpeechiness: number, toSpeechiness: number, 
    fromEnergy: number, toEnergy: number,
    maxDifference: number,
    limit: number
  ): Promise<Track[]>;
}
