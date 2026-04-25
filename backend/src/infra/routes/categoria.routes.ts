import { Router } from 'express'; 
import { PgCategoriaRepository } from '../repositories/PgCategoriaRepository';

import { CriarCategoriaUseCase, AtualizarCategoriaUseCase,DeletarCategoriaUseCase, PesquisarPorId, PesquisarTudo, PesquisarPorNome } from '../../core/use-cases/categoria/CategoriaUseCase';

import { CategoriaController } from '../controllers/CategoriaController';
import { ensureAuthenticated } from '../../middlewares/AuthMiddleware';

const categoriaRouter = Router();

const categoriaRepo = new PgCategoriaRepository();
const criarCategoriaUC = new CriarCategoriaUseCase(categoriaRepo);
const atualizarCategoriaUC = new AtualizarCategoriaUseCase(categoriaRepo);
const deletarCategoriaUC = new DeletarCategoriaUseCase(categoriaRepo);
const pesquisarCategoriaUC = new PesquisarPorId(categoriaRepo);
const pesquisarTudoUC = new PesquisarTudo(categoriaRepo);
const pesquisarPorNomeUC = new PesquisarPorNome(categoriaRepo);

const categoriaController = new CategoriaController(criarCategoriaUC, atualizarCategoriaUC, deletarCategoriaUC,pesquisarCategoriaUC, pesquisarTudoUC, pesquisarPorNomeUC);

categoriaRouter.post('/criarCategoria', ensureAuthenticated, categoriaController.criar.bind(categoriaController));
categoriaRouter.patch('/editarCategoria', ensureAuthenticated, categoriaController.atualizar.bind(categoriaController));
categoriaRouter.delete('/deletarCategoria', ensureAuthenticated, categoriaController.delete.bind(categoriaController));
categoriaRouter.post('/buscarPorId', ensureAuthenticated, categoriaController.findById.bind(categoriaController));
categoriaRouter.post('/buscarCategorias', ensureAuthenticated, categoriaController.findAll.bind(categoriaController));
categoriaRouter.post('/buscarPorNome', ensureAuthenticated, categoriaController.findByName.bind(categoriaController));


export { categoriaRouter };
