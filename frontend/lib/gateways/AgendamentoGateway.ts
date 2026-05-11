import { apiServer } from '../api/server';
import { Agendamento } from '../../types/entities/agendamento';
import { AtualizarAgendamentoDto, CriarAgendamentoDto } from '../../types/dtos/agendamento';

export const AgendamentoGateway = {

  async criarAgendamento(dados: CriarAgendamentoDto): Promise<Agendamento> {
    return apiServer.post<Agendamento>('/agendamento/criarAgendamento', dados);
  },
  
  async deletarAgendamento(user_id: string): Promise<boolean> {
    return apiServer.delete<boolean>('/agendamento/deletarAgendamento', user_id);
  },
  
  async atualizarAgendamento(id: string, dados: AtualizarAgendamentoDto): Promise<Agendamento> {
    return apiServer.patch<Agendamento>('/agendamento/editarAgendamento', dados);
  },
  
  async getById(id: string): Promise<Agendamento | null> {
    return apiServer.post<Agendamento | null>('/agendamento/buscarPorId', id);
  },

  async getByUserId(user_id: string): Promise<Agendamento[] | null> {
    return apiServer.post<Agendamento[] | null>('/agendamento/buscarPorUserId', user_id);
  },

  async getByPrestadorId(prestador_id: string): Promise<Agendamento[] | null> {
    return apiServer.post<Agendamento[] | null>('/agendamento/buscarPorPrestadorId', prestador_id);
  },
}
