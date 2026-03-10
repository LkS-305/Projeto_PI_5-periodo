import { Avaliacao } from '../../entities/Avaliacao';
import { IAvaliacaoRepository } from '../../repositories/IAvaliacaoRepository';


export class ListarAvaliacaoUsuarioUseCase{
    constructor(private avaliacaoRepository: IAvaliacaoRepository){}


    async executar(id: string): Promise<Avaliacao[] | null> {
      const avaliacao = await this.avaliacaoRepository.listByUsuario(id);
      
      if (!avaliacao) {
      throw new Error('Nao existe avaliacao deste usuario');
    }

    return avaliacao;
  }
}
