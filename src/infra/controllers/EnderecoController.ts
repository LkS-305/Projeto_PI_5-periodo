import { Request, Response } from 'express';

import { CriarEnderecoUseCase, DeletarEnderecoUseCase, AtualizarEnderecoUseCase, AcharPorUserId, AcharPorPrestadorId, AcharPorCidade, SetarPrincipal, UnsetarPrincipal } from '../../core/use-cases/endereco/EnderecoUseCase';

import { CriarEnderecoDto } from '../../core/dtos/endereco';
import { Endereco } from '../../core/entities/Endereco';

export class EnderecoController {
  constructor(
    private criarEndereco: CriarEnderecoUseCase,
    private deletarEndereco: DeletarEnderecoUseCase,
    private atualizarEndereco: AtualizarEnderecoUseCase,
    private acharPorUserId: AcharPorUserId,
    private acharPorPrestadorId: AcharPorPrestadorId,
    private acharPorCidade: AcharPorCidade,
    private setPrincipal: SetarPrincipal,
    private unsetPrincipal: UnsetarPrincipal
  ) {}

  async criar(req: Request, res: Response){
    try {
      const endereco = req.body;
      const resultado = await this.criarEndereco.executar(endereco); 
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }

  }



  async delete(req: Request, res: Response){
    try {
      const id = req.body.id;
      const resultado = await this.deletarEndereco.executar(id); 
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }

  }



  async update(req: Request, res: Response){
    try {
      const endereco = req.body.endereco;
      const id = req.body.id;
      const resultado = await this.atualizarEndereco.executar(id, endereco); 
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }

  }

 


   async findByUserId(req: Request, res: Response){
    try {
      const id = req.body.id;
      const resultado = await this.acharPorUserId.executar(id); 
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }

  }


  async findByPrestadorId(req: Request, res: Response){
    try {
      const id = req.body.id;
      const resultado = await this.acharPorPrestadorId.executar(id); 
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }

  }



  async findByCity(req: Request, res: Response){
    try {
      const cidade = req.body.cidade;
      const resultado = await this.acharPorCidade.executar(cidade); 
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }

  }


  async setIsPrincipal(req: Request, res: Response){
    try {
      const resultado = await this.setPrincipal.executar(req.body.id); 
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }

  }



  async unsetIsPrincipal(req: Request, res: Response){
    try {
      const resultado = await this.unsetPrincipal.executar(req.body.id); 
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }

  }


}

