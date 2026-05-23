import { apiClient } from "../api/client";
import { Mensagem } from "../../types/entities/mensagem";
import { EnviarMensagemDto } from "../../types/dtos/mensagem";

export const MensagemGateway = {
  async enviar(dados: EnviarMensagemDto): Promise<Mensagem> {
    return apiClient.post<Mensagem>("/mensagem/enviar", dados);
  },

  async listarPorServico(servico_id: string): Promise<Mensagem[]> {
    return apiClient.get<Mensagem[]>(`/mensagem/servico/${servico_id}`);
  },

  async listarPorUsuario(): Promise<Mensagem[]> {
    return apiClient.get<Mensagem[]>("/mensagem/usuario");
  },

  async marcarComoLida(mensagem_id: string): Promise<void> {
    return apiClient.patch<void>(`/mensagem/${mensagem_id}/lida`, {});
  },
};
