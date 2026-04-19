import { LoginDto } from "../dtos/user";
import { User } from "../entities/User";

export interface IUserRepository {
  register(user: User): Promise<Omit<User, "senha"> | null>;
  login(props: LoginDto): Promise<Omit<User, "senha"> | null>;
  updateRecoveryToken(
    usuario_id: string,
    codigo: string | null,
    expiracao: Date | null,
  ): Promise<void>;
  changePassword(id: string, nova_senha: string): Promise<void>;

  delete(user_id: string): Promise<void>;
  update(novoUser: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(user_id: string): Promise<User | null>;
}
