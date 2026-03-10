import { Router } from 'express'; 
import { PgCategoriaRepository } from '../repositories/PgCategoriaRepository';
import { CriarCategoriaUseCase } from '../../core/use-cases/categoria/CriarCategoriaUseCase';

import { CategoriaController } from '../controllers/CategoriaController';


const categoriaRouter = Router();

const categoriaRepo = new PgCategoriaRepository();
const criarCategoriaUC = new CriarCategoriaUseCase(categoriaRepo);

const categoriaController = new CategoriaController(criarCategoriaUC);

categoriaRouter.post('/criar-categoria', (req, res) => categoriaController.criar(req,res));

export { categoriaRouter };
