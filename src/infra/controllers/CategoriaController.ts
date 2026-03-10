import { Request, Response } from 'express';
import { CriarCategoriaUseCase } from '../../core/use-cases/categoria/CriarCategoriaUseCase';


export class CategoriaController {
  constructor(private criarCategoria: CriarCategoriaUseCase){}

  async criar(req: Request, res: Response){
    try {
      const resultado = await this.criarCategoria.executar(req.body);
      return res.status(201).json(resultado);
      

    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }
}
