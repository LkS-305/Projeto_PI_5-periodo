import { apiClient } from "../api/client";
import { ExploreCategoria } from "../../types/entities/explore";

export const ExploreGateway = {
  async getAll(): Promise<ExploreCategoria[]> {
    return apiClient.get<ExploreCategoria[]>("/explore");
  },
};
