import { apiClient } from "../api/client";
import { Categoria } from "../../types/entities/categoria";

export const CategoriaGateway = {
  async getAll(): Promise<Categoria[]> {
    const result = await apiClient.get<Categoria[] | null>(
      "/categoria/buscarCategorias",
    );
    return result ?? [];
  },
};
