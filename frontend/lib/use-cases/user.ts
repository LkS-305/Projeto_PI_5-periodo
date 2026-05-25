<<<<<<< Updated upstream
import client from "@/lib/api/client";
import { Usuario } from "@/lib/types";
=======
import { apiClient } from "@/lib/api/client";
import { Usuario } from "@/types/entities/usuario";
>>>>>>> Stashed changes

export async function getUserById(id: string): Promise<Usuario> {
  return apiClient.post<Usuario>("/users/buscarPorId", { id });
}

export async function getUserByEmail(email: string): Promise<Usuario> {
  return apiClient.post<Usuario>("/users/buscarPorEmail", { email });
}

export async function updateUserById(id: string, dados: Partial<Usuario>): Promise<Usuario> {
  return apiClient.post<Usuario>("/users/atualizar-usuario", { id, dados });
}

export async function deleteUserById(id: string): Promise<boolean> {
  return apiClient.post<boolean>("/users/deletarUsuario", { id });
}
