import { DomainError } from '../../base/domain-error';

export class EmotionNotFoundError extends DomainError {
  constructor(id: number) {
    super(`Emotion with id ${id} not found`);
  }
}
