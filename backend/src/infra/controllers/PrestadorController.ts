import { Request, Response } from "express";
import {
  CriarPrestadorUseCase,
  DeletarPrestadorUseCase,
  AtualizarPrestadorUseCase,
  AcharPorUserId,
} from "../../core/use-cases/prestador/PrestadorUseCase";
import { logControllerError } from "../../core/utils/httpLogger";
import { AppError } from "../../core/errors/AppError";

export class PrestadorController {
  constructor(
    private criarPrestador: CriarPrestadorUseCase,
    private deletarPrestador: DeletarPrestadorUseCase,
    private atualizarPrestador: AtualizarPrestadorUseCase,
    private acharPorUserId: AcharPorUserId,
  ) {}

  async criar(req: Request, res: Response) {
    try {
      if (!req.user) {
      return res.status(401).json({ erro: "User não identificado no jwt." });
    }

      const { id } = req.user
      const resultado = await this.criarPrestador.executar({user_id: id, nome: req.body.nome, bio: req.body.bio, foto_url: req.body.foto_url});
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('PrestadorController', 'criar', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      if (!req.user) {
      return res.status(401).json({ erro: "User não identificado no jwt." });
    }

      const { id } = req.user
      if (id != req.body.user_id) {
        return res.status(402).json({erro: "User tentando deletar outro user_id"});
      }

      const resultado = await this.deletarPrestador.executar(req.body.user_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('PrestadorController', 'deletar', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      if (!req.user) {
      return res.status(401).json({ erro: "User não identificado no jwt." });
    }
      const {id} = req.user;
      const resultado = await this.atualizarPrestador.executar({user_id: id, nome: req.body.nome, bio: req.body.bio, foto_url: req.body.foto_url});
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('PrestadorController', 'atualizar', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      if(!req.body.user_id) {
        throw new Error('Id necessario no body');
      }
      const resultado = await this.acharPorUserId.executar(req.body.user_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('PrestadorController', 'findByUserId', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  /** Perfil público para vitrine (sem JWT). */
  async findPublicByUserId(req: Request, res: Response) {
    try {
      const user_id = req.params.user_id as string;
      if (!user_id?.trim()) {
        throw new Error("Id necessário");
      }
      const resultado = await this.acharPorUserId.executar(user_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError("PrestadorController", "findPublicByUserId", erro);
      const status = erro instanceof AppError ? erro.statusCode : 400;
      return res.status(status).json({ erro: erro.message });
    }
  }
}
