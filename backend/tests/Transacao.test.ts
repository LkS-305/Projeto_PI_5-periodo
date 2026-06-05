import {
  IniciarPagamentoUseCase,
  LiberarPagamentoUseCase,
  ReembolsarPagamentoUseCase,
  ProcessarWebhookAsaasUseCase,
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorServicoId,
} from '../src/core/use-cases/financeiro/TransacaoUseCase';
import { ITransacaoRepository } from '../src/core/repositories/ITransacaoRepository';
import { ICarteiraRepository } from '../src/core/repositories/ICarteiraRepository';
import { AsaasProvider } from '../src/infra/providers/AsaasProvider';
import { Transacao } from '../src/core/entities/Transacao';
import { Carteira } from '../src/core/entities/Carteira';
import { AppError, ResourceNotFoundError, ValidationError } from '../src/core/errors/AppError';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const UUID_SERVICO   = '123e4567-e89b-12d3-a456-426614174000';
const UUID_PRESTADOR = '223e4567-e89b-12d3-a456-426614174001';
const UUID_USER      = '323e4567-e89b-12d3-a456-426614174002';

const TRANSACAO_PENDENTE = new Transacao({
  servico_id:       UUID_SERVICO,
  tipo:             'enviar',
  status:           'pendente',
  valor:            '150.00',
  metodo_pagamento: 'Pix',
  asaas_payment_id: 'pay_abc123',
});

const CARTEIRA_PRESTADOR = {
  user_id:          UUID_PRESTADOR,
  saldo:            '200.00',
  saldo_bloqueado:  '0.00',
  numero_cartao:    '1234',
  validade_cartao:  '12/28',
  nome_cartao:      'João',
  vcc_cartao:       '123',
  status:           'ativa' as const,
};

const ASAAS_COBRANCA = {
  asaas_payment_id: 'pay_abc123',
  invoiceUrl:       'https://sandbox.asaas.com/i/abc123',
  pixQrCodeImage:   'base64encodedimage==',
  pixCopyPaste:     '00020126580014br.gov.bcb.pix...',
};

// ─── Mock factories ───────────────────────────────────────────────────────────

function makeTransacaoRepo(
  overrides: Partial<Record<keyof ITransacaoRepository, jest.Mock>> = {},
): ITransacaoRepository {
  return {
    create:                      jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    delete:                      jest.fn().mockResolvedValue(undefined),
    update:                      jest.fn().mockImplementation((_id, patch) =>
      Promise.resolve({ ...TRANSACAO_PENDENTE, ...patch }),
    ),
    findByServicoId:             jest.fn().mockResolvedValue(null),
    findByUserId:                jest.fn().mockResolvedValue([]),
    findByPrestadorId:           jest.fn().mockResolvedValue([]),
    findByAsaasPaymentId:        jest.fn().mockResolvedValue(null),
    findPrestadorIdByServicoId:  jest.fn().mockResolvedValue(UUID_PRESTADOR),
    ...overrides,
  } as unknown as ITransacaoRepository;
}

function makeCarteiraRepo(
  overrides: Partial<Record<keyof ICarteiraRepository, jest.Mock>> = {},
): ICarteiraRepository {
  return {
    create:               jest.fn().mockResolvedValue(undefined),
    delete:               jest.fn().mockResolvedValue(undefined),
    updateBalance:        jest.fn().mockResolvedValue(undefined),
    updateBlockedBalance: jest.fn().mockResolvedValue(undefined),
    updatePaymentMethods: jest.fn().mockResolvedValue(undefined),
    updateStatus:         jest.fn().mockResolvedValue(undefined),
    findByUserId:         jest.fn().mockResolvedValue(null),
    findByPrestadorId:    jest.fn().mockResolvedValue(CARTEIRA_PRESTADOR),
    ...overrides,
  } as unknown as ICarteiraRepository;
}

function makeAsaasProvider(
  overrides: Partial<Record<keyof AsaasProvider, jest.Mock>> = {},
): AsaasProvider {
  return {
    criarOuBuscarCliente: jest.fn().mockResolvedValue('cus_xyz789'),
    criarCobrancaPix:     jest.fn().mockResolvedValue(ASAAS_COBRANCA),
    reembolsarCobranca:   jest.fn().mockResolvedValue(undefined),
    buscarStatus:         jest.fn().mockResolvedValue('PENDING'),
    ...overrides,
  } as unknown as AsaasProvider;
}

// ─── IniciarPagamentoUseCase ──────────────────────────────────────────────────

