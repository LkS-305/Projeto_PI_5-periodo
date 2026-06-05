import { Request, Response } from 'express';
import { BuscarExploreUseCase } from '../../core/use-cases/explore/ExploreUseCase';

export class ExploreController {
  constructor(private buscarExplore: BuscarExploreUseCase) {}

  async buscar(req: Request, res: Response) {
    try {
      const resultado = await this.buscarExplore.executar();
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}
