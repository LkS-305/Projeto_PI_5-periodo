import { randomUUID } from 'crypto';
import { ICategoriaRepository } from './../../src/core/repositories/ICategoriaRepository';
import { Categoria } from '../../src/core/entities/Categoria';


export class InMemoryCategoriaRepository implements ICategoriaRepository {
  public items: Categoria[] = [];

    async create(categoria: Categoria): Promise<void> {
      this.items.push(categoria);
  }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex(u => u.id === id);
        if (index === -1) return;
        this.items.splice(index, 1);
    }


async update(categoria: Categoria): Promise<void> {
    const index = this.items.findIndex(item => item.id === categoria.id);
    if (index === -1) return;
    this.items[index] = categoria;
}


   
    async findById(id: string): Promise<Categoria | null> {
        const categoria = this.items.find(u => u.id === id);
        return categoria || null;
    }

    async findAll(): Promise<Categoria[] | null> {
        return [...this.items];
  }

    async findByName(nome: string): Promise<Categoria | null> {
        const user = this.items.find(u => u.nome === nome);
        return user || null;
    }
}
