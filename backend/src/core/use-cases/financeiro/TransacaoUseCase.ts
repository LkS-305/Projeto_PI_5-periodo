import { ITransacaoRepository } from '../../repositories/ITransacaoRepository';
import { ICarteiraRepository } from '../../repositories/ICarteiraRepository';
import { Transacao } from '../../entities/Transacao';
import { MetodosPagamento } from '../../dtos/transacao';
import { AppError, ResourceNotFoundError, ValidationError } from '../../errors/AppError';



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

export class IniciarPagamentoUseCase {
  constructor(
    private transacaoRepository: ITransacaoRepository,
    private carteiraRepository: ICarteiraRepository,
  ) {}

  async executar(dados: {
    servico_id: string;
    user_id: string;
    valor: string;
    metodo_pagamento: MetodosPagamento;
  }) {
    const carteira = await this.carteiraRepository.findByUserId(dados.user_id);
    if (!carteira) throw new ResourceNotFoundError('Carteira do usuário');

    const saldoAtual = parseFloat(carteira.saldo);
    const saldoBloqueado = parseFloat(carteira.saldo_bloqueado ?? '0');
    const valorTransacao = parseFloat(dados.valor);

    if (isNaN(valorTransacao) || valorTransacao <= 0) {
      throw new ValidationError('Valor da transação inválido');
    }
    if (saldoAtual < valorTransacao) {
      throw new AppError('Saldo insuficiente', 402);
    }

    await this.carteiraRepository.updateBalance(
      dados.user_id,
      (saldoAtual - valorTransacao).toFixed(2),
    );
    await this.carteiraRepository.updateBlockedBalance(
      dados.user_id,
      (saldoBloqueado + valorTransacao).toFixed(2),
    );

    const transacao = new Transacao({
      servico_id: dados.servico_id,
      tipo: 'enviar',
      status: 'pendente',
      valor: dados.valor,
      metodo_pagamento: dados.metodo_pagamento,
    });

    return await this.transacaoRepository.create(transacao);
  }
}

export class LiberarPagamentoUseCase {
  constructor(
    private transacaoRepository: ITransacaoRepository,
    private carteiraRepository: ICarteiraRepository,
  ) {}

  async executar(dados: {
    servico_id: string;
    user_id: string;
    prestador_id: string;
  }) {
    const transacao = await this.transacaoRepository.findByServicoId(dados.servico_id);
    if (!transacao) throw new ResourceNotFoundError('Transação');
    if (transacao.status !== 'pendente') {
      throw new AppError('Apenas transações pendentes podem ser liberadas', 409);
    }

    const carteiraCliente = await this.carteiraRepository.findByUserId(dados.user_id);
    if (!carteiraCliente) throw new ResourceNotFoundError('Carteira do usuário');

    const carteiraPresatdor = await this.carteiraRepository.findByPrestadorId(dados.prestador_id);
    if (!carteiraPresatdor) throw new ResourceNotFoundError('Carteira do prestador');

    const valor = parseFloat(transacao.valor);
    const saldoBloqueadoCliente = parseFloat(carteiraCliente.saldo_bloqueado ?? '0');
    const saldoPrestador = parseFloat(carteiraPresatdor.saldo);

    await this.carteiraRepository.updateBlockedBalance(
      dados.user_id,
      (saldoBloqueadoCliente - valor).toFixed(2),
    );
    await this.carteiraRepository.updateBalance(
      dados.prestador_id,
      (saldoPrestador + valor).toFixed(2),
    );

    return await this.transacaoRepository.update(transacao.id, { status: 'aprovada' });
  }
}

export class ReembolsarPagamentoUseCase {
  constructor(
    private transacaoRepository: ITransacaoRepository,
    private carteiraRepository: ICarteiraRepository,
  ) {}

  async executar(dados: { servico_id: string; user_id: string }) {
    const transacao = await this.transacaoRepository.findByServicoId(dados.servico_id);
    if (!transacao) throw new ResourceNotFoundError('Transação');
    if (transacao.status !== 'pendente') {
      throw new AppError('Apenas transações pendentes podem ser reembolsadas', 409);
    }

    const carteira = await this.carteiraRepository.findByUserId(dados.user_id);
    if (!carteira) throw new ResourceNotFoundError('Carteira do usuário');

    const valor = parseFloat(transacao.valor);
    const saldoAtual = parseFloat(carteira.saldo);
    const saldoBloqueado = parseFloat(carteira.saldo_bloqueado ?? '0');

    await this.carteiraRepository.updateBlockedBalance(
      dados.user_id,
      (saldoBloqueado - valor).toFixed(2),
    );
    await this.carteiraRepository.updateBalance(
      dados.user_id,
      (saldoAtual + valor).toFixed(2),
    );

    return await this.transacaoRepository.update(transacao.id, { status: 'reembolsada' });
  }
}
