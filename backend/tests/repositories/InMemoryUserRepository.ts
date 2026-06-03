import { IUserRepository } from "../../src/core/repositories/IUserRepository";
import { User } from "../../src/core/entities/User";
import { LoginDto, RegisterDto } from "../../src/core/dtos/user";

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];
  // 1. REGISTER
  async register(usuario: User): Promise<void> {
    this.items.push(usuario);
  }

  // 2. LOGIN
  async login(props: LoginDto): Promise<User | null> {
    return this.items.find((u) => u.email === props.email) || null;
  }

  // 3. FORGOT PASSWORD (O método que faltava na implementação)
  // Ele procura o utilizador pelo e-mail e atualiza o token de recuperação
  async forgotPassword(
    email: string,
    codigo: string,
    expiracao: Date,
  ): Promise<void> {
    const index = this.items.findIndex((u) => u.email === email);

    if (index !== -1) {
      this.items[index].recovery_token = codigo;
      this.items[index].recovery_token_expires = expiracao;
    }
  }

  // 4. UPDATE RECOVERY TOKEN (Caso a tua interface também peça este pelo ID)
  async updateRecoveryToken(
    usuario_id: string,
    codigo: string | null,
    expiracao: Date | null,
  ): Promise<void> {
    const index = this.items.findIndex((u) => u.id === usuario_id);
    if (index !== -1) {
      this.items[index].recovery_token = codigo!;
      this.items[index].recovery_token_expires = expiracao!;
    }
  }

  // 5. CHANGE PASSWORD
  async changePassword(id: string, nova_senha_hash: string): Promise<void> {
    const index = this.items.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.items[index].senha = nova_senha_hash;
    }
  }

  async create(user: any): Promise<User> {
    this.items.push(user);
    return user;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((u) => u.id === id);
    if (index === -1) return;
    this.items.splice(index, 1);
  }

  async update(novoUser: User): Promise<void> {
    const index = this.items.findIndex((u) => u.id === novoUser.id);

    if (index === -1) return;
    // Atualiza a lista em memória
    this.items[index] = novoUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((u) => u.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((u) => u.id === id);
    return user || null;
  }
}
