import { Avaliacao } from '../../entities/Avaliacao';
import { IAvaliacaoRepository } from '../../repositories/IAvaliacaoRepository';
import { AvaliarUPRequest } from '../../dtos/avaliacao';


export class AvaliarPrestadorUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository){}
  
     
  async executar(dados: AvaliarUPRequest): Promise<boolean> {
           

    const avaliacao = await this.avaliacaoRepository.avaliarPrestador(dados.usuario_id, dados.prestador_id, dados.nota, dados.comentario, dados.media);

     if (!avaliacao) {
      throw new Error('Nao existe usuario com este id');
    }

    return true;

 

  }

}
