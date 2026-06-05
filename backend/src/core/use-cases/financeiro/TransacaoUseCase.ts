import { ITransacaoRepository } from '../../repositories/ITransacaoRepository';
import { ICarteiraRepository } from '../../repositories/ICarteiraRepository';
import { Transacao } from '../../entities/Transacao';
import { MetodosPagamento } from '../../dtos/transacao';
import { AppError, ResourceNotFoundError, ValidationError } from '../../errors/AppError';
import { AsaasProvider } from '../../../infra/providers/AsaasProvider';

// ─── Read-only use-cases (unchanged) ─────────────────────────────────────────

export class CriarTransacaoUseCase {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(dados: Transacao) {
    const transacao = new Transacao(dados);
    const transacaoCriado = await this.transacaoRepository.create(transacao);
    if (!transacaoCriado) throw new Error('Falha ao criar transacao');
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
    if (!transacaoExistente) throw new Error('transacao nao existente');
    return transacaoExistente;
  }
}

export class AcharPorServicoId {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(id: string) {
    const transacao = await this.transacaoRepository.findByServicoId(id);
    if (!transacao) throw new Error('erro ao achar transacao por servico id');
    return transacao;
  }
}

export class AcharPorUserId {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(id: string) {
    const transacao = await this.transacaoRepository.findByUserId(id);
    if (!transacao) throw new Error('erro ao procurar transacao por user id');
    return transacao;
  }
}

export class AcharPorPrestadorId {
  constructor(private transacaoRepository: ITransacaoRepository) {}

  async executar(id: string) {
    const transacao = await this.transacaoRepository.findByPrestadorId(id);
    if (!transacao) throw new Error('erro ao procurar agedamento por prestador id');
    return transacao;
  }
}

// ─── Asaas payment use-cases ─────────────────────────────────────────────────

export class IniciarPagamentoUseCase {
  constructor(
    private transacaoRepository: ITransacaoRepository,
    private asaasProvider: AsaasProvider,
  ) {}

  async executar(dados: {
    servico_id: string;
    user_id: string;
    cpf: string;
    nome: string;
    email: string;
    valor: string;
    metodo_pagamento: MetodosPagamento;
  }) {
    const valor = parseFloat(dados.valor);
    if (isNaN(valor) || valor <= 0) throw new ValidationError('Valor da transação inválido');

    // Ensure no duplicate pending transaction for the same service
    const existente = await this.transacaoRepository.findByServicoId(dados.servico_id);
    if (existente && existente.status === 'pendente') {
      throw new AppError('Já existe uma transação pendente para este serviço', 409);
    }

    // Get or create Asaas customer for the payer
    const customerId = await this.asaasProvider.criarOuBuscarCliente(
      dados.cpf,
      dados.nome,
      dados.email,
    );

    // Create Asaas charge and get Pix QR code
    const cobranca = await this.asaasProvider.criarCobrancaPix(
      customerId,
      valor,
      `Pagamento pelo serviço ${dados.servico_id}`,
    );

    // Record the transaction internally
    const transacao = new Transacao({
      servico_id:       dados.servico_id,
      tipo:             'enviar',
      status:           'pendente',
      valor:            dados.valor,
      metodo_pagamento: dados.metodo_pagamento,
      asaas_payment_id: cobranca.asaas_payment_id,
    });

    const transacaoCriada = await this.transacaoRepository.create(transacao);

    return {
      transacao: transacaoCriada,
      pix: {
        qrCodeImage: cobranca.pixQrCodeImage,
        copyPaste:   cobranca.pixCopyPaste,
        invoiceUrl:  cobranca.invoiceUrl,
      },
    };
  }
}

// Called by the webhook when PAYMENT_RECEIVED — credits prestador wallet
export class LiberarPagamentoUseCase {
  constructor(
    private transacaoRepository: ITransacaoRepository,
    private carteiraRepository: ICarteiraRepository,
  ) {}

  async executar(dados: { servico_id: string; prestador_id: string }) {
    const transacao = await this.transacaoRepository.findByServicoId(dados.servico_id);
    if (!transacao) throw new ResourceNotFoundError('Transação');
    if (transacao.status !== 'pendente') {
      throw new AppError('Apenas transações pendentes podem ser liberadas', 409);
    }

    const carteiraPrestador = await this.carteiraRepository.findByPrestadorId(dados.prestador_id);
    if (!carteiraPrestador) throw new ResourceNotFoundError('Carteira do prestador');

    const novoSaldo = (
      parseFloat(carteiraPrestador.saldo) + parseFloat(transacao.valor)
    ).toFixed(2);

    await this.carteiraRepository.updateBalance(dados.prestador_id, novoSaldo);
    return await this.transacaoRepository.update(transacao.id, { status: 'aprovada' });
  }
}

// Calls Asaas refund API then updates status
export class ReembolsarPagamentoUseCase {
  constructor(
    private transacaoRepository: ITransacaoRepository,
    private asaasProvider: AsaasProvider,
  ) {}

  async executar(dados: { servico_id: string }) {
    const transacao = await this.transacaoRepository.findByServicoId(dados.servico_id);
    if (!transacao) throw new ResourceNotFoundError('Transação');
    if (transacao.status !== 'pendente') {
      throw new AppError('Apenas transações pendentes podem ser reembolsadas', 409);
    }
    if (!transacao.asaas_payment_id) {
      throw new AppError('Esta transação não possui cobrança Asaas associada', 400);
    }

    await this.asaasProvider.reembolsarCobranca(transacao.asaas_payment_id);
    return await this.transacaoRepository.update(transacao.id, { status: 'reembolsada' });
  }
}

// Handles Asaas webhook events
export class ProcessarWebhookAsaasUseCase {
  constructor(
    private transacaoRepository: ITransacaoRepository,
    private carteiraRepository: ICarteiraRepository,
  ) {}

  async executar(evento: string, asaasPaymentId: string): Promise<void> {
    const transacao = await this.transacaoRepository.findByAsaasPaymentId(asaasPaymentId);
    if (!transacao) return; // not our payment, ignore

    if (evento === 'PAYMENT_RECEIVED' && transacao.status === 'pendente') {
      // Look up the prestador via the servico relationship
      const prestador_id = await this.transacaoRepository.findPrestadorIdByServicoId(transacao.servico_id);
      if (prestador_id) {
        const carteira = await this.carteiraRepository.findByPrestadorId(prestador_id);
        if (carteira) {
          const novoSaldo = (
            parseFloat(carteira.saldo) + parseFloat(transacao.valor)
          ).toFixed(2);
          await this.carteiraRepository.updateBalance(prestador_id, novoSaldo);
        }
      }
      await this.transacaoRepository.update(transacao.id, { status: 'aprovada' });
    }

    if (evento === 'PAYMENT_REFUNDED' && transacao.status !== 'reembolsada') {
      await this.transacaoRepository.update(transacao.id, { status: 'reembolsada' });
    }
  }
}
