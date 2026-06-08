import { apiClient } from "../api/client";
import { bearerFromStorage } from "../api/client-auth";
import { Prestador } from "@/types/entities/prestador";
import { AtualizarPrestadorDto, CriarPrestadorDto } from "@/types/dtos/prestador";

const auth = () => ({ headers: bearerFromStorage() });

export const PrestadorGateway = {
  async criarPrestador(dados: CriarPrestadorDto): Promise<Prestador> {
    return apiClient.post<Prestador>("/prestador/criarPrestador", dados, auth());
  },

  async deletarPrestador(user_id: string): Promise<boolean> {
    return apiClient.delete<boolean>("/prestador/deletarPrestador", {
      body: { user_id },
      ...auth(),
    });
  },

  async atualizarPrestador(_id: string, dados: AtualizarPrestadorDto): Promise<Prestador> {
    return apiClient.patch<Prestador>("/prestador/editarPrestador", dados, auth());
  },

  async getByUserId(user_id: string): Promise<Prestador | null> {
    return apiClient.post<Prestador | null>(
      "/prestador/buscarPorUserId",
      { user_id },
      auth(),
    );
  },
};
