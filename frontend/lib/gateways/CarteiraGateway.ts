import { apiClient } from '../api/client';
import { Carteira } from '../../types/entities/carteira';

export const CarteiraGateway = {

  async getByUserId(usuario_id: string): Promise<Carteira | null> {
    return apiClient.get<Carteira | null>('/carteira/acharPorUserId', {
      params: { id: usuario_id },
    });
  },

  async getByPrestadorId(prestador_id: string): Promise<Carteira | null> {
    return apiClient.get<Carteira | null>('/carteira/acharPorPrestadorId', {
      params: { id: prestador_id },
    });
  },
};
