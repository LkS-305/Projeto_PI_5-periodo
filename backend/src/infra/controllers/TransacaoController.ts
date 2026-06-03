import { Request, Response } from 'express';
import {
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorServicoId,
} from '../../core/use-cases/financeiro/TransacaoUseCase';

export class TransacaoController {
  constructor(
    private acharPorUserId: AcharPorUserId,
    private acharPorPrestadorId: AcharPorPrestadorId,
    private acharPorServicoId: AcharPorServicoId,
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
}
