import client from "@/lib/api/client";
import { Prestador } from "@/lib/types";

export async function createPrestador(data: {
  user_id: string;
}): Promise<Prestador> {
  const response = await client.post<Prestador>(
    "/prestador/criarPrestador",
    data,
  );
  return response.data;
}

export async function getPrestadorById(id: string): Promise<Prestador> {
  const response = await client.get<Prestador>("/prestador/buscarPorId", {
    params: { id },
  });
  return response.data;
}

export async function getPrestadorByUserId(
  user_id: string,
): Promise<Prestador> {
  const response = await client.get<Prestador>("/prestador/buscarPorUserId", {
    params: { id: user_id },
  });
  return response.data;
}

export async function listPrestadoresByCategoria(
  categoria: string,
): Promise<Prestador[]> {
  const response = await client.get<Prestador[]>(
    "/prestador/listarPorCategoria",
    { params: { categoria } },
  );
  return response.data;
}
