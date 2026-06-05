import { Request, Response } from 'express';
import { CriarAvaliacaoUseCase, AtualizarAvaliacaoUseCase, DeletarAvaliacaoUseCase, ListarPorId } from '../../core/use-cases/avaliacao/AvaliacaoUseCase';
import { logControllerError } from '../../core/utils/httpLogger';

export class AvaliacaoController {
    constructor(
        private criarAvaliacao: CriarAvaliacaoUseCase,
        private atualizarAvaliacao: AtualizarAvaliacaoUseCase,
        private deletarAvaliacao: DeletarAvaliacaoUseCase,
        private listarPorId: ListarPorId,
  ) {}

  
  async create(req: Request, res: Response) {
      try {
      const resultado = await this.criarAvaliacao.executar(req.body);
      return res.status(200).json(resultado);
    } 
      catch (erro: any) {
      logControllerError('AvaliacaoController', 'create', erro);
      return res.status(400).json({erro: erro.message});
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const resultado = await this.deletarAvaliacao.executar(req.body.id);
      return res.status(200).json(resultado);

    } 
    catch (erro: any) {
      logControllerError('AvaliacaoController', 'delete', erro);
      return res.status(400).json({erro: erro.message});

    }
  }

  async update(req: Request, res: Response) {
    try{
      const resultado = await this.atualizarAvaliacao.executar(req.body.id, req.body.dados);
      return res.status(200).json(resultado);
    } 
    catch(erro: any){
      logControllerError('AvaliacaoController', 'update', erro);
      return res.status(400).json({erro: erro.message});
    }
  }


  async listByServico(req: Request, res: Response){
    try {
      const resultado = await this.listarPorId.executar(req.body.id, req.body.listBy);
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      logControllerError('AvaliacaoController', 'listByServico', erro);
      return res.status(400).json({erro: erro.message});
    }
  }

  async listByUser(req: Request, res: Response){
    try {
      const resultado = await this.listarPorId.executar(req.body.id, req.body.listBy);
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      logControllerError('AvaliacaoController', 'listByUser', erro);
      return res.status(400).json({erro: erro.message});
    }
  }

  async listByPrestador(req: Request, res: Response){
    try {
      const resultado = await this.listarPorId.executar(req.body.id, req.body.listBy);
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      logControllerError('AvaliacaoController', 'listByPrestador', erro);
      return res.status(400).json({erro: erro.message});
    }
  }
}

     
