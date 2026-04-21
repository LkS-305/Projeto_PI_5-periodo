import { IAutenticacaoRepository } from '../../src/core/use-cases/autenticacao/AutenticacaoUseCase';
import { User } from '../../src/core/entities/User';

export class InMemoryAutenticacaoRepository implements IAutenticacaoRepository {
  public items: User[] = [];

  async register(user: User): Promise<User> {
    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((u) => u.email === email) ?? null;
  }
}
