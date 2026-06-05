import { Request, Response } from 'express';
import {
  CriarServicoUseCase,
  ListarServicosUseCase,
  PesquisarServicoId,
  PesquisarServicoUserId,
  PesquisarServicoPrestadorId,
  AtualizarStatusUseCase,
  AtualizarServicoUseCase,
} from '../../core/use-cases/servico/ServicoUseCase';
import { logControllerError } from '../../core/utils/httpLogger';

export class ServicoController {
  constructor(
    private criarServicoUseCase: CriarServicoUseCase,
    private listarServicosUseCase: ListarServicosUseCase,
    private pesquisarServicoId: PesquisarServicoId,
    private pesquisarServicoUserId: PesquisarServicoUserId,
    private pesquisarServicoPrestadorId: PesquisarServicoPrestadorId,
    private atualizarStatusServico: AtualizarStatusUseCase,
    private atualizarServico: AtualizarServicoUseCase,
  ) {}

  async listAll(req: Request, res: Response) {
    try {
      const resultado = await this.listarServicosUseCase.executar();
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ServicoController', 'listAll', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async stats(req: Request, res: Response) {
    try {
      const resultado = await this.listarServicosUseCase.stats();
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ServicoController', 'stats', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const resultado = await this.criarServicoUseCase.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ServicoController', 'create', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.query as { id: string };
      const resultado = await this.pesquisarServicoId.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ServicoController', 'findById', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const { id } = req.query as { id: string };
      const resultado = await this.pesquisarServicoUserId.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ServicoController', 'findByUserId', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByPrestadorId(req: Request, res: Response) {
    try {
      const { id } = req.query as { id: string };
      const resultado = await this.pesquisarServicoPrestadorId.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ServicoController', 'findByPrestadorId', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarStatusServico.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ServicoController', 'updateStatus', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async updateServico(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarServico.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ServicoController', 'updateServico', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }
}
