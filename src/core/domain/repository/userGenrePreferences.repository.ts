import { Repository } from '../../base/repository';
import { UserGenrePreference } from '../model/UserGenrePreferences';

export abstract class UserGenrePreferenceRepository extends Repository<UserGenrePreference> {
    abstract findByUserEmotionIds(userEmotionIds: number[]): Promise<UserGenrePreference[]>;
    abstract findBestRatingByEmotion(userEmotionId: number): Promise<UserGenrePreference | null>;
    abstract findCommonGenres(userEmotionIds: number[], limit: number, genreIDsToBan: number[]): Promise<UserGenrePreference[]>;
}