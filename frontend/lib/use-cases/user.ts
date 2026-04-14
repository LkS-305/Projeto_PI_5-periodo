import client from "@/lib/api/client";
import { Usuario } from "@/lib/types";

export async function getUserById(id: string): Promise<Usuario> {
  const response = await client.post<Usuario>("/users/buscarPorId", { id });
  return response.data;
}

export async function getUserByEmail(email: string): Promise<Usuario> {
  const response = await client.post<Usuario>("/users/buscarPorEmail", {
    nome: email,
  });
  return response.data;
}

export async function updateUserById(
  id: string,
  dados: Partial<Usuario>,
): Promise<Usuario> {
  const response = await client.post<Usuario>("/users/atualizar-usuario", {
    id,
    dados,
  });
  return response.data;
}

export async function deleteUserById(id: string): Promise<boolean> {
  const response = await client.post<boolean>("/users/deletarUsuario", { id });
  return response.data;
}
