import { Categoria } from '../entities/Categoria';

export interface ICategoriaRepository {
  create(categoria: Categoria): Promise<Categoria>;
  update(categoria: Categoria): Promise<Categoria>;
  findById(id: string): Promise<Categoria | null>;
  findAll(): Promise<Categoria[]>;
  findByName(nome: string): Promise<Categoria | null>;
}
