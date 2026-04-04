import { IUserRepository } from '../../src/core/repositories/IUserRepository';
import { User } from '../../src/core/entities/User';

export class InMemoryUsuarioRepository implements IUserRepository {
    public items: User[] = [];

    async create(user: User): Promise<User> {
        const newUser = {
            ...user,
            id: user.id || 'test-uuid-123' // Simula o gen_random_uuid()
        };
        this.items.push(newUser);
        return newUser;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.items.findIndex(u => u.id === id);
        if (index === -1) return false;
        this.items.splice(index, 1);
        return true;
    }

    async update(id: string, dados: Partial<User>): Promise<User | null> {
     const index = this.items.findIndex(u => u.id === id);

      if (index === -1) {
        return null;
      }

     // Mescla o que já existia com as novas informações
     const usuarioAtualizado = {
       ...this.items[index],
       ...dados,
     };

      // Atualiza a lista em memória
      this.items[index] = usuarioAtualizado;

      return usuarioAtualizado;
    }
   
    async findByEmail(email: string): Promise<User | null> {
        const user = this.items.find(u => u.email === email);
        return user || null;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.items.find(u => u.id === id);
        return user || null;
    }
}