describe('IniciarPagamentoUseCase', () => {
  const dadosValidos = {
    servico_id:       UUID_SERVICO,
    user_id:          UUID_USER,
    cpf:              '12345678900',
    nome:             'João Silva',
    email:            'joao@email.com',
    valor:            '150.00',
    metodo_pagamento: 'Pix' as const,
  };

  it('deve criar cobrança Pix e retornar transação com QR code', async () => {
    const sut = new IniciarPagamentoUseCase(makeTransacaoRepo(), makeAsaasProvider());

    const resultado = await sut.executar(dadosValidos);

    expect(resultado.transacao).toBeDefined();
    expect(resultado.pix.qrCodeImage).toBe(ASAAS_COBRANCA.pixQrCodeImage);
    expect(resultado.pix.copyPaste).toBe(ASAAS_COBRANCA.pixCopyPaste);
    expect(resultado.pix.invoiceUrl).toBe(ASAAS_COBRANCA.invoiceUrl);
  });

  it('deve criar ou buscar o cliente Asaas com o CPF correto', async () => {
    const asaas = makeAsaasProvider();
    const sut = new IniciarPagamentoUseCase(makeTransacaoRepo(), asaas);

    await sut.executar(dadosValidos);

    expect(asaas.criarOuBuscarCliente).toHaveBeenCalledWith('12345678900', 'João Silva', 'joao@email.com');
  });

  it('deve chamar criarCobrancaPix com o valor numérico correto', async () => {
    const asaas = makeAsaasProvider();
    const sut = new IniciarPagamentoUseCase(makeTransacaoRepo(), asaas);

    await sut.executar(dadosValidos);

    expect(asaas.criarCobrancaPix).toHaveBeenCalledWith('cus_xyz789', 150, expect.any(String));
  });

  it('deve salvar o asaas_payment_id na transação criada', async () => {
    const transacaoRepo = makeTransacaoRepo();
    const sut = new IniciarPagamentoUseCase(transacaoRepo, makeAsaasProvider());

    await sut.executar(dadosValidos);

    const transacaoCriada = (transacaoRepo.create as jest.Mock).mock.calls[0][0] as Transacao;
    expect(transacaoCriada.asaas_payment_id).toBe('pay_abc123');
    expect(transacaoCriada.status).toBe('pendente');
  });

  it('deve lançar ValidationError para valor zero', async () => {
    const sut = new IniciarPagamentoUseCase(makeTransacaoRepo(), makeAsaasProvider());

    await expect(sut.executar({ ...dadosValidos, valor: '0' }))
      .rejects.toBeInstanceOf(ValidationError);
  });

  it('deve lançar ValidationError para valor negativo', async () => {
    const sut = new IniciarPagamentoUseCase(makeTransacaoRepo(), makeAsaasProvider());

    await expect(sut.executar({ ...dadosValidos, valor: '-50' }))
      .rejects.toBeInstanceOf(ValidationError);
  });

  it('deve lançar AppError 409 quando já existe transação pendente para o serviço', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const sut = new IniciarPagamentoUseCase(transacaoRepo, makeAsaasProvider());

    const erro = await sut.executar(dadosValidos).catch(e => e);

    expect(erro).toBeInstanceOf(AppError);
    expect(erro.statusCode).toBe(409);
  });

  it('não deve lançar erro quando transação existente já está aprovada', async () => {
    const transacaoAprovada = { ...TRANSACAO_PENDENTE, status: 'aprovada' as const };
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(transacaoAprovada),
    });
    const sut = new IniciarPagamentoUseCase(transacaoRepo, makeAsaasProvider());

    await expect(sut.executar(dadosValidos)).resolves.toBeDefined();
  });
});

// ─── LiberarPagamentoUseCase ──────────────────────────────────────────────────

