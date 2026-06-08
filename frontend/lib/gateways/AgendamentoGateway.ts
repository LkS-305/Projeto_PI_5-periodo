import { apiClient } from "../api/client";
import { bearerFromStorage } from "../api/client-auth";
import { Agendamento } from "../../types/entities/agendamento";
import { AtualizarAgendamentoDto, CriarAgendamentoDto } from "../../types/dtos/agendamento";

const auth = () => ({ headers: bearerFromStorage() });

export const AgendamentoGateway = {
  async criarAgendamento(dados: CriarAgendamentoDto): Promise<Agendamento> {
    return apiClient.post<Agendamento>("/agendamento/criarAgendamento", dados, auth());
  },

  async deletarAgendamento(id: string): Promise<boolean> {
    return apiClient.delete<boolean>("/agendamento/deletarAgendamento", {
      body: { id },
      ...auth(),
    });
  },

  async atualizarAgendamento(id: string, dados: AtualizarAgendamentoDto): Promise<Agendamento> {
    return apiClient.patch<Agendamento>("/agendamento/editarAgendamento", dados, auth());
  },

  async getById(id: string): Promise<Agendamento | null> {
    return apiClient.post<Agendamento | null>("/agendamento/buscarPorId", { id }, auth());
  },

  async getByUserId(user_id: string): Promise<Agendamento[] | null> {
    return apiClient.post<Agendamento[] | null>("/agendamento/buscarPorUserId", { id: user_id }, auth());
  },

  async getByPrestadorId(prestador_id: string): Promise<Agendamento[] | null> {
    return apiClient.post<Agendamento[] | null>(
      "/agendamento/buscarPorPrestadorId",
      { id: prestador_id },
      auth(),
    );
  },
};
