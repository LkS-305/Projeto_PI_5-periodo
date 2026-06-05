import { apiClient } from "../api/client";

export interface PortfolioItem {
  id: string;
  prestador_id: string;
  url: string;
  tipo: string;
  descricao?: string;
  ordem: number;
}

export const PortfolioGateway = {
  async listByPrestador(prestador_id: string): Promise<PortfolioItem[]> {
    const result = await apiClient.get<PortfolioItem[]>("/portfolio", {
      params: { prestador_id },
      skipAuth: true,
    });
    return result ?? [];
  },
};
