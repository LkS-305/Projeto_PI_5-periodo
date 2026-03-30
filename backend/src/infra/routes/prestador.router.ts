import { Router } from 'express';
import { PgPrestadorRepository } from '../repositories/PgPrestadorRepository';
import { CriarPrestadorUseCase, AcharPorUserId, AcharPorId, ListarPorCategoria } from '../../core/use-cases/prestador/PrestadorUseCase';

import { PrestadorController } from '../controllers/PrestadorController';

const prestadorRouter = Router();

const prestadorRepo = new PgPrestadorRepository();

const criarPrestadorUC = new CriarPrestadorUseCase(prestadorRepo)
const pesquisarPorIdUC = new AcharPorId(prestadorRepo);
const pesquisarPorUserIdUC = new AcharPorUserId(prestadorRepo);
const listarPorCategoriaUC = new ListarPorCategoria(prestadorRepo);

const prestadorController = new PrestadorController(criarPrestadorUC, listarPorCategoriaUC, pesquisarPorIdUC, pesquisarPorUserIdUC);


prestadorRouter.post('/criarPrestador', (req, res) => prestadorController.criar(req, res));

prestadorRouter.get('/buscarPorUserId', (req, res) => prestadorController.findByUserId(req, res));

prestadorRouter.get('/buscarPorId', (req, res) => prestadorController.findById(req, res));

prestadorRouter.get('/listarPorCategoria', (req, res) => prestadorController.listByCategoria(req, res));


export { prestadorRouter };
