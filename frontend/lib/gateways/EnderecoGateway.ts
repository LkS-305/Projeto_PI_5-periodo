import { apiServer } from '../api/server';
import { Endereco } from '../../types/entities/endereco';
import { AtualizarEnderecoDto, CriarEnderecoDto, RetornoApi } from '../../types/dtos/endereco';

export const EnderecoGateway = {

  async criarEndereco(dados: CriarEnderecoDto): Promise<Endereco> {
    return apiServer.post<Endereco>('/endereco/criarEndereco', dados);
  },
  
  async deletarEndereco(id: string): Promise<boolean> {
    return apiServer.delete<boolean>('/endereco/deletarEndereco', id);
  },
  
  async atualizarEndereco(id: string, dados: AtualizarEnderecoDto): Promise<Endereco> {
    return apiServer.patch<Endereco>('/endereco/editarEndereco', {id, dados});
  },
  
  async getByUserId(user_id: string): Promise<Endereco[] | null> {
    return apiServer.post<Endereco[] | null>('/endereco/buscarPorUserId', user_id);
  },

  async getByPrestadorId(prestador_id: string): Promise<Endereco[] | null> {
    return apiServer.post<Endereco[] | null>('/endereco/buscarPorPrestadorId', prestador_id);
  },
  
  async getByCity(cidade: string): Promise<Endereco[] | null> {
    return apiServer.post<Endereco[] | null>('/endereco/acharPorCidade', cidade);
  },

  async setPrincipal(id: string): Promise<boolean> {
    return apiServer.post<boolean>('/endereco/setPrincipal', id);
  },

  async unsetPrincipal(id: string): Promise<boolean> {
    return apiServer.post<boolean>('/endereco/unsetPrincpal', id);
  },

  async getCep(cep: string): Promise<RetornoApi | null>{
    return apiServer.post<RetornoApi | null>('/endereco/buscarCep', cep);
  }
}
