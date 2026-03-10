import { IAvaliacaoRepository } from '../../repositories/IAvaliacaoRepository'; 
import { Avaliacao } from '../../entities/Avaliacao';



export class ListarAvaliacaoServicoUseCase{
    constructor(private avaliacaoRepository: IAvaliacaoRepository){}


    async executar(id: string): Promise<Avaliacao[] | null> {
      const avaliacao = await this.avaliacaoRepository.listByServico(id);
      
      if (!avaliacao) {
      throw new Error('Nao existe avaliacao para esse servico');
    }

    return avaliacao;
  }
}
