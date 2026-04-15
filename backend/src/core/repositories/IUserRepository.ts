import { User } from '../entities/User';


export interface IUserRepository {
  delete(user_id: string): Promise<void>;
  update(novoUser: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(user_id: string): Promise<User | null>;
}  
