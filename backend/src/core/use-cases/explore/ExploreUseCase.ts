import { IExploreRepository, ExploreCategoria } from '../../repositories/IExploreRepository';

export class BuscarExploreUseCase {
  constructor(private exploreRepository: IExploreRepository) {}

  async executar(): Promise<ExploreCategoria[]> {
    return await this.exploreRepository.buscarParaExplore();
  }
}
