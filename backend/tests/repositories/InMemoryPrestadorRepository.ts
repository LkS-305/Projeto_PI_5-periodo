import { IPrestadorRepository } from "../../src/core/repositories/IPrestadorRepository";
import { Prestador } from "../../src/core/entities/Prestador";
import { CriarPrestadorDto } from "../../src/core/dtos/prestador";

export class InMemoryPrestadorRepository implements IPrestadorRepository {
  public items: Prestador[] = [];

  async create(prestador: CriarPrestadorDto): Promise<Prestador> {
    const id = `test-uuid-${Math.floor(Math.random() * 1000)}`;
    const newPrestador = new Prestador({
      user_id: prestador.user_id,
      nome: '', // Será preenchido quando criar a partir de um User existente
      email: '',
      senha: '',
      cpf: '',
      tipo_usuario: 'prestador',
      bio: '',
      scorePrestador: 0,
      status_verificacao: 'pendente',
    }, id);

    this.items.push(newPrestador);
    return newPrestador;
  }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((u) => u.id === id);

    this.items.splice(index, 1);
  }

  async update(
    id: string,
    dados: Partial<Prestador>,
  ): Promise<Prestador | null> {
    const index = this.items.findIndex((u) => u.id === id);

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
    const prestador = this.items.find((u) => u.id === id);
    return prestador || null;
  }

  async findByUserId(id: string): Promise<Prestador | null> {
    const prestador = this.items.find((u) => u.id === id);
    return prestador || null;
  }

  async listByCategory(categoria: string): Promise<Prestador[] | null> {
    // .filter retorna todos os que satisfazem a condição
    const resultado = this.items.filter((u) => u.categories === categoria);

    // Se não encontrar nenhum, resultado será [], o que ainda é uma array válida.
    // Você pode retornar a array vazia ou null se preferir:
    return resultado.length > 0 ? resultado : null;
  }
}
