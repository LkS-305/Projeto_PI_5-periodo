import { apiClient } from "../api/client";
import { bearerFromStorage } from "../api/client-auth";
import { Usuario } from "../../types/entities/usuario";
import { AtualizarUsuarioDto, CriarUsuarioDto } from "../../types/dtos/usuario";

const auth = () => ({ headers: bearerFromStorage() });

export const UsuarioGateway = {
  async criarUsuario(dados: CriarUsuarioDto): Promise<Usuario> {
    return apiClient.post<Usuario>("/usuario/criarUsuario", dados, auth());
  },

  async deletarUsuario(user_id: string): Promise<boolean> {
    return apiClient.delete<boolean>("/usuario/deletarUsuario", {
      body: { user_id },
      ...auth(),
    });
  },

  async atualizarUsuario(_id: string, dados: AtualizarUsuarioDto): Promise<Usuario> {
    return apiClient.patch<Usuario>("/usuario/editarUsuario", dados, auth());
  },

  async getByUserId(user_id: string): Promise<Usuario | null> {
    return apiClient.post<Usuario | null>(
      "/usuario/buscarPorUserId",
      { user_id },
      auth(),
    );
  },
};
