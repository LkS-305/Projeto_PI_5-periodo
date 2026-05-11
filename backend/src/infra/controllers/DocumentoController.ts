import { Request, Response } from "express";

import {
  CriarDocumentoUseCase,
  DeletarDocumentoUseCase,
  AtualizarDocumentoUseCase,
  AcharPorUserId,
  AtualizarStatus,
} from "../../core/use-cases/documento/DocumentoUseCase";

import { CriarDocumentoDto, AtualizarDocumentoDto } from "../../core/dtos/documento";
import { Documento } from "../../core/entities/Documento";

export class DocumentoController {
  constructor(
    private criarDocumento: CriarDocumentoUseCase,
    private deletarDocumento: DeletarDocumentoUseCase,
    private atualizarDocumento: AtualizarDocumentoUseCase,
    private acharPorUserId: AcharPorUserId,
    private atualizarStatus: AtualizarStatus,
  ) {}

  async criar(req: Request, res: Response) {
    try {
      const resultado = await this.criarDocumento.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const resultado = await this.deletarDocumento.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarDocumento.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const resultado = await this.acharPorUserId.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarStatus.executar(req.body.id, req.body.status);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }
}
