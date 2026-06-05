import { Request, Response } from 'express';
import fs from 'fs';
import {
  AdicionarItemPortfolioUseCase,
  DeletarItemPortfolioUseCase,
  ListarPortfolioPorPrestadorUseCase,
  ReordenarPortfolioUseCase,
} from '../../core/use-cases/portfolio/PortfolioUseCase';
import { AppError } from '../../core/errors/AppError';
import { logControllerError } from '../../core/utils/httpLogger';

export class PortfolioController {
  constructor(
    private adicionarItem: AdicionarItemPortfolioUseCase,
    private deletarItem: DeletarItemPortfolioUseCase,
    private listarPorPrestador: ListarPortfolioPorPrestadorUseCase,
    private reordenar: ReordenarPortfolioUseCase,
  ) {}

  async upload(req: Request, res: Response) {
    const file = req.file;
    try {
      if (!file) {
        return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
      }

      const prestador_id = req.body.prestador_id as string;
      const descricao = req.body.descricao as string | undefined;
      const tipo = file.mimetype.startsWith('video/') ? 'video' : 'imagem';
      const url = `/uploads/portfolio/${file.filename}`;

      const resultado = await this.adicionarItem.executar({ prestador_id, url, tipo, descricao });
      return res.status(201).json(resultado);
    } catch (erro: any) {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      const status = erro instanceof AppError ? erro.statusCode : 400;
      logControllerError('PortfolioController', 'upload', erro, { httpStatus: status });
      return res.status(status).json({ erro: erro.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const prestador_id = req.body.prestador_id as string;

      const url = await this.deletarItem.executar(id, prestador_id);

      const filePath = `uploads${url}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      return res.status(200).json({ mensagem: 'Item removido do portfólio.' });
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      logControllerError('PortfolioController', 'delete', erro, { httpStatus: status });
      return res.status(status).json({ erro: erro.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const prestador_id = req.query.prestador_id as string;
      const resultado = await this.listarPorPrestador.executar(prestador_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('PortfolioController', 'listar', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async reordenarItens(req: Request, res: Response) {
    try {
      const { prestador_id, items } = req.body;
      await this.reordenar.executar(prestador_id, items);
      return res.status(200).json({ mensagem: 'Portfólio reordenado com sucesso.' });
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      logControllerError('PortfolioController', 'reordenarItens', erro, { httpStatus: status });
      return res.status(status).json({ erro: erro.message });
    }
  }
}
