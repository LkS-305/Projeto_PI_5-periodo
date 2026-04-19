import { Request, Response } from "express";
import {
  CriarPrestadorUseCase,
  DeletarPrestadorUseCase,
  AtualizarPrestadorUseCase,
  AcharPorUserId,
} from "../../core/use-cases/prestador/PrestadorUseCase";

export class PrestadorController {
  constructor(
    private criarPrestador: CriarPrestadorUseCase,
    private deletarPrestador: DeletarPrestadorUseCase,
    private atualizarPrestador: AtualizarPrestadorUseCase,
    private acharPorUserId: AcharPorUserId,
  ) {}

  async criar(req: Request, res: Response) {
    try {
      const resultado = await this.criarPrestador.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const resultado = await this.deletarPrestador.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarPrestador.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorUserId.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }
}
