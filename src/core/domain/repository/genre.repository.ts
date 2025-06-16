import { Repository } from '../../base/repository';
import { Genre } from '../model/Genre';

export abstract class GenreRepository extends Repository<Genre> {}
