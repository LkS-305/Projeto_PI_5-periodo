import { apiServer } from '../api/server';
import { Prestador } from '@/types/entities/prestador';
import { AtualizarPrestadorDto, CriarPrestadorDto } from '@/types/dtos/prestador';

export const PrestadorGateway = {

  async criarPrestador(dados: CriarPrestadorDto): Promise<Prestador> {
    return apiServer.post<Prestador>('/prestador/criarPrestador', dados);
  },
  
  async deletarPrestador(user_id: string): Promise<boolean> {
    return apiServer.delete<boolean>('/prestador/deletarPrestador', user_id);
  },
  
  async atualizarPrestador(id: string, dados: AtualizarPrestadorDto): Promise<Prestador> {
    return apiServer.patch<Prestador>('/prestador/editarPrestador', dados);
  },
  
  async getByUserId(user_id: string): Promise<Prestador | null> {
    return apiServer.post<Prestador | null>('/prestador/buscarPorUserId', user_id);
  },

}
