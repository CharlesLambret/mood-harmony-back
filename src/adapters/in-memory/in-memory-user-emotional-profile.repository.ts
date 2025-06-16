import { Injectable } from '@nestjs/common';
import { UserEmotionalProfileRepository } from '../../core/domain/repository/user-emotional-profile.repository';
import { UserEmotionalProfile } from '../../core/domain/model/UserEmotionalProfile';

@Injectable()
export class InMemoryUserEmotionalProfileRepository extends UserEmotionalProfileRepository {
  private profiles: Map<number, UserEmotionalProfile> = new Map();
  private autoIncrement = 1;

  async create(data: Partial<UserEmotionalProfile>): Promise<UserEmotionalProfile> {
    const id = data.id ?? this.autoIncrement++;
    const profile = new UserEmotionalProfile(
      id,
      data.userEmotions ?? [],
      data.updatedAt,
      data.createdAt
    );
    this.profiles.set(id, profile);
    return profile;
  }

  async findById(id: number): Promise<UserEmotionalProfile | null> {
    return this.profiles.get(id) || null;
  }

  async findAll(): Promise<UserEmotionalProfile[]> {
    return Array.from(this.profiles.values());
  }

  async update(id: number, data: Partial<UserEmotionalProfile>): Promise<UserEmotionalProfile | null> {
    const existing = this.profiles.get(id);
    if (!existing) return null;
    const updated = new UserEmotionalProfile(
      id,
      data.userEmotions ?? existing.userEmotions,
      data.updatedAt ?? new Date(),
      data.createdAt ?? existing.createdAt
    );
    this.profiles.set(id, updated);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.profiles.delete(id);
  }

  async removeAll(): Promise<void> {
    this.profiles.clear();
  }

  async findByUserId(userId: number): Promise<UserEmotionalProfile[]> {
    // Si tu ajoutes un champ userId dans UserEmotionalProfile, adapte ici.
    // Sinon, il faut une logique métier pour relier userId à un profil.
    // Ici, on suppose que chaque profil a un userEmotions[] dont chaque UserEmotion a potentiellement un userId dans ses préférences.
    return Array.from(this.profiles.values()).filter(profile =>
      profile.userEmotions.some(ue =>
        ue.userGenrePreferences.some(pref => pref.useremotionId === userId)
      )
    );
  }
}