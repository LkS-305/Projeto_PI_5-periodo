import { Router } from 'express';
import { PgAvaliacaoRepository } from '../repositories/PgAvaliacaoRepository';
import { AvaliacaoController } from '../controllers/AvaliacaoController';

import { CriarAvaliacaoUseCase, AtualizarAvaliacaoUseCase, DeletarAvaliacaoUseCase, ListarPorId } from '../../core/use-cases/avaliacao/AvaliacaoUseCase';

const avaliacaoRouter = Router();

const avaliacaoRepo = new PgAvaliacaoRepository();

const criarAvaliacaoUC = new CriarAvaliacaoUseCase(avaliacaoRepo);
const atualizarAvaliacaoUC = new AtualizarAvaliacaoUseCase(avaliacaoRepo);
const deletarAvaliacaoUC = new DeletarAvaliacaoUseCase(avaliacaoRepo);
const listarAvaliacaoUC = new ListarPorId(avaliacaoRepo);

const avaliacaoController = new AvaliacaoController(criarAvaliacaoUC, atualizarAvaliacaoUC, deletarAvaliacaoUC, listarAvaliacaoUC);


avaliacaoRouter.post('/criarAvaliacao', (req, res) => avaliacaoController.create(req, res));
avaliacaoRouter.get('/deletarAvaliacao', (req,res) => avaliacaoController.delete(req,res));
avaliacaoRouter.get('/atualizar-avaliacao', (req,res) => avaliacaoController.update(req,res));
avaliacaoRouter.get('/listarAvaliacoes', (req,res) => avaliacaoController.listBy(req,res));

export { avaliacaoRouter };