describe('LiberarPagamentoUseCase', () => {
  it('deve creditar o saldo do prestador e atualizar status para aprovada', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const carteiraRepo = makeCarteiraRepo();
    const sut = new LiberarPagamentoUseCase(transacaoRepo, carteiraRepo);

    const resultado = await sut.executar({ servico_id: UUID_SERVICO, prestador_id: UUID_PRESTADOR });

    expect(resultado?.status).toBe('aprovada');
    expect(carteiraRepo.updateBalance).toHaveBeenCalledWith(
      UUID_PRESTADOR,
      '350.00', // 200.00 + 150.00
    );
  });

  it('deve calcular o novo saldo somando o valor da transação corretamente', async () => {
    const carteiraComSaldo = { ...CARTEIRA_PRESTADOR, saldo: '99.50' };
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue({ ...TRANSACAO_PENDENTE, valor: '50.50' }),
    });
    const carteiraRepo = makeCarteiraRepo({
      findByPrestadorId: jest.fn().mockResolvedValue(carteiraComSaldo),
    });
    const sut = new LiberarPagamentoUseCase(transacaoRepo, carteiraRepo);

    await sut.executar({ servico_id: UUID_SERVICO, prestador_id: UUID_PRESTADOR });

    expect(carteiraRepo.updateBalance).toHaveBeenCalledWith(UUID_PRESTADOR, '150.00');
  });

  it('deve lançar ResourceNotFoundError quando a transação não existe', async () => {
    const sut = new LiberarPagamentoUseCase(makeTransacaoRepo(), makeCarteiraRepo());

    await expect(
      sut.executar({ servico_id: UUID_SERVICO, prestador_id: UUID_PRESTADOR }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar AppError 409 quando a transação não está pendente', async () => {
    const transacaoAprovada = { ...TRANSACAO_PENDENTE, status: 'aprovada' as const };
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(transacaoAprovada),
    });
    const sut = new LiberarPagamentoUseCase(transacaoRepo, makeCarteiraRepo());

    const erro = await sut.executar({ servico_id: UUID_SERVICO, prestador_id: UUID_PRESTADOR }).catch(e => e);

    expect(erro).toBeInstanceOf(AppError);
    expect(erro.statusCode).toBe(409);
  });

  it('deve lançar ResourceNotFoundError quando carteira do prestador não existe', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const carteiraRepo = makeCarteiraRepo({
      findByPrestadorId: jest.fn().mockResolvedValue(null),
    });
    const sut = new LiberarPagamentoUseCase(transacaoRepo, carteiraRepo);

    await expect(
      sut.executar({ servico_id: UUID_SERVICO, prestador_id: UUID_PRESTADOR }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

// ─── ReembolsarPagamentoUseCase ───────────────────────────────────────────────

describe('ReembolsarPagamentoUseCase', () => {
  it('deve chamar Asaas e atualizar status para reembolsada', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const asaas = makeAsaasProvider();
    const sut = new ReembolsarPagamentoUseCase(transacaoRepo, asaas);

    const resultado = await sut.executar({ servico_id: UUID_SERVICO });

    expect(asaas.reembolsarCobranca).toHaveBeenCalledWith('pay_abc123');
    expect(resultado?.status).toBe('reembolsada');
  });

  it('deve lançar ResourceNotFoundError quando a transação não existe', async () => {
    const sut = new ReembolsarPagamentoUseCase(makeTransacaoRepo(), makeAsaasProvider());

    await expect(sut.executar({ servico_id: UUID_SERVICO }))
      .rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar AppError 409 quando a transação não está pendente', async () => {
    const transacaoAprovada = { ...TRANSACAO_PENDENTE, status: 'aprovada' as const };
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(transacaoAprovada),
    });
    const sut = new ReembolsarPagamentoUseCase(transacaoRepo, makeAsaasProvider());

    const erro = await sut.executar({ servico_id: UUID_SERVICO }).catch(e => e);

    expect(erro).toBeInstanceOf(AppError);
    expect(erro.statusCode).toBe(409);
  });

  it('deve lançar AppError 400 quando a transação não tem asaas_payment_id', async () => {
    const transacaoSemAsaas = { ...TRANSACAO_PENDENTE, asaas_payment_id: undefined };
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(transacaoSemAsaas),
    });
    const sut = new ReembolsarPagamentoUseCase(transacaoRepo, makeAsaasProvider());

    const erro = await sut.executar({ servico_id: UUID_SERVICO }).catch(e => e);

    expect(erro).toBeInstanceOf(AppError);
    expect(erro.statusCode).toBe(400);
  });
});

// ─── ProcessarWebhookAsaasUseCase ─────────────────────────────────────────────

