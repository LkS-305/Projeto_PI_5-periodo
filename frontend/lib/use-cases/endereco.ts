<<<<<<< Updated upstream
import client from '@/lib/api/client';
import { Endereco } from '@/lib/types';
=======
import { apiClient } from '@/lib/api/client';
import { Endereco } from '@/types/entities/endereco';
>>>>>>> Stashed changes

export async function createEndereco(data: Omit<Endereco, 'id'>): Promise<Endereco> {
  return apiClient.post<Endereco>('/endereco/criarEndereco', data);
}

export async function deleteEndereco(id: string): Promise<boolean> {
  return apiClient.delete<boolean>('/endereco/deletarEndereco', { params: { id } });
}

export async function updateEndereco(id: string, endereco: Partial<Endereco>): Promise<Endereco> {
  return apiClient.patch<Endereco>('/endereco/atualizarEndereco', { id, endereco });
}

export async function findEnderecosByUserId(user_id: string): Promise<Endereco[]> {
  return apiClient.get<Endereco[]>('/endereco/acharPorUserId', { params: { id: user_id } });
}

export async function findEnderecosByPrestadorId(prestador_id: string): Promise<Endereco[]> {
  return apiClient.get<Endereco[]>('/endereco/acharPorPrestadorId', { params: { id: prestador_id } });
}

export async function findEnderecosByCidade(cidade: string): Promise<Endereco[]> {
  return apiClient.get<Endereco[]>('/endereco/acharPorCidade', { params: { cidade } });
}

export async function setEnderecoPrincipal(id: string): Promise<Endereco> {
  return apiClient.post<Endereco>('/endereco/setPrincipal', { id });
}

export async function unsetEnderecoPrincipal(id: string): Promise<Endereco> {
  return apiClient.post<Endereco>('/endereco/unsetPrincipal', { id });
}
