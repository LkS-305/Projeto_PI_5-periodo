import { apiClient } from "../api/client";
import { bearerFromStorage } from "../api/client-auth";
import { Avaliacao } from "../../types/entities/avaliacao";
import { AtualizarAvaliacaoDto, CriarAvaliacaoDto } from "../../types/dtos/avaliacao";

const auth = () => ({ headers: bearerFromStorage() });

export const AvaliacaoGateway = {
  async criarAvaliacao(dados: CriarAvaliacaoDto): Promise<Avaliacao> {
    return apiClient.post<Avaliacao>("/avaliacao/criarAvaliacao", dados, auth());
  },

  async deletarAvaliacao(id: string): Promise<boolean> {
    return apiClient.delete<boolean>("/avaliacao/deletarAvaliacao", {
      body: { id },
      ...auth(),
    });
  },

  async atualizarAvaliacao(id: string, dados: AtualizarAvaliacaoDto): Promise<Avaliacao> {
    return apiClient.patch<Avaliacao>("/avaliacao/editarAvaliacao", { id, dados }, auth());
  },

  async getByServico(servico_id: string): Promise<Avaliacao[] | null> {
    return apiClient.get<Avaliacao[] | null>("/avaliacao/buscarPorServicoId", {
      params: { id: servico_id, listBy: "servico" },
      ...auth(),
    });
  },

  async getByUserId(user_id: string): Promise<Avaliacao[] | null> {
    return apiClient.get<Avaliacao[] | null>("/avaliacao/buscarPorUser", {
      params: { id: user_id, listBy: "usuario" },
      ...auth(),
    });
  },

  async getByPrestadorId(prestador_id: string): Promise<Avaliacao[] | null> {
    return apiClient.get<Avaliacao[] | null>("/avaliacao/buscarPorPrestador", {
      params: { id: prestador_id, listBy: "prestador" },
      ...auth(),
    });
  },
};
