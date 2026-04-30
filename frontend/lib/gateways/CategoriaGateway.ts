import { apiServer } from '../api/server';
import { Categoria } from '../../types/entities/categoria';
import { AtualizarCategoriaDto, CriarCategoriaDto } from '../../types/dtos/categoria';

export const CategoriaGateway = {

  async criarCategoria(dados: CriarCategoriaDto): Promise<Categoria> {
    return apiServer.post<Categoria>('/categoria/criarCategoria', dados);
  },
  
  async deletarCategoria(user_id: string): Promise<boolean> {
    return apiServer.delete<boolean>('/categoria/deletarCategoria', user_id);
  },
  
  async atualizarCategoria(id: string, dados: AtualizarCategoriaDto): Promise<Categoria> {
    return apiServer.patch<Categoria>('/categoria/editarCategoria', {id, dados});
  },
  
  async getById(id: string): Promise<Categoria | null> {
    return apiServer.post<Categoria | null>('/categoria/buscarPorId', id);
  },

  async getAll(): Promise<Categoria[] | null> {
    return apiServer.get<Categoria[] | null>('/categoria/buscarCategorias');
  },

  async getByName(nome: string): Promise<Categoria | null> {
    return apiServer.post<Categoria | null>('/categoria/buscarPorNome', nome);
  },
}
