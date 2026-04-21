import { IPrestadorRepository } from '../../src/core/repositories/IPrestadorRepository';
import { Prestador } from '../../src/core/entities/Prestador';
import { AtualizarPrestadorDto, CriarPrestadorDto } from '../../src/core/dtos/prestador';

export class InMemoryPrestadorRepository implements IPrestadorRepository {
  public items: Prestador[] = [];

  async create(dados: CriarPrestadorDto): Promise<Prestador> {
    const prestador = new Prestador(dados);
    this.items.push(prestador);
    return prestador;
  }

  async delete(user_id: string): Promise<void> {
    const index = this.items.findIndex(p => p.user_id === user_id);
    if (index !== -1) this.items.splice(index, 1);
  }

  async update(novoPrestador: AtualizarPrestadorDto): Promise<void> {
    const index = this.items.findIndex(p => p.user_id === novoPrestador.user_id);
    if (index !== -1) {
      this.items[index].atualizarPerfil(novoPrestador);
    }
  }

  async findByUserId(user_id: string): Promise<Prestador | null> {
    return this.items.find(p => p.user_id === user_id) || null;
  }
}
