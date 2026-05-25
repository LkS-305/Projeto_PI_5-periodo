<<<<<<< Updated upstream
import client from "@/lib/api/client";
import { Carteira, CarteiraStatus, PagamentosAceitos } from "@/lib/types";
=======
import { apiClient } from "@/lib/api/client";
import {
  Carteira,
  CarteiraStatus,
  PagamentosAceitados,
} from "@/types/entities/carteira";
>>>>>>> Stashed changes

export async function createCarteira(data: {
  usuario_id?: string;
  prestador_id?: string;
  saldo: string;
<<<<<<< Updated upstream
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
=======
  metodos_de_pagamento?: PagamentosAceitados;
  status: CarteiraStatus;
}): Promise<Carteira> {
  return apiClient.post<Carteira>("/carteira/criarCarteira", data);
}

export async function deleteCarteira(id: string): Promise<boolean> {
  return apiClient.delete<boolean>("/carteira/deletarCarteira", {
    params: { id },
  });
}

export async function findCarteiraByUserId(user_id: string): Promise<Carteira> {
  return apiClient.get<Carteira>("/carteira/buscarPorUserId", {
    params: { id: user_id },
  });
}

export async function findCarteiraByPrestadorId(
  prestador_id: string,
): Promise<Carteira> {
  return apiClient.get<Carteira>("/carteira/buscarPorPrestadorId", {
    params: { id: prestador_id },
  });
>>>>>>> Stashed changes
}

export async function updateCarteiraStatus(
  id: string,
  status: CarteiraStatus,
): Promise<Carteira> {
<<<<<<< Updated upstream
  const response = await client.patch<Carteira>("/carteira/atualizarStatus", {
    id,
    status,
  });
  return response.data;
=======
  return apiClient.patch<Carteira>("/carteira/atualizarStatus", { id, status });
>>>>>>> Stashed changes
}

export async function updateCarteiraSaldo(
  id: string,
  saldo: string,
): Promise<Carteira> {
<<<<<<< Updated upstream
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
=======
  return apiClient.patch<Carteira>("/carteira/atualizarSaldo", { id, saldo });
}

export async function updateMetodosDePagamento(
  id: string,
  metodos_de_pagamento: PagamentosAceitados,
): Promise<Carteira> {
  return apiClient.patch<Carteira>("/carteira/atualizarMetodos", {
    id,
    metodos_de_pagamento,
  });
>>>>>>> Stashed changes
}
