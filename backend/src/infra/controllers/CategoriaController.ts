import { Request, Response } from 'express';
import { CriarCategoriaUseCase, AtualizarCategoriaUseCase, DeletarCategoriaUseCase, PesquisarPorId, PesquisarTudo, PesquisarPorNome } from '../../core/use-cases/categoria/CategoriaUseCase';


export class CategoriaController {
  constructor(
    private criarCategoria: CriarCategoriaUseCase,
    private atualizarCategoria: AtualizarCategoriaUseCase,
    private deletarCategoria: DeletarCategoriaUseCase,
    private pesquisarId: PesquisarPorId,
    private presquisarTudo: PesquisarTudo,
    private presquisarPorNome: PesquisarPorNome
  ){}

  async criar(req: Request, res: Response){
    try {
      const resultado = await this.criarCategoria.executar({nome: req.body.nome, slug: req.body.slug, icon_url: req.body.icon_url});
      return res.status(201).json(resultado);
      

    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }
  async atualizar(req: Request, res: Response){
    try {
      const resultado = await this.atualizarCategoria.executar({id: req.body.id, nome: req.body.dados.nome, slug: req.body.dados.slug, icon_url: req.body.dados.icon_url});
      return res.status(201).json(resultado);
      
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const resultado = await this.deletarCategoria.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
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
