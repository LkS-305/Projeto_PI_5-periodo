import { Router } from 'express'; 
import { PgCategoriaRepository } from '../repositories/PgCategoriaRepository';

import { CriarCategoriaUseCase, AtualizarCategoriaUseCase, PesquisarPorId, PesquisarTudo, PesquisarPorNome } from '../../core/use-cases/categoria/CategoriaUseCase';

import { CategoriaController } from '../controllers/CategoriaController';

const categoriaRouter = Router();

const categoriaRepo = new PgCategoriaRepository();
const criarCategoriaUC = new CriarCategoriaUseCase(categoriaRepo);
const atualizarCategoriaUC = new AtualizarCategoriaUseCase(categoriaRepo);
const pesquisarCategoriaUC = new PesquisarPorId(categoriaRepo);
const pesquisarTudoUC = new PesquisarTudo(categoriaRepo);
const pesquisarPorNomeUC = new PesquisarPorNome(categoriaRepo);

const categoriaController = new CategoriaController(criarCategoriaUC, atualizarCategoriaUC, pesquisarCategoriaUC, pesquisarTudoUC, pesquisarPorNomeUC);

categoriaRouter.post('/criar-categoria', (req, res) => categoriaController.criar(req,res));
categoriaRouter.patch('/atualizar-categoria', (req, res) => categoriaController.atualizar(req,res));
categoriaRouter.get('/procurarCategoriaId', (req, res) => categoriaController.findById(req,res));
categoriaRouter.get('/procurarCategorias', (req, res) => categoriaController.findAll(req,res));
categoriaRouter.get('/procurarCategoriaPorNome', (req, res) => categoriaController.findByName(req,res));


export { categoriaRouter };
