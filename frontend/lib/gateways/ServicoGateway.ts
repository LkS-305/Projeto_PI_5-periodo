import { apiClient } from "../api/client";
import { bearerFromStorage } from "../api/client-auth";
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

  async atualizarServico(dados: AtualizarServicoDto): Promise<void> {
    const body: Record<string, unknown> = { id: dados.id };
    if (dados.titulo !== undefined) body.titulo = dados.titulo;
    if (dados.descricao !== undefined) body.descricao = dados.descricao;
    if (dados.preco_acordado !== undefined) body.preco_acordado = dados.preco_acordado;
    if (dados.data_inicio !== undefined) {
      body.data_inicio =
        dados.data_inicio instanceof Date
          ? dados.data_inicio.toISOString()
          : dados.data_inicio;
    }
    if (dados.duracao !== undefined) body.duracao = dados.duracao;
    if (dados.categoria !== undefined) body.categoria = dados.categoria;
    await apiClient.patch<unknown>("/servico/atualizarServico", body, {
      headers: bearerFromStorage(),
    });
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
