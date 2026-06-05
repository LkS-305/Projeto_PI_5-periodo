import { apiClient } from "@/lib/api/client";
import { Servico } from "@/types/entities/servico";
import { ServicoStats, ServicoGateway } from "@/lib/gateways/ServicoGateway";

export type { ServicoStats };

export async function getAllServicos(): Promise<Servico[]> {
  return ServicoGateway.getAll();
}

export async function getServicoStats(): Promise<ServicoStats> {
  return ServicoGateway.getStats();
}

export async function getServicoById(id: string): Promise<Servico> {
  return ServicoGateway.getById(id);
}

export async function getServicosByUserId(user_id: string): Promise<Servico[]> {
  return ServicoGateway.getByUserId(user_id);
}

export async function getServicosByPrestadorId(
  prestador_id: string,
): Promise<Servico[]> {
  return ServicoGateway.getByPrestadorId(prestador_id);
}
