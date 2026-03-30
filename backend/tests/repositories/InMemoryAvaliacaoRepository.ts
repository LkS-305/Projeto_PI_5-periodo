import { IAvaliacaoRepository } from '../../src/core/repositories/IAvaliacaoRepository';
import { Avaliacao } from '../../src/core/entities/Avaliacao';
import { CriarAvaliacaoDto, ListBy } from '../../src/core/dtos/avaliacao';


export class InMemoryAvaliacaoRepository implements IAvaliacaoRepository {
  public items: Avaliacao[] = [];


  async create(avaliacao: CriarAvaliacaoDto): Promise<Avaliacao | null>{
    const newAvaliacao = {...avaliacao, id: `uuid-fake-${Math.random()}`};
    this.items.push(newAvaliacao);
    return newAvaliacao;
  }

  async delete(id: string): Promise<void>{
    const index = this.items.findIndex(u => u.id === id);
    this.items.splice(index,1);
  }

  async update(id: string, avaliacao: Partial<CriarAvaliacaoDto>): Promise<Avaliacao | null>{
    const index = this.items.findIndex(item => item.id === id);

    // 2. Se não encontrar, retorna null (simulando o banco)
    if (index === -1) {
        return null;
    }

    // 3. Atualiza o item mantendo o ID original e sobrepondo os novos dados
    const avaliacaoAtualizada = {
        ...this.items[index], // Dados antigos
        ...avaliacao,             // Dados novos (sobrepõe os antigos)
        id: id                // Garante que o ID não mude
    };

    // 4. Salva no array na mesma posição
    this.items[index] = avaliacaoAtualizada;

    return avaliacaoAtualizada;
  }


  async listBy(id: string, listBy: ListBy): Promise<Avaliacao[] | null>{
    if (listBy == 'usuario') {
      const resultado = this.items.filter(u => u.usuario_id === id);
      return resultado.length > 0 ? resultado : null;
    }
    else if (listBy = 'prestador') {
      const resultado = this.items.filter(u => u.prestador_id === id);
      return resultado.length > 0 ? resultado : null;
    }
    else if (listBy = 'servico') {
      const resultado = this.items.filter(u => u.servico_id === id);
      return resultado.length > 0 ? resultado : null;
    }
    else if (listBy = 'avaliacao') {
      const resultado = this.items.filter(u => u.id === id);
      return resultado.length > 0 ? resultado : null;
    }

    return null;
   
  }

}
