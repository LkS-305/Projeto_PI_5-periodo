import { CriarUsuarioDto } from '../dtos/usuario';
import { User } from '../entities/User';

export interface IUserRepository {
  delete(id: string): Promise<boolean>;
  update(id: string, dados: Partial<User>): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}  
