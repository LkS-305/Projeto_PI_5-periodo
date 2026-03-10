import { User } from '../entities/User';

export interface IUserRepository {
  create(user: User): Promise<User>; 
  login(email: string, password: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  
} 
