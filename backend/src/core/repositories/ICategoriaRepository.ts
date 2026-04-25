import { Categoria } from '../entities/Categoria';

export interface ICategoriaRepository {
  create(categoria: Categoria): Promise<void>;
  update(categoria: Categoria): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Categoria | null>;
  findAll(): Promise<Categoria[] | null>;
  findByName(nome: string): Promise<Categoria | null>;
}
