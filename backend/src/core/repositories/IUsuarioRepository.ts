import { AtualizarUsuarioDto, CriarUsuarioDto } from '../dtos/usuario';
import { Usuario } from '../entities/Usuario';

export interface IUsuarioRepository {
  create(usuario: CriarUsuarioDto): Promise<Usuario>;
  update(novoUsuario: AtualizarUsuarioDto): Promise<void>;
  delete(user_id: string): Promise<void>;
  findByUserId(user_id: string): Promise<Usuario | null>;
  

}
