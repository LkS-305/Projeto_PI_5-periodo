import { Categoria } from '../entities/Categoria';

export interface ICategoriaRepository {
  create(categoria: Categoria): Promise<Categoria>;
  delete(id: string): Promise<boolean>;
  update(id: string, categoria: Partial<Categoria>): Promise<Categoria | null>;
  findById(id: string): Promise<Categoria | null>;
  findAll(): Promise<Categoria[] | null>;
  findByName(nome: string): Promise<Categoria | null>;
}
