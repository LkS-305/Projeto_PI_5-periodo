import { Request, Response } from 'express';
import { CriarServicoUseCase,  PesquisarServicoId, PesquisarServicoUserId, PesquisarServicoPrestadorId, UpdateStatusUseCase } from '../../core/use-cases/servico/ServicoUseCase';


export class ServicoController {
  constructor(
    private criarServicoUseCase: CriarServicoUseCase,
    private pesquisarServicoId: PesquisarServicoId,
    private pesquisarServicoUserId: PesquisarServicoUserId,
    private pesquisarServicoPrestadorId: PesquisarServicoPrestadorId,
    private updateStatusServico: UpdateStatusUseCase

  ){} 


  async create(req: Request, res: Response) {
      try {
      const resultado = await this.criarServicoUseCase.executar(req.body);
      return res.status(200).json(resultado);
    } 
      catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }



  async findById(req: Request, res: Response) {
      try {
      const resultado = await this.pesquisarServicoId.executar(req.body.id);
      return res.status(200).json(resultado);
    } 
      catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }


  async findByUserId(req: Request, res: Response) {
      try {
      const resultado = await this.pesquisarServicoUserId.executar(req.body.id);
      return res.status(200).json(resultado);
    } 
      catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async findByPrestadorId(req: Request, res: Response) {
      try {
      const resultado = await this.pesquisarServicoPrestadorId.executar(req.body.id);
      return res.status(200).json(resultado);
    } 
      catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }


 async updateStatus (req: Request, res: Response) {
      try {
      const resultado = await this.updateStatusServico.executar(req.body.id, req.body.status);
      return res.status(200).json(resultado);
    } 
      catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }
}

