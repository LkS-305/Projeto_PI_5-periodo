import { apiClient } from "../api/client";
import { Servico } from "../../types/entities/servico";
import { AtualizarServicoDto, CriarServicoDto } from "../../types/dtos/servico";

export const ServicoGateway = {
  async criarServico(dados: CriarServicoDto): Promise<Servico> {
    return apiClient.post<Servico>("/servico/criarServico", dados);
  },

  async deletarServico(user_id: string): Promise<boolean> {
    return apiClient.delete<boolean>("/servico/deletarServico", {
      body: user_id,
    });
  },

  async atualizarServico(
    id: string,
    dados: AtualizarServicoDto,
  ): Promise<Servico> {
    return apiClient.patch<Servico>("/servico/editarServico", dados);
  },

  async getById(id: string): Promise<Servico | null> {
    return apiClient.post<Servico | null>("/servico/buscarPorId", id);
  },

  async getByUserId(user_id: string): Promise<Servico[] | null> {
    return apiClient.post<Servico[] | null>(
      "/servico/buscarPorUserId",
      user_id,
    );
  },

  async getByPrestadorId(prestador_id: string): Promise<Servico[] | null> {
    return apiClient.post<Servico[] | null>(
      "/servico/buscarPorPrestadorId",
      prestador_id,
    );
  },
};
