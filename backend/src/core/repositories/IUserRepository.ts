import { User } from '../entities/User';
import { Usuario } from '../entities/Usuario';
import { CriarUserDto } from '../dtos/User';


export interface IUserRepository {
  delete(user_id: string): Promise<void>;
  update(novoUser: UpdateUserDto): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(user_id: string): Promise<User | null>;
}  
