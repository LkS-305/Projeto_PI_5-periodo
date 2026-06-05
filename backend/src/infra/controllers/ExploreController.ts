import { Request, Response } from 'express';
import { BuscarExploreUseCase } from '../../core/use-cases/explore/ExploreUseCase';
import { logControllerError } from '../../core/utils/httpLogger';

export class ExploreController {
  constructor(private buscarExplore: BuscarExploreUseCase) {}

  async buscar(req: Request, res: Response) {
    try {
      const resultado = await this.buscarExplore.executar();
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('ExploreController', 'buscar', erro, { httpStatus: 500 });
      return res.status(500).json({ erro: erro.message });
    }
  }
}
