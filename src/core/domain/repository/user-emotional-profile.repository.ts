import { Repository } from '../../base/repository';
import { UserEmotionalProfile } from '../model/UserEmotionalProfile';

export abstract class UserEmotionalProfileRepository extends Repository<UserEmotionalProfile> {
    abstract findByUserId(userId: number): Promise<UserEmotionalProfile[]>;
    
}
