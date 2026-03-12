import { Avaliacao } from '../../entities/Avaliacao';
import { IAvaliacaoRepository } from '../../repositories/IAvaliacaoRepository';
import { AvaliarServicoRequest } from '../../dtos/avaliacao';


export class AvaliarServicoUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository){}
  
    
  async executar(dados: AvaliarServicoRequest): Promise<boolean> {
        

    const avaliacao = await this.avaliacaoRepository.avaliarServico(dados.servico_id, dados.nota, dados.usuario_id, dados.prestador_id, dados.media, dados.comentario);

     if (!avaliacao) {
      throw new Error('Nao existe usuario com este id');
    }

    return true;

  }

}
