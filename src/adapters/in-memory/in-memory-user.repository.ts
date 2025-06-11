import { UserRepository } from '../../core/domain/repository/user.repository';
import { User } from '../../core/domain/model/User';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  create(data: Pick<User, 'id' | 'email' | 'password' | 'name' | 'firstName' | 'emotionProfile' >): User {
    const user = new User(
      data.id,
      data.email,
      data.password,
      data.name,
      data.firstName,
      data.emotionProfile,
      new Date(),
      new Date(),
    );
    this.users.set(user.id.toString(), user);
    return user;
  }

  findById(id: number): User | null {
    return this.users.get(id.toString()) || null;
  }

  findByEmail(email: string): User | null {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  update(id: number, user: User): User | null {
    if (!this.users.has(id.toString())) {
      return null;
    }
    this.users.set(id.toString(), user);
    return user;
  }

  remove(id: number): void {
    this.users.delete(id.toString());
  }

  removeAll(): void {
    this.users.clear();
  }
}
