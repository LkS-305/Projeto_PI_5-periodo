import { apiServer } from '../api/server';
import { Avaliacao } from '../../types/entities/avaliacao';
import { AtualizarAvaliacaoDto, CriarAvaliacaoDto } from '../../types/dtos/avaliacao';

export const AvaliacaoGateway = {

  async criarAvaliacao(dados: CriarAvaliacaoDto): Promise<Avaliacao> {
    return apiServer.post<Avaliacao>('/avaliacao/criarAvaliacao', dados);
  },
  
  async deletarAvaliacao(user_id: string): Promise<boolean> {
    return apiServer.delete<boolean>('/avaliacao/deletarAvaliacao', user_id);
  },
  
  async atualizarAvaliacao(id: string, dados: AtualizarAvaliacaoDto): Promise<Avaliacao> {
    return apiServer.patch<Avaliacao>('/avaliacao/editarAvaliacao', dados);
  },
  
  async getByServico(servico_id: string): Promise<Avaliacao[] | null> {
    return apiServer.post<Avaliacao[] | null>('/avaliacao/buscarPorServicoId', servico_id);
  },

  async getByUserId(user_id: string): Promise<Avaliacao[] | null> {
    return apiServer.post<Avaliacao[] | null>('/avaliacao/buscarPorUserId', user_id);
  },

  async getByPrestadorId(prestador_id: string): Promise<Avaliacao[] | null> {
    return apiServer.post<Avaliacao[] | null>('/avaliacao/buscarPorPrestadorId', prestador_id);
  },
}
