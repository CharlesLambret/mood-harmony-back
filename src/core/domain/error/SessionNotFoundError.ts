import { DomainError } from '../../base/domain-error';

export class SessionNotFoundError extends DomainError {
  constructor(id: number) {
    super(`Session with id ${id} not found`);
  }
}
