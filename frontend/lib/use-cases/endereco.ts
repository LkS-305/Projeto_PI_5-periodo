import client from '@/lib/api/client';
import { Endereco } from '@/lib/types';

export async function createEndereco(data: Omit<Endereco, 'id'>): Promise<Endereco> {
  const response = await client.post<Endereco>('/endereco/criarEndereco', data);
  return response.data;
}

export async function deleteEndereco(id: string): Promise<boolean> {
  const response = await client.delete<boolean>('/endereco/deletarEndereco', { data: { id } });
  return response.data;
}

export async function updateEndereco(id: string, endereco: Partial<Endereco>): Promise<Endereco> {
  const response = await client.patch<Endereco>('/endereco/atualizarEndereco', { id, endereco });
  return response.data;
}

export async function findEnderecosByUserId(user_id: string): Promise<Endereco[]> {
  const response = await client.request<Endereco[]>({
    method: 'get',
    url: '/endereco/acharPorUserId',
    data: { id: user_id },
  });
  return response.data;
}

export async function findEnderecosByPrestadorId(prestador_id: string): Promise<Endereco[]> {
  const response = await client.request<Endereco[]>({
    method: 'get',
    url: '/endereco/acharPorPrestadorId',
    data: { id: prestador_id },
  });
  return response.data;
}

export async function findEnderecosByCidade(cidade: string): Promise<Endereco[]> {
  const response = await client.request<Endereco[]>({
    method: 'get',
    url: '/endereco/acharPorCidade',
    data: { cidade },
  });
  return response.data;
}

export async function setEnderecoPrincipal(id: string): Promise<Endereco> {
  const response = await client.request<Endereco>({
    method: 'get',
    url: '/endereco/setPrincipal',
    data: { id },
  });
  return response.data;
}

export async function unsetEnderecoPrincipal(id: string): Promise<Endereco> {
  const response = await client.request<Endereco>({
    method: 'get',
    url: '/endereco/unsetPrincipal',
    data: { id },
  });
  return response.data;
}
