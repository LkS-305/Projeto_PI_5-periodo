<<<<<<< Updated upstream
import client from "@/lib/api/client";
import { Prestador } from "@/lib/types";
=======
import { apiClient } from "@/lib/api/client";
import { Prestador } from "@/types/entities/prestador";
>>>>>>> Stashed changes

export async function createPrestador(data: { user_id: string }): Promise<Prestador> {
  return apiClient.post<Prestador>("/prestador/criarPrestador", data);
}

export async function getPrestadorById(id: string): Promise<Prestador> {
  return apiClient.get<Prestador>("/prestador/buscarPorId", { params: { id } });
}

export async function getPrestadorByUserId(user_id: string): Promise<Prestador> {
  return apiClient.get<Prestador>("/prestador/buscarPorUserId", { params: { id: user_id } });
}

export async function listPrestadoresByCategoria(categoria: string): Promise<Prestador[]> {
  return apiClient.get<Prestador[]>("/prestador/listarPorCategoria", { params: { categoria } });
}
