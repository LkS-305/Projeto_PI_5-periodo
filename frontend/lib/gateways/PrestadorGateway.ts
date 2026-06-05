import { apiClient } from "../api/client";
import { Categoria } from "@/types/entities/categoria";
import { Prestador } from "@/types/entities/prestador";
import {
  AtualizarPrestadorDto,
  CriarPrestadorDto,
} from "@/types/dtos/prestador";

export const PrestadorGateway = {
  async criarPrestador(dados: CriarPrestadorDto): Promise<Prestador> {
    return apiClient.post<Prestador>("/prestador/criarPrestador", dados);
  },

  async atualizarPrestador(dados: AtualizarPrestadorDto): Promise<Prestador> {
    return apiClient.patch<Prestador>("/prestador/editarPrestador", dados);
  },

  async getByUserId(user_id: string): Promise<Prestador | null> {
    return apiClient.get<Prestador | null>(
      `/prestador/vitrina/${encodeURIComponent(user_id)}`,
      { skipAuth: true },
    );
  },

  /** Categorias em que o prestador atua (rota pública). */
  async listCategoriasPorPrestador(
    prestador_id: string,
  ): Promise<Categoria[]> {
    const result = await apiClient.get<Categoria[] | null>(
      "/prestador/categorias",
      { params: { prestador_id }, skipAuth: true },
    );
    return result ?? [];
  },
};
