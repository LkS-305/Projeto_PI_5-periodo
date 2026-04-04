import client from "@/lib/api/client";
import {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  Usuario,
} from "@/lib/types";

export async function loginUser(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>(
    "/users/login",
    credentials,
  );
  return response.data;
}

export async function signUpUser(data: SignUpRequest): Promise<Usuario> {
  const response = await client.post<Usuario>("/users/criarUsuario", data);
  return response.data;
}

export async function fetchUserById(id: string): Promise<Usuario> {
  const response = await client.post<Usuario>("/users/buscarPorId", { id });
  return response.data;
}

export async function fetchUserByEmail(email: string): Promise<Usuario> {
  const response = await client.post<Usuario>("/users/buscarPorEmail", {
    nome: email,
  });
  return response.data;
}

export async function updateUser(
  id: string,
  dados: Partial<Usuario>,
): Promise<Usuario> {
  const response = await client.post<Usuario>("/users/atualizar-usuario", {
    id,
    dados,
  });
  return response.data;
}

export async function deleteUser(id: string): Promise<boolean> {
  const response = await client.post<boolean>("/users/deletarUsuario", { id });
  return response.data;
}
