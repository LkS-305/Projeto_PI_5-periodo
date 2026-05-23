import { apiClient } from "../api/client";
import { Mensagem } from "../../types/entities/mensagem";
import { EnviarMensagemDto } from "../../types/dtos/mensagem";

function authHeader(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  const token = localStorage.getItem("authToken");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }

  try {
    const raw =
      localStorage.getItem("authUser") ?? localStorage.getItem("user");
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return typeof parsed?.token === "string" && parsed.token
      ? { Authorization: `Bearer ${parsed.token}` }
      : {};
  } catch {
    return {};
  }
}

export const MensagemGateway = {
  async enviar(dados: EnviarMensagemDto): Promise<Mensagem> {
    return apiClient.post<Mensagem>("/mensagem/enviar", dados, {
      headers: authHeader(),
    });
  },

  async listarPorServico(servico_id: string): Promise<Mensagem[]> {
    return apiClient.get<Mensagem[]>(`/mensagem/servico/${servico_id}`, {
      headers: authHeader(),
    });
  },

  async listarPorUsuario(): Promise<Mensagem[]> {
    return apiClient.get<Mensagem[]>("/mensagem/usuario", {
      headers: authHeader(),
    });
  },

  async marcarComoLida(mensagem_id: string): Promise<void> {
    return apiClient.patch<void>(
      `/mensagem/${mensagem_id}/lida`,
      {},
      {
        headers: authHeader(),
      },
    );
  },
};
