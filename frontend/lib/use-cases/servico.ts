import client from "@/lib/api/client";
import { Servico } from "@/lib/types";

export async function createServico(data: {
  user_id: string;
  prestador_id: string;
  endereco_id: string;
  titulo: string;
  categoria: string;
}): Promise<Servico> {
  return apiClient.post<Servico>("/servico/criar-servico", data);
}

export async function getServicoById(id: string): Promise<Servico> {
  return apiClient.get<Servico>("/servico/acharPorId", { params: { id } });
}

export async function getServicosByUserId(user_id: string): Promise<Servico[]> {
  return apiClient.get<Servico[]>("/servico/acharPorUserId", { params: { id: user_id } });
}

export async function getServicosByPrestadorId(prestador_id: string): Promise<Servico[]> {
  return apiClient.get<Servico[]>("/servico/acharPorPretadorId", { params: { id: prestador_id } });
}

export async function updateServicoStatus(id: string, dados: Partial<Servico>): Promise<Servico> {
  return apiClient.patch<Servico>("/servico/atualizarServico", { id, dados });
}
