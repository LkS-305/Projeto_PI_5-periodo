import { apiClient } from "../api/client";
import { Servico } from "../../types/entities/servico";
import {
  AbrirServicoDto,
  AtualizarServicoDto,
  AtualizarStatusServicoDto,
  CriarServicoDto,
  ProporAcordoDto,
  ServicoStatus,
} from "../../types/dtos/servico";

export interface ServicoStats {
  ativos: number;
  agendamentos_semana: number;
  receita_mensal: string;
  avaliacao_media: string;
}

export const ServicoGateway = {
  async abrirServico(dados: AbrirServicoDto): Promise<Servico> {
    const payload: CriarServicoDto = {
      ...dados,
      descricao: dados.descricao ?? `Prioridade: ${dados.prioridade}`,
      categoria: dados.categoria,
      preco_acordado: 0,
      status: "criado",
    };
    return apiClient.post<Servico>("/servico/criarServico", payload);
  },

  async atualizarServico(dados: AtualizarServicoDto): Promise<Servico> {
    return apiClient.patch<Servico>("/servico/atualizarServico", dados);
  },

  async atualizarStatus(dados: AtualizarStatusServicoDto): Promise<void> {
    await apiClient.patch<void>("/servico/atualizarStatus", dados);
  },

  async proporAcordo(dados: ProporAcordoDto): Promise<Servico> {
    await apiClient.patch<void>("/servico/atualizarServico", {
      id: dados.id,
      preco_acordado: dados.preco_acordado,
      data_inicio: dados.data_inicio,
      duracao: dados.duracao,
    });
    await apiClient.patch<void>("/servico/atualizarStatus", {
      id: dados.id,
      status: "pendente" as ServicoStatus,
    });
    return ServicoGateway.getById(dados.id);
  },

  async aceitarProposta(servicoId: string): Promise<void> {
    await apiClient.patch<void>("/servico/atualizarStatus", {
      id: servicoId,
      status: "aceito" as ServicoStatus,
    });
  },

  async recusarServico(servicoId: string): Promise<void> {
    await apiClient.patch<void>("/servico/atualizarStatus", {
      id: servicoId,
      status: "recusado" as ServicoStatus,
    });
  },

  async confirmarPagamento(servicoId: string): Promise<void> {
    await apiClient.patch<void>("/servico/atualizarStatus", {
      id: servicoId,
      status: "emAndamento" as ServicoStatus,
    });
  },

  async finalizarServico(servicoId: string): Promise<void> {
    await apiClient.patch<void>("/servico/atualizarStatus", {
      id: servicoId,
      status: "finalizado" as ServicoStatus,
    });
  },

  async getById(id: string): Promise<Servico> {
    return apiClient.get<Servico>("/servico/buscarPorId", { params: { id } });
  },

  async getByUserId(user_id: string): Promise<Servico[]> {
    const result = await apiClient.get<Servico[] | null>(
      "/servico/buscarPorUserId",
      { params: { id: user_id } },
    );
    return result ?? [];
  },

  async getByPrestadorId(prestador_id: string): Promise<Servico[]> {
    const result = await apiClient.get<Servico[] | null>(
      "/servico/buscarPorPrestadorId",
      { params: { id: prestador_id } },
    );
    return result ?? [];
  },

  async getAll(): Promise<Servico[]> {
    return apiClient.get<Servico[]>("/servico/listarTodos");
  },

  async getStats(): Promise<ServicoStats> {
    return apiClient.get<ServicoStats>("/servico/stats");
  },

  filterByStatus(servicos: Servico[], statuses: ServicoStatus[]): Servico[] {
    return servicos.filter((s) =>
      statuses.includes((s.status ?? "criado") as ServicoStatus),
    );
  },
};
