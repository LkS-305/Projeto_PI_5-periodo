import { apiServer } from '../api/server';
import { Usuario } from '../../types/entities/usuario';
import { AtualizarUsuarioDto, CriarUsuarioDto } from '../../types/dtos/usuario';

export const UsuarioGateway = {

  async criarUsuario(dados: CriarUsuarioDto): Promise<Usuario> {
    return apiServer.post<Usuario>('/usuario/criarUsuario', dados);
  },
  
  async deletarUsuario(user_id: string): Promise<boolean> {
    return apiServer.delete<boolean>('/usuario/deletarUsuario', user_id);
  },
  
  async atualizarUsuario(id: string, dados: AtualizarUsuarioDto): Promise<Usuario> {
    return apiServer.patch<Usuario>('/usuario/editarUsuario', dados);
  },
  
  async getByUserId(user_id: string): Promise<Usuario | null> {
    return apiServer.post<Usuario | null>('/usuario/buscarPorUserId', user_id);
  },

}
