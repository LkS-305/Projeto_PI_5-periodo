import { apiClient } from "../api/client";
import { Usuario } from "../../types/entities/usuario";
import { CriarUsuarioDto } from "../../types/dtos/usuario";

export const UsuarioClientGateway = {
  async criarUsuario(dados: CriarUsuarioDto, token?: string): Promise<Usuario> {
    return apiClient.post<Usuario>("/usuario/criarUsuario", dados, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};