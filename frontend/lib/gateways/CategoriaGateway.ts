import { apiClient } from "../api/client";
import { bearerFromStorage } from "../api/client-auth";
import { Categoria } from "../../types/entities/categoria";
import { AtualizarCategoriaDto, CriarCategoriaDto } from "../../types/dtos/categoria";

const auth = () => ({ headers: bearerFromStorage() });

export const CategoriaGateway = {
  async criarCategoria(dados: CriarCategoriaDto): Promise<Categoria> {
    return apiClient.post<Categoria>("/categoria/criarCategoria", dados, auth());
  },

  async deletarCategoria(id: string): Promise<boolean> {
    return apiClient.delete<boolean>("/categoria/deletarCategoria", {
      body: { id },
      ...auth(),
    });
  },

  async atualizarCategoria(id: string, dados: AtualizarCategoriaDto): Promise<Categoria> {
    return apiClient.patch<Categoria>("/categoria/editarCategoria", { id, dados }, auth());
  },

  async getById(id: string): Promise<Categoria | null> {
    return apiClient.post<Categoria | null>("/categoria/buscarPorId", { id }, auth());
  },

  async getAll(): Promise<Categoria[] | null> {
    return apiClient.get<Categoria[] | null>("/categoria/buscarCategorias", auth());
  },

  async getByName(nome: string): Promise<Categoria | null> {
    return apiClient.post<Categoria | null>("/categoria/buscarPorNome", { name: nome }, auth());
  },
};
