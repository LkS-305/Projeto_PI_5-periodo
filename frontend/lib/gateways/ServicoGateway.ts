import { apiServer } from '../api/server';
import { Servico } from '../../types/entities/servico';
import { AtualizarServicoDto, CriarServicoDto } from '../../types/dtos/servico';

export const ServicoGateway = {

  async criarServico(dados: CriarServicoDto): Promise<Servico> {
    return apiServer.post<Servico>('/servico/criarServico', dados);
  },
  
  async deletarServico(user_id: string): Promise<boolean> {
    return apiServer.delete<boolean>('/servico/deletarServico', user_id);
  },
  
  async atualizarServico(id: string, dados: AtualizarServicoDto): Promise<Servico> {
    return apiServer.patch<Servico>('/servico/editarServico', dados);
  },
  
  async getById(id: string): Promise<Servico | null> {
    return apiServer.post<Servico | null>('/servico/buscarPorId', id);
  },

  async getByUserId(user_id: string): Promise<Servico[] | null> {
    return apiServer.post<Servico[] | null>('/servico/buscarPorUserId', user_id);
  },

  async getByPrestadorId(prestador_id: string): Promise<Servico[] | null> {
    return apiServer.post<Servico[] | null>('/servico/buscarPorPrestadorId', prestador_id);
  },
}
