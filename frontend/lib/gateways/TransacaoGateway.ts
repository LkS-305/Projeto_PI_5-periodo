import { apiClient } from "../api/client";
import { IniciarPagamentoDto } from "../../types/dtos/transacao";
import {
  IniciarPagamentoResponse,
  Transacao,
} from "../../types/entities/transacao";

export const TransacaoGateway = {
  async getByUserId(user_id: string): Promise<Transacao[]> {
    const result = await apiClient.get<Transacao[] | Transacao>(
      "/transacao/porUsuario",
      { params: { id: user_id } },
    );
    return Array.isArray(result) ? result : result ? [result] : [];
  },

  async getByPrestadorId(prestador_id: string): Promise<Transacao[]> {
    const result = await apiClient.get<Transacao[] | Transacao>(
      "/transacao/porPrestador",
      { params: { id: prestador_id } },
    );
    return Array.isArray(result) ? result : result ? [result] : [];
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

  async iniciarPagamento(
    dados: IniciarPagamentoDto,
  ): Promise<IniciarPagamentoResponse> {
    return apiClient.post<IniciarPagamentoResponse>(
      "/transacao/iniciar",
      dados,
    );
  },
};
