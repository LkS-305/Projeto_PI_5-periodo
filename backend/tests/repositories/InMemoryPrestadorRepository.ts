import { IPrestadorRepository } from "../../src/core/repositories/IPrestadorRepository";
import { Prestador } from "../../src/core/entities/Prestador";
import { CriarPrestadorDto } from "../../src/core/dtos/prestador";

export class InMemoryPrestadorRepository implements IPrestadorRepository {
  public items: Prestador[] = [];

  async create(prestador: Prestador): Promise<Prestador> {
    const newPrestador = new Prestador(
      {
        user_id: prestador.user_id,
        nome: prestador.nome,
        bio: prestador.bio,
        score: prestador.score,
      }
    );

    this.items.push(newPrestador);
    return newPrestador;
  }

  async delete(user_id: string): Promise<void> {
    const index = this.items.findIndex((u) => u.user_id === user_id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  async update(prestador: Prestador): Promise<void> {
    const index = this.items.findIndex((u) => u.user_id === prestador.user_id);

    if (index === -1) {
      return;
    }

    this.items[index] = prestador;
  }

  async findById(id: string): Promise<Prestador | null> {
    const prestador = this.items.find((u) => u.user_id === id || u.nome === id);
    return prestador || null;
  }

  async findByUserId(user_id: string): Promise<Prestador | null> {
    const prestador = this.items.find((u) => u.user_id === user_id);
    return prestador || null;
  }

  async listByCategory(categoria: string): Promise<Prestador[] | null> {
    const resultado = this.items.filter((u) => u.bio?.includes(categoria));
    return resultado.length > 0 ? resultado : null;
  }
}
