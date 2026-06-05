import { Request, Response } from 'express';
import {
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorServicoId,
  IniciarPagamentoUseCase,
  LiberarPagamentoUseCase,
  ReembolsarPagamentoUseCase,
  ProcessarWebhookAsaasUseCase,
} from '../../core/use-cases/financeiro/TransacaoUseCase';
import { AppError } from '../../core/errors/AppError';
import { logControllerError, logError } from '../../core/utils/httpLogger';

export class TransacaoController {
  constructor(
    private acharPorUserId: AcharPorUserId,
    private acharPorPrestadorId: AcharPorPrestadorId,
    private acharPorServicoId: AcharPorServicoId,
    private iniciarPagamento: IniciarPagamentoUseCase,
    private liberarPagamento: LiberarPagamentoUseCase,
    private reembolsarPagamento: ReembolsarPagamentoUseCase,
    private processarWebhook: ProcessarWebhookAsaasUseCase,
  ) {}

  async findByUserId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorUserId.executar(req.query.id as string);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('TransacaoController', 'findByUserId', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByPrestadorId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorPrestadorId.executar(req.query.id as string);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('TransacaoController', 'findByPrestadorId', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByServicoId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorServicoId.executar(req.query.id as string);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('TransacaoController', 'findByServicoId', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async iniciar(req: Request, res: Response) {
    try {
      const { servico_id, user_id, cpf, nome, email, valor, metodo_pagamento } = req.body;
      const resultado = await this.iniciarPagamento.executar({
        servico_id, user_id, cpf, nome, email, valor, metodo_pagamento,
      });
      return res.status(201).json(resultado);
    } catch (erro: any) {
      logControllerError('TransacaoController', 'iniciar', erro);
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }

  async liberar(req: Request, res: Response) {
    try {
      const { servico_id, prestador_id } = req.body;
      const resultado = await this.liberarPagamento.executar({ servico_id, prestador_id });
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('TransacaoController', 'liberar', erro);
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }

  async reembolsar(req: Request, res: Response) {
    try {
      const { servico_id } = req.body;
      const resultado = await this.reembolsarPagamento.executar({ servico_id });
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('TransacaoController', 'reembolsar', erro);
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }

  // Asaas calls this endpoint when a payment event occurs
  async webhook(req: Request, res: Response) {
    try {
      const { event, payment } = req.body;
      if (event && payment?.id) {
        await this.processarWebhook.executar(event, payment.id);
      }
      // Always respond 200 quickly so Asaas doesn't retry
      return res.sendStatus(200);
    } catch (erro: any) {
      logError('http.webhook.asaas', erro, { event: req.body?.event, paymentId: req.body?.payment?.id });
      return res.sendStatus(200); // still 200 — errors are logged, not retried
    }
  }
}
