import { apiClient } from '../api/client';
import { Transacao } from '../../types/entities/transacao';

export const TransacaoGateway = {

  async getByUserId(user_id: string): Promise<Transacao[]> {
    return apiClient.get<Transacao[]>('/transacao/porUsuario', {
      params: { id: user_id },
    });
  },

  async getByPrestadorId(prestador_id: string): Promise<Transacao[]> {
    return apiClient.get<Transacao[]>('/transacao/porPrestador', {
      params: { id: prestador_id },
    });
  },
};
