import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../core/domain/repository/session.repository';
import { Session } from '../../core/domain/model/Session';

@Injectable()
export class InMemorySessionRepository implements SessionRepository {
  private sessions: Map<number, Session> = new Map();

  create(data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'> & { id: number }): Session {
    const session = new Session(
      data.id,
      data.userEmotionalProfileId,
      data.duration,
      data.fromEmotion,
      data.toEmotion,
      data.phases,
      undefined,
      undefined
    );
    this.sessions.set(session.id, session);
    return session;
  }

  findById(id: number): Session | null {
    return this.sessions.get(id) || null;
  }

  findAll(): Session[] {
    return Array.from(this.sessions.values());
  }

  update(id: number, session: Session): Session | null {
    if (!this.sessions.has(id)) {
      return null;
    }
    this.sessions.set(id, session);
    return session;
  }

  remove(id: number): void {
    this.sessions.delete(id);
  }

  removeAll(): void {
    this.sessions.clear();
  }
}