import { Router } from 'express';

import { PgEnderecoRepository } from '../repositories/PgEnderecoRepository'
;
import { EnderecoController } from '../controllers/EnderecoController';
import { CriarEnderecoUseCase } from '../../core/use-cases/endereco/CriarEnderecoUseCase';

const enderecoRouter = Router();

const enderecoRepo = new PgEnderecoRepository();

const criarEnderecoUseCase = new CriarEnderecoUseCase(enderecoRepo);

const enderecoController = new EnderecoController(criarEnderecoUseCase);

enderecoRouter.post('/criarEndereco', (req,res) => enderecoController.criar(req,res));

export { enderecoRouter };
