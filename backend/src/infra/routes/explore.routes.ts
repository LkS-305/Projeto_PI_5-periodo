import { Router } from 'express';
import { PgExploreRepository } from '../repositories/PgExploreRepository';
import { BuscarExploreUseCase } from '../../core/use-cases/explore/ExploreUseCase';
import { ExploreController } from '../controllers/ExploreController';

const exploreRouter = Router();

const exploreController = new ExploreController(
  new BuscarExploreUseCase(new PgExploreRepository()),
);

exploreRouter.get('/', (req, res) => exploreController.buscar(req, res));

export { exploreRouter };
