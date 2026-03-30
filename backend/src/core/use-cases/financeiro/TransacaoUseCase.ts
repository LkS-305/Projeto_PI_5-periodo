import { ITransacaoRepository } from '../../repositories/ITransacaoRepository';
import { Transacao } from '../../entities/Transacao';



export class CriarTransacaoUseCase {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(dados: Transacao) {
    const transacao = new Transacao(dados);
    
    const transacaoCriado = await this.transacaoRepository.create(transacao);

    if(!transacaoCriado){
      throw new Error('Falha ao criar transacao');
    }

    return transacaoCriado;
  }
}

export class DeletarTransacaoUseCase {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(id: string) {
    await this.transacaoRepository.delete(id);
  }
}


export class AtualizarTransacaoUseCase {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(id: string, transacao: Partial<Transacao>) {
    const transacaoExistente = await this.transacaoRepository.update(id, transacao);

    if(!transacaoExistente){
      throw new Error('transacao nao existente');
    }

    Object.assign(transacaoExistente, transacao);
    await this.transacaoRepository.update(id, transacao);

    return transacaoExistente;
  }
}

export class AcharPorServicoId {
  constructor(private transacaoRepository: ITransacaoRepository){}

  async executar(id: string) {
    const transacao = await this.transacaoRepository.findByServicoId(id);

    if (!transacao) {
      throw new Error('erro ao achar transacao por servico id');
    }

    return transacao;
  }
}


export class AcharPorUserId {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(id: string) {
    const transacao = await this.transacaoRepository.findByUserId(id);
    
    if (!transacao) {
      throw new Error('erro ao procurar transacao por user id');
    }    

    return transacao;

  }
}


export class AcharPorPrestadorId {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(id: string) {
    const transacao = await this.transacaoRepository.findByPrestadorId(id);
    
    if (!transacao) {
      throw new Error('erro ao procurar agedamento por prestador id');
    }    

    return transacao;

  }
}
