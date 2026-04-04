import client from "@/lib/api/client";
import { Servico } from "@/lib/types";

export async function createServico(data: {
  user_id: string;
  prestador_id: string;
  endereco_id: string;
  titulo: string;
  categoria: string;
}): Promise<Servico> {
  const response = await client.post<Servico>("/servico/criar-servico", data);
  return response.data;
}

export async function getServicoById(id: string): Promise<Servico> {
  const response = await client.get<Servico>("/servico/acharPorId", {
    params: { id },
  });
  return response.data;
}

export async function getServicosByUserId(user_id: string): Promise<Servico[]> {
  const response = await client.get<Servico[]>("/servico/acharPorUserId", {
    params: { id: user_id },
  });
  return response.data;
}

export async function getServicosByPrestadorId(
  prestador_id: string,
): Promise<Servico[]> {
  const response = await client.get<Servico[]>("/servico/acharPorPretadorId", {
    params: { id: prestador_id },
  });
  return response.data;
}

export async function updateServicoStatus(
  id: string,
  dados: Partial<Servico>,
): Promise<Servico> {
  const response = await client.patch<Servico>("/servico/atualizarServico", {
    id,
    dados,
  });
  return response.data;
}
