import { Request, Response } from 'express';
import { CriarCategoriaUseCase, AtualizarCategoriaUseCase, PesquisarPorId, PesquisarTudo, PesquisarPorNome } from '../../core/use-cases/categoria/CategoriaUseCase';


export class CategoriaController {
  constructor(
    private criarCategoria: CriarCategoriaUseCase,
    private atualizarCategoria: AtualizarCategoriaUseCase,
    private pesquisarId: PesquisarPorId,
    private presquisarTudo: PesquisarTudo,
    private presquisarPorNome: PesquisarPorNome
  ){}

  async criar(req: Request, res: Response){
    try {
      const resultado = await this.criarCategoria.executar(req.body);
      return res.status(201).json(resultado);
      

    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }
  async atualizar(req: Request, res: Response){
    try {
      const resultado = await this.atualizarCategoria.executar(req.body.id, req.body.dados);
      return res.status(201).json(resultado);
      

    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async findById(req: Request, res: Response){
    try {
      const resultado = await this.pesquisarId.executar(req.body.id);
      return res.status(201).json(resultado);
      

    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async findAll(req: Request, res: Response){
    try {
      const resultado = await this.presquisarTudo.executar();
      return res.status(201).json(resultado);
      

    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async findByName(req: Request, res: Response){
    try {
      const resultado = await this.presquisarPorNome.executar(req.body.name);
      return res.status(201).json(resultado);
      

    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

}
