import { Request, Response } from 'express';
import { CriarAvaliacaoDto } from '../../core/dtos/avaliacao';

import { CriarAvaliacaoUseCase, AtualizarAvaliacaoUseCase, DeletarAvaliacaoUseCase, ListarPorId } from '../../core/use-cases/avaliacao/AvaliacaoUseCase';

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
      return res.status(400).json({erro: erro.message});
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const resultado = await this.deletarAvaliacao.executar(req.body.id);
      return res.status(200).json(resultado);

    } 
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});

    }
  }

  async update(req: Request, res: Response) {
    try{
      const resultado = await this.atualizarAvaliacao.executar(req.body.id, req.body.dados);
      return res.status(200).json(resultado);
    } 
    catch(erro: any){
      return res.status(400).json({erro: erro.message});
    }
  }


  async listBy(req: Request, res: Response){
    try {
      const resultado = await this.listarPorId.executar(req.body.id, req.body.listBy);
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }
}

     
