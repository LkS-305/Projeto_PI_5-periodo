import { Usuario } from '../entities/Usuario';

export interface IUsuarioRepository {
  create(usuario: Usuario): Promise<void>;
  update(dados: Usuario): Promise<void>;
  delete(user_id: string): Promise<void>;
  findByUserId(user_id: string): Promise<Usuario | null>;}
