import { CriarUsuarioDto } from '../dtos/usuario';
import { Usuario } from '../entities/Usuario';

export interface IUsuarioRepository {
  create(usuario: CriarUsuarioDto): Promise<Usuario>;
  update(user_id: string, dados: Partial<Usuario>): Promise<void>;
  delete(user_id: string): Promise<void>;
  findByUserId(user_id: string): Promise<Usuario | null>;
  findByEmail(email: string | undefined): Promise<Usuario | null>;
  findById(id: string): Promise<Usuario | null>;
}
