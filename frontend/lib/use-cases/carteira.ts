import { apiClient } from "@/lib/api/client";
import {
  Carteira,
  CarteiraStatus,
  PagamentosAceitados,
} from "@/types/entities/carteira";

export async function createCarteira(data: {
  usuario_id?: string;
  prestador_id?: string;
  saldo: string;
  metodos_de_pagamento?: PagamentosAceitados;
  status: CarteiraStatus;
}): Promise<Carteira> {
  return apiClient.post<Carteira>("/carteira/criar-carteira", data);
}

export async function deleteCarteira(id: string): Promise<boolean> {
  await apiClient.delete<void>("/carteira/deletar-carteira", { body: { id } });
  return true;
}

export async function findCarteiraByUserId(
  user_id: string,
): Promise<Carteira | null> {
  return apiClient.get<Carteira | null>("/carteira/acharPorUserId", {
    params: { id: user_id },
  });
}

export async function findCarteiraByPrestadorId(
  prestador_id: string,
): Promise<Carteira | null> {
  return apiClient.get<Carteira | null>("/carteira/acharPorPrestadorId", {
    params: { id: prestador_id },
  });
}

export async function updateCarteiraStatus(
  id: string,
  status: CarteiraStatus,
): Promise<Carteira> {
  return apiClient.patch<Carteira>("/carteira/atualizarStatus", { id, status });
}

export async function updateCarteiraSaldo(
  id: string,
  saldo: string,
): Promise<Carteira> {
  return apiClient.patch<Carteira>("/carteira/atualizarSaldo", { id, saldo });
}

export async function updateMetodosDePagamento(
  id: string,
  metodos_de_pagamento: PagamentosAceitados,
): Promise<Carteira> {
  return apiClient.patch<Carteira>("/carteira/atualizarMetodosDePagamento", {
    id,
    dados: metodos_de_pagamento,
  });
}
