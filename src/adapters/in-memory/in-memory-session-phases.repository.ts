import { Injectable } from '@nestjs/common';
import { SessionPhaseRepository } from '../../core/domain/repository/session-phase.repository';
import { SessionPhase } from '../../core/domain/model/SessionPhase';

@Injectable()
export class InMemorySessionPhaseRepository extends SessionPhaseRepository {
  private phases: Map<number, SessionPhase> = new Map();
  private autoIncrement = 1;

  async create(data: Partial<SessionPhase>): Promise<SessionPhase> {
    const id = data.id ?? this.autoIncrement++;
    const phase = new SessionPhase(
      id,
      data.sessionId!,
      data.phaseNumber!,
      data.duration!,
      data.fromBpm!,
      data.toBpm!,
      data.fromSpeechiness!,
      data.toSpeechiness!,
      data.fromEnergy!,
      data.toEnergy!,
      data.tracks ?? []
    );
    this.phases.set(id, phase);
    return phase;
  }

  async findById(id: number): Promise<SessionPhase | null> {
    return this.phases.get(id) || null;
  }

  async findAll(): Promise<SessionPhase[]> {
    return Array.from(this.phases.values());
  }

  async update(id: number, data: Partial<SessionPhase>): Promise<SessionPhase | null> {
    const existing = this.phases.get(id);
    if (!existing) return null;
    const updated = new SessionPhase(
      id,
      data.sessionId ?? existing.sessionId,
      data.phaseNumber ?? existing.phaseNumber,
      data.duration ?? existing.duration,
      data.fromBpm ?? existing.fromBpm,
      data.toBpm ?? existing.toBpm,
      data.fromSpeechiness ?? existing.fromSpeechiness,
      data.toSpeechiness ?? existing.toSpeechiness,
      data.fromEnergy ?? existing.fromEnergy,
      data.toEnergy ?? existing.toEnergy,
      data.tracks ?? existing.tracks
    );
    this.phases.set(id, updated);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.phases.delete(id);
  }

  async removeAll(): Promise<void> {
    this.phases.clear();
  }
}