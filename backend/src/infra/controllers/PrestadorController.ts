import { Request, Response } from 'express';
import { CriarPrestadorUseCase, DeletarPrestadorUseCase, AtualizarPrestadorUseCase, TornarsePrestadorUseCase, ListarPorCategoria, AcharPorId, AcharPorUserId} from '../../core/use-cases/prestador/PrestadorUseCase';



export class PrestadorController {
  constructor(
    private criarPrestador: CriarPrestadorUseCase,
    private deletarPrestador: DeletarPrestadorUseCase,  
    private atualizarPrestador: AtualizarPrestadorUseCase,
    private tornarsePrestador: TornarsePrestadorUseCase,
    private listarPorCategoria: ListarPorCategoria,
    private acharPorId: AcharPorId,
    private acharPorUserId: AcharPorUserId
  ) {}
  
  async criar(req: Request, res: Response) {
    try {
      const resultado = await this.criarPrestador.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const resultado = await this.deletarPrestador.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarPrestador.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

  async becomePrestador(req: Request, res: Response) {
    try {
      const resultado = await this.tornarsePrestador.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }
  async findById(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorId.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }
  async findByUserId(req: Request, res: Response) { 
   try {
    const resultado = await this.acharPorUserId.executar(req.body.id);
    return res.status(200).json(resultado);
  } catch (erro: any) {
    return res.status(400).json({erro: erro.message});
    }
  }

  async listByCategoria(req: Request, res: Response) {
   try {
    const resultado = await this.listarPorCategoria.executar(req.body.categoria);
    return res.status(200).json(resultado);

  } catch (erro: any) {

  }}
}
