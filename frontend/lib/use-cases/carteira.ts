import client from "@/lib/api/client";
import { Carteira, CarteiraStatus, PagamentosAceitos } from "@/lib/types";

export async function createCarteira(data: {
  usuario_id?: string;
  prestador_id?: string;
  saldo: string;
  metodos_de_pagamento?: PagamentosAceitos;
  status: CarteiraStatus;
}): Promise<Carteira> {
  const response = await client.post<Carteira>(
    "/carteira/criar-carteira",
    data,
  );
  return response.data;
}

export async function deleteCarteira(id: string): Promise<boolean> {
  const response = await client.delete<boolean>("/carteira/deletar-carteira", {
    data: { id },
  });
  return response.data;
}

export async function updateMetodosDePagamento(
  id: string,
  metodos_de_pagamento: PagamentosAceitos,
): Promise<Carteira> {
  const response = await client.patch<Carteira>(
    "/carteira/atualizarMetodosDePagamento",
    { id, metodos_de_pagamento },
  );
  return response.data;
}

export async function updateCarteiraStatus(
  id: string,
  status: CarteiraStatus,
): Promise<Carteira> {
  const response = await client.patch<Carteira>("/carteira/atualizarStatus", {
    id,
    status,
  });
  return response.data;
}

export async function updateCarteiraSaldo(
  id: string,
  saldo: string,
): Promise<Carteira> {
  const response = await client.patch<Carteira>("/carteira/atualizarSaldo", {
    id,
    saldo,
  });
  return response.data;
}

export async function findCarteiraByUserId(user_id: string): Promise<Carteira> {
  const response = await client.get<Carteira>("/carteira/acharPorUserId", {
    params: { id: user_id },
  });
  return response.data;
}

export async function findCarteiraByPrestadorId(
  prestador_id: string,
): Promise<Carteira> {
  const response = await client.get<Carteira>("/carteira/acharPorPrestadorId", {
    params: { id: prestador_id },
  });
  return response.data;
}
