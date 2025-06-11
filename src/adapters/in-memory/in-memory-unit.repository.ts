import { Injectable } from '@nestjs/common';
import { UnitRepository } from '../../core/domain/repository/track.repository';
import { Unit } from '../../core/domain/model/Genre';

@Injectable()
export class InMemoryUnitRepository implements UnitRepository {
  private units: Map<string, Unit> = new Map();

  create(data: Pick<Unit, 'id' | 'title' | 'description' | 'chapterId'>): Unit {
    const unit = new Unit(
      data.id,
      data.title,
      data.description,
      data.chapterId,
    );
    this.units.set(unit.id, unit);
    return unit;
  }

  findById(id: number): Unit | null {
    return this.units.get(id) || null;
  }

  findAll(): Unit[] {
    return Array.from(this.units.values());
  }

  findByChapter(chapterId: string): Unit[] {
    return Array.from(this.units.values()).filter(
      (unit) => unit.chapterId === chapterId,
    );
  }

  update(id: number, unit: Unit): Unit | null {
    if (!this.units.has(id)) {
      return null;
    }
    this.units.set(id, unit);
    return unit;
  }

  remove(id: number): void {
    this.units.delete(id);
  }

  removeAll(): void {
    this.units.clear();
  }
}
