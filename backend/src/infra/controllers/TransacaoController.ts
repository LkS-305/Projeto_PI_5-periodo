import { Request, Response } from 'express';
import {
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorServicoId,
  IniciarPagamentoUseCase,
  LiberarPagamentoUseCase,
  ReembolsarPagamentoUseCase,
} from '../../core/use-cases/financeiro/TransacaoUseCase';
import { AppError } from '../../core/errors/AppError';

export class TransacaoController {
  constructor(
    private acharPorUserId: AcharPorUserId,
    private acharPorPrestadorId: AcharPorPrestadorId,
    private acharPorServicoId: AcharPorServicoId,
    private iniciarPagamento: IniciarPagamentoUseCase,
    private liberarPagamento: LiberarPagamentoUseCase,
    private reembolsarPagamento: ReembolsarPagamentoUseCase,
  ) {}

  async findByUserId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorUserId.executar(req.query.id as string);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByPrestadorId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorPrestadorId.executar(req.query.id as string);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByServicoId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorServicoId.executar(req.query.id as string);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async iniciar(req: Request, res: Response) {
    try {
      const { servico_id, user_id, valor, metodo_pagamento } = req.body;
      const resultado = await this.iniciarPagamento.executar({ servico_id, user_id, valor, metodo_pagamento });
      return res.status(201).json(resultado);
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }

  async liberar(req: Request, res: Response) {
    try {
      const { servico_id, user_id, prestador_id } = req.body;
      const resultado = await this.liberarPagamento.executar({ servico_id, user_id, prestador_id });
      return res.status(200).json(resultado);
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }

  async reembolsar(req: Request, res: Response) {
    try {
      const { servico_id, user_id } = req.body;
      const resultado = await this.reembolsarPagamento.executar({ servico_id, user_id });
      return res.status(200).json(resultado);
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }
}