describe('ProcessarWebhookAsaasUseCase', () => {
  it('PAYMENT_RECEIVED: deve creditar a carteira do prestador e aprovar a transação', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByAsaasPaymentId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const carteiraRepo = makeCarteiraRepo();
    const sut = new ProcessarWebhookAsaasUseCase(transacaoRepo, carteiraRepo);

    await sut.executar('PAYMENT_RECEIVED', 'pay_abc123');

    expect(carteiraRepo.updateBalance).toHaveBeenCalledWith(UUID_PRESTADOR, '350.00');
    expect(transacaoRepo.update).toHaveBeenCalledWith(
      TRANSACAO_PENDENTE.id,
      { status: 'aprovada' },
    );
  });

  it('PAYMENT_RECEIVED: deve buscar o prestador via servico_id', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByAsaasPaymentId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const sut = new ProcessarWebhookAsaasUseCase(transacaoRepo, makeCarteiraRepo());

    await sut.executar('PAYMENT_RECEIVED', 'pay_abc123');

    expect(transacaoRepo.findPrestadorIdByServicoId).toHaveBeenCalledWith(UUID_SERVICO);
  });

  it('PAYMENT_REFUNDED: deve atualizar status para reembolsada', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByAsaasPaymentId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const sut = new ProcessarWebhookAsaasUseCase(transacaoRepo, makeCarteiraRepo());

    await sut.executar('PAYMENT_REFUNDED', 'pay_abc123');

    expect(transacaoRepo.update).toHaveBeenCalledWith(
      TRANSACAO_PENDENTE.id,
      { status: 'reembolsada' },
    );
  });

  it('deve ignorar silenciosamente um payment id desconhecido', async () => {
    const transacaoRepo = makeTransacaoRepo();
    const carteiraRepo = makeCarteiraRepo();
    const sut = new ProcessarWebhookAsaasUseCase(transacaoRepo, carteiraRepo);

    await expect(sut.executar('PAYMENT_RECEIVED', 'pay_inexistente')).resolves.not.toThrow();
    expect(transacaoRepo.update).not.toHaveBeenCalled();
    expect(carteiraRepo.updateBalance).not.toHaveBeenCalled();
  });

  it('PAYMENT_RECEIVED: não deve processar transação já aprovada', async () => {
    const transacaoAprovada = { ...TRANSACAO_PENDENTE, status: 'aprovada' as const };
    const transacaoRepo = makeTransacaoRepo({
      findByAsaasPaymentId: jest.fn().mockResolvedValue(transacaoAprovada),
    });
    const carteiraRepo = makeCarteiraRepo();
    const sut = new ProcessarWebhookAsaasUseCase(transacaoRepo, carteiraRepo);

    await sut.executar('PAYMENT_RECEIVED', 'pay_abc123');

    expect(carteiraRepo.updateBalance).not.toHaveBeenCalled();
    expect(transacaoRepo.update).not.toHaveBeenCalled();
  });

  it('PAYMENT_REFUNDED: não deve processar transação já reembolsada', async () => {
    const transacaoReembolsada = { ...TRANSACAO_PENDENTE, status: 'reembolsada' as const };
    const transacaoRepo = makeTransacaoRepo({
      findByAsaasPaymentId: jest.fn().mockResolvedValue(transacaoReembolsada),
    });
    const sut = new ProcessarWebhookAsaasUseCase(transacaoRepo, makeCarteiraRepo());

    await sut.executar('PAYMENT_REFUNDED', 'pay_abc123');

    expect(transacaoRepo.update).not.toHaveBeenCalled();
  });

  it('deve ignorar eventos desconhecidos sem lançar erro', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByAsaasPaymentId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const sut = new ProcessarWebhookAsaasUseCase(transacaoRepo, makeCarteiraRepo());

    await expect(sut.executar('PAYMENT_OVERDUE', 'pay_abc123')).resolves.not.toThrow();
    expect(transacaoRepo.update).not.toHaveBeenCalled();
  });
});

// ─── Read-only use-cases ──────────────────────────────────────────────────────

describe('AcharPorServicoId', () => {
  it('deve retornar a transação quando encontrada', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByServicoId: jest.fn().mockResolvedValue(TRANSACAO_PENDENTE),
    });
    const resultado = await new AcharPorServicoId(transacaoRepo).executar(UUID_SERVICO);
    expect(resultado).toEqual(TRANSACAO_PENDENTE);
  });

  it('deve lançar erro quando não encontrada', async () => {
    await expect(new AcharPorServicoId(makeTransacaoRepo()).executar(UUID_SERVICO))
      .rejects.toThrow();
  });
});

describe('AcharPorUserId', () => {
  it('deve retornar as transações do usuário', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByUserId: jest.fn().mockResolvedValue([TRANSACAO_PENDENTE]),
    });
    const resultado = await new AcharPorUserId(transacaoRepo).executar(UUID_USER);
    expect(resultado).toHaveLength(1);
  });
});

describe('AcharPorPrestadorId', () => {
  it('deve retornar as transações do prestador', async () => {
    const transacaoRepo = makeTransacaoRepo({
      findByPrestadorId: jest.fn().mockResolvedValue([TRANSACAO_PENDENTE]),
    });
    const resultado = await new AcharPorPrestadorId(transacaoRepo).executar(UUID_PRESTADOR);
    expect(resultado).toHaveLength(1);
  });
});
