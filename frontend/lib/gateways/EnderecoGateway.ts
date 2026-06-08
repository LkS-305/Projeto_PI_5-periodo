import { apiClient } from "../api/client";
import { bearerFromStorage } from "../api/client-auth";
import { Endereco } from "../../types/entities/endereco";
import { AtualizarEnderecoDto, CriarEnderecoDto, RetornoApi } from "../../types/dtos/endereco";

const auth = () => ({ headers: bearerFromStorage() });

export const EnderecoGateway = {
  async criarEndereco(dados: CriarEnderecoDto): Promise<Endereco> {
    return apiClient.post<Endereco>("/endereco/criarEndereco", dados, auth());
  },

  async deletarEndereco(id: string): Promise<boolean> {
    return apiClient.delete<boolean>("/endereco/deletarEndereco", {
      body: { id },
      ...auth(),
    });
  },

  async atualizarEndereco(id: string, dados: AtualizarEnderecoDto): Promise<Endereco> {
    return apiClient.patch<Endereco>("/endereco/editarEndereco", { id, dados }, auth());
  },

  async getByUserId(user_id: string): Promise<Endereco[] | null> {
    return apiClient.get<Endereco[] | null>("/endereco/acharPorUserId", {
      params: { id: user_id },
      ...auth(),
    });
  },

  async getByPrestadorId(prestador_id: string): Promise<Endereco[] | null> {
    return apiClient.get<Endereco[] | null>("/endereco/acharPorPrestadorId", {
      params: { id: prestador_id },
      ...auth(),
    });
  },

  async getByCity(cidade: string): Promise<Endereco[] | null> {
    return apiClient.get<Endereco[] | null>("/endereco/acharPorCidade", {
      params: { cidade },
      ...auth(),
    });
  },

  async setPrincipal(id: string): Promise<boolean> {
    return apiClient.get<boolean>("/endereco/setPrincipal", {
      params: { id },
      ...auth(),
    });
  },

  async unsetPrincipal(id: string): Promise<boolean> {
    return apiClient.get<boolean>("/endereco/unsetPrincipal", {
      params: { id },
      ...auth(),
    });
  },

  async getCep(cep: string): Promise<RetornoApi | null> {
    return apiClient.get<RetornoApi | null>("/endereco/buscarCep", {
      params: { cep },
      ...auth(),
    });
  },
};
