import { IPrestadorRepository } from '../../src/core/repositories/IPrestadorRepository';
import { Prestador } from '../../src/core/entities/Prestador';


export class InMemoryPrestadorRepository implements IPrestadorRepository {
  public items: Prestador[] = [];

     async create(prestador: Prestador): Promise<Prestador> {
        const newPrestador = {
            ...prestador,
            id: prestador.id || 'test-uuid-123' // Simula o gen_random_uuid()
        };
        this.items.push(newPrestador);
        return newPrestador;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.items.findIndex(u => u.id === id);
        if (index === -1) return false;
        this.items.splice(index, 1);
        return true;
    }

    async update(id: string, dados: Partial<Prestador>): Promise<Prestador | null> {
     const index = this.items.findIndex(u => u.id === id);

      if (index === -1) {
        return null;
      }

     // Mescla o que já existia com as novas informações
     const prestadorAtualizado = {
       ...this.items[index],
       ...dados,
     };

      // Atualiza a lista em memória
      this.items[index] = prestadorAtualizado;

      return prestadorAtualizado;
    }
   
    async findById(id: string): Promise<Prestador | null> {
        const prestador = this.items.find(u => u.id === id);
        return prestador || null;
    }

    async findByUserId(id: string): Promise<Prestador | null> {
        const prestador = this.items.find(u => u.id === id);
        return prestador || null;
    }

    async listByCategory(categoria: string): Promise<Prestador[] | null> {
      // .filter retorna todos os que satisfazem a condição
      const resultado = this.items.filter(u => u.categories === categoria);

      // Se não encontrar nenhum, resultado será [], o que ainda é uma array válida.
      // Você pode retornar a array vazia ou null se preferir:
      return resultado.length > 0 ? resultado : null;
    }
}
