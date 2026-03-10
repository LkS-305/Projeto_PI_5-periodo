import { Request, Response } from 'express';
import { AvaliarUsuarioUseCase } from '../../core/use-cases/avaliacao/AvaliarUsuarioUseCase';
import { AvaliarPrestadorUseCase } from '../../core/use-cases/avaliacao/AvaliarPrestadorUseCase';
import { AvaliarServicoUseCase } from '../../core/use-cases/avaliacao/AvaliarServicoUseCase';

import { ListarAvaliacaoUsuarioUseCase } from '../../core/use-cases/avaliacao/ListarAvaliacaoUsuarioUseCase';
import { ListarAvaliacaoPrestadorUseCase } from '../../core/use-cases/avaliacao/ListarAvaliacaoPrestadorUseCase';
import { ListarAvaliacaoServicoUseCase } from '../../core/use-cases/avaliacao/ListarAvaliacaoServicoUseCase';


import { AvaliarUPRequest } from '../../core/dtos/avaliacao';
import { AvaliarServicoRequest } from '../../core/dtos/avaliacao';


export class AvaliacaoController {
    constructor(
        private avaliarUsuario: AvaliarUsuarioUseCase,
        private avaliarPrestador: AvaliarPrestadorUseCase,
        private avaliarServico: AvaliarServicoUseCase,
        private listarPorUsuario: ListarAvaliacaoUsuarioUseCase,
        private listarPorPrestador: ListarAvaliacaoPrestadorUseCase,
        private listarPorServico: ListarAvaliacaoServicoUseCase,
  ) {}

  
  async listByServico(req: Request, res: Response) {
      try {
      const resultado = await this.listarPorServico.executar(req.body.id);
      return res.status(200).json(resultado);
    } 
      catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async listByPrestador(req: Request, res: Response) {
    try {
      const resultado = await this.listarPorPrestador.executar(req.body.id);
      return res.status(200).json(resultado);

    } 
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});

    }
  }

  async listByUsuario(req: Request, res: Response) {
    try{
      const resultado = await this.listarPorUsuario.executar(req.body.id);
      return res.status(200).json(resultado);
    } 
    catch(erro: any){
      return res.status(400).json({erro: erro.message});
    }
  }


  async aavaliarUsuario(req: Request, res: Response){
    try {
      const dados: AvaliarUPRequest = req.body;
      const resultado = await this.avaliarUsuario.executar(dados);
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }
  

  async aavaliarPrestador(req: Request, res: Response){
    try {
      const dados: AvaliarUPRequest = req.body;
      const resultado = await this.avaliarPrestador.executar(dados);
      return res.status(200).json(resultado);}
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }}
  

  async aavaliarServico(req: Request, res: Response){
    try {
      const dados: AvaliarServicoRequest = req.body;
      const resultado = await this.avaliarServico.executar(dados);
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }}
}

     
