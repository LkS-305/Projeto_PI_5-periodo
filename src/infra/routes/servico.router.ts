import { Router } from 'express';
import { PgServicoRepository } from '../repositories/PgServicoRepository';
import { ServicoController } from '../controllers/ServicoController';

import { CriarServicoUseCase,  PesquisarServicoId, PesquisarServicoUserId, PesquisarServicoPrestadorId, UpdateStatusUseCase} from '../../core/use-cases/servico/ServicoUseCase';

const servicoRouter = Router();

const servicoRepo = new PgServicoRepository();

const criarServicoUseCase = new CriarServicoUseCase(servicoRepo);
const pesquisarServicoId = new PesquisarServicoId(servicoRepo);
const pesquisarServicoUserId = new PesquisarServicoUserId(servicoRepo);
const pesquisarServicoPrestadorId = new PesquisarServicoPrestadorId(servicoRepo);

const updateStatusUseCase = new UpdateStatusUseCase(servicoRepo);



const servicoController = new ServicoController(criarServicoUseCase, pesquisarServicoId, pesquisarServicoUserId, pesquisarServicoPrestadorId, updateStatusUseCase);


servicoRouter.post('/criar-servico', (req,res) => servicoController.create(req,res));
servicoRouter.get('/acharPorId', (req,res) => servicoController.findById(req,res));
servicoRouter.get('/acharPorUserId', (req,res) => servicoController.findByUserId(req,res));
servicoRouter.get('/acharPorPretadorId', (req,res) => servicoController.findByPrestadorId(req,res));
servicoRouter.patch('/atualizarServico', (req,res) => servicoController.updateStatus(req,res));

export { servicoRouter };
