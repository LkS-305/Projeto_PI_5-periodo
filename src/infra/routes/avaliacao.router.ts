import { Router } from 'express';
import { PgAvaliacaoRepository } from '../repositories/PgAvaliacaoRepository';
import { AvaliacaoController } from '../controllers/AvaliacaoController';

import { AvaliarUsuarioUseCase } from '../../core/use-cases/avaliacao/AvaliarUsuarioUseCase';
import { AvaliarPrestadorUseCase } from '../../core/use-cases/avaliacao/AvaliarPrestadorUseCase';
import { AvaliarServicoUseCase } from '../../core/use-cases/avaliacao/AvaliarServicoUseCase';

import { ListarAvaliacaoServicoUseCase } from '../../core/use-cases/avaliacao/ListarAvaliacaoServicoUseCase';
import { ListarAvaliacaoUsuarioUseCase } from '../../core/use-cases/avaliacao/ListarAvaliacaoUsuarioUseCase';
import { ListarAvaliacaoPrestadorUseCase } from '../../core/use-cases/avaliacao/ListarAvaliacaoPrestadorUseCase';


const avaliacaoRouter = Router();

const avaliacaoRepo = new PgAvaliacaoRepository();

const avaliarUsuarioUseCase = new AvaliarUsuarioUseCase(avaliacaoRepo);
const avaliarPrestadorUseCase = new AvaliarPrestadorUseCase(avaliacaoRepo);
const avaliarServicoUseCase = new AvaliarServicoUseCase(avaliacaoRepo);
const listarAvaliacaoServicoUseCase = new ListarAvaliacaoServicoUseCase(avaliacaoRepo);
const listarAvaliacaoUsuarioUseCase = new ListarAvaliacaoUsuarioUseCase(avaliacaoRepo);
const listarAvaliacaoPrestadorUseCase = new ListarAvaliacaoPrestadorUseCase(avaliacaoRepo);

const avaliacaoController = new AvaliacaoController(avaliarUsuarioUseCase, avaliarPrestadorUseCase, avaliarServicoUseCase, listarAvaliacaoUsuarioUseCase, listarAvaliacaoPrestadorUseCase, listarAvaliacaoServicoUseCase);


avaliacaoRouter.post('/avaliarUsuario', (req,res) => avaliacaoController.aavaliarUsuario(req,res));
avaliacaoRouter.post('/avaliarPrestador', (req, res) => avaliacaoController.aavaliarPrestador(req,res));
avaliacaoRouter.post('/avaliarServico', (req, res) => avaliacaoController.aavaliarServico(req, res));
avaliacaoRouter.get('/listarPorServico', (req,res) => avaliacaoController.listByServico(req,res));
avaliacaoRouter.get('/listarPorPrestador', (req,res) => avaliacaoController.listByPrestador(req,res));
avaliacaoRouter.get('/listarPorUsuario', (req,res) => avaliacaoController.listByUsuario(req,res));

export { avaliacaoRouter };
