import { Repository } from '../../base/repository';
import { UserEmotion } from '../model/UserEmotion';

export abstract class userEmotionRepository extends Repository<UserEmotion> {
    abstract findByUserIdAndEmotionIds(userId: number, emotionIds: number[]): Promise<UserEmotion[]>;
    
}
