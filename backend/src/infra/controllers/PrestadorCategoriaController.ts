import { Request, Response } from 'express';
import {
  AdicionarCategoriaUseCase,
  RemoverCategoriaUseCase,
  ListarCategoriasDoPrestadorUseCase,
  ListarPrestadoresPorCategoriaUseCase,
} from '../../core/use-cases/prestador/PrestadorCategoriaUseCase';
import { AppError } from '../../core/errors/AppError';

export class PrestadorCategoriaController {
  constructor(
    private adicionarCategoria: AdicionarCategoriaUseCase,
    private removerCategoria: RemoverCategoriaUseCase,
    private listarCategoriasDoPrestador: ListarCategoriasDoPrestadorUseCase,
    private listarPrestadoresPorCategoria: ListarPrestadoresPorCategoriaUseCase,
  ) {}

  async adicionar(req: Request, res: Response) {
    try {
      const { prestador_id, categoria_id } = req.body;
      await this.adicionarCategoria.executar(prestador_id, categoria_id);
      return res.status(201).json({ mensagem: 'Categoria adicionada ao prestador com sucesso' });
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const { prestador_id, categoria_id } = req.body;
      await this.removerCategoria.executar(prestador_id, categoria_id);
      return res.status(200).json({ mensagem: 'Categoria removida do prestador com sucesso' });
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }

  async listarCategorias(req: Request, res: Response) {
    try {
      const prestador_id = req.query.prestador_id as string;
      const resultado = await this.listarCategoriasDoPrestador.executar(prestador_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }

  async listarPrestadores(req: Request, res: Response) {
    try {
      const categoria_id = req.query.categoria_id as string;
      const resultado = await this.listarPrestadoresPorCategoria.executar(categoria_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }
}
