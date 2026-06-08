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

  /** Grava JSON em `metodos_de_pagamento` na linha da carteira do utilizador (cliente ou prestador). */
  async updateMetodosPorConta(owner_id: string, dados: string): Promise<void> {
    await apiClient.patch<{ ok?: boolean }>('/carteira/atualizarMetodosPorConta', {
      owner_id,
      dados,
    });
  },
};
