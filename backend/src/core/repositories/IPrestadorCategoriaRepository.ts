import { Categoria } from '../entities/Categoria';
import { Prestador } from '../entities/Prestador';

export interface IPrestadorCategoriaRepository {
  adicionar(prestador_id: string, categoria_id: string): Promise<void>;
  remover(prestador_id: string, categoria_id: string): Promise<void>;
  listarPorPrestador(prestador_id: string): Promise<Categoria[]>;
  listarPrestadoresPorCategoria(categoria_id: string): Promise<Prestador[]>;
}
