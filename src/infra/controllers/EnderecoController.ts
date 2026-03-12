import { Request, Response } from 'express';

import { CriarEnderecoUseCase } from '../../core/use-cases/endereco/CriarEnderecoUseCase';

import { CriarEnderecoDto } from '../../core/dtos/endereco';
import { Endereco } from '../../core/entities/Endereco';

export class EnderecoController {
  constructor(
    private criarEndereco: CriarEnderecoUseCase
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
}
