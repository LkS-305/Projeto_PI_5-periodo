import { CriarUsuarioDto } from '../dtos/usuario';
import { User } from '../entities/User';

export interface IUserRepository {
  create(user: CriarUsuarioDto): Promise<Partial<User>>; 
  delete(id: string): Promise<boolean>;
  update(id: string, usuario: Partial<User>): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>; 
}
