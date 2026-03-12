import { Avaliacao } from '../../entities/Avaliacao';
import { IAvaliacaoRepository } from '../../repositories/IAvaliacaoRepository';


export class ListarAvaliacaoPrestadorUseCase{
    constructor(private avaliacaoRepository: IAvaliacaoRepository){}


    async executar(id: string): Promise<Avaliacao[] | null> {
      const avaliacao = await this.avaliacaoRepository.listByPrestador(id);
      
      if (!avaliacao) {
      throw new Error('Nao existe avaliacao para este prestador');
    }

    return avaliacao;
  }
}
