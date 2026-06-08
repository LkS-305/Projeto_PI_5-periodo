import { apiClient } from '../api/client';
import { bearerFromStorage } from '../api/client-auth';
import { Transacao } from '../../types/entities/transacao';
import type {
  IniciarPagamentoPayload,
  IniciarPagamentoResponse,
} from '../../types/dtos/transacao';

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

  async getByServicoId(servico_id: string): Promise<Transacao | null> {
    try {
      return await apiClient.get<Transacao>("/transacao/porServico", {
        params: { id: servico_id },
      });
    } catch {
      return null;
    }
  },

  /** Cria cobrança no Asaas (PIX, boleto ou fatura UNDEFINED) e regista transação pendente (requer JWT). */
  async iniciarPagamento(
    body: IniciarPagamentoPayload,
  ): Promise<IniciarPagamentoResponse> {
    return apiClient.post<IniciarPagamentoResponse>('/transacao/iniciar', body, {
      headers: bearerFromStorage(),
    });
  },
};
