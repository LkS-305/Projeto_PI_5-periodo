import { ICategoriaRepository } from './../../src/core/repositories/ICategoriaRepository';
import { Categoria } from '../../src/core/entities/Categoria';


export class InMemoryCategoriaRepository implements ICategoriaRepository {
  public items: Categoria[] = [];

    async create(categoria: Categoria): Promise<Categoria> {
      const newCategoria = {...categoria, id: categoria.id || `uuid-fake-${Math.random()}`};
      this.items.push(newCategoria);
      return newCategoria;
  }

    async delete(id: string): Promise<boolean> {
        const index = this.items.findIndex(u => u.id === id);
        if (index === -1) return false;
        this.items.splice(index, 1);
        return true;
    }


async update(id: string, dados: Categoria): Promise<Categoria | null> {
    // 1. Encontra a posição do usuário no array pelo ID
    const index = this.items.findIndex(item => item.id === id);

    // 2. Se não encontrar, retorna null (simulando o banco)
    if (index === -1) {
        return null;
    }

    // 3. Atualiza o item mantendo o ID original e sobrepondo os novos dados
    const usuarioAtualizado = {
        ...this.items[index], // Dados antigos
        ...dados,             // Dados novos (sobrepõe os antigos)
        id: id                // Garante que o ID não mude
    };

    // 4. Salva no array na mesma posição
    this.items[index] = usuarioAtualizado;

    return usuarioAtualizado;
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
