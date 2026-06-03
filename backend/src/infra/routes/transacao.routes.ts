import { Router } from 'express';
import { PgTransacaoRepository } from '../repositories/PgTransacaoRepository';
import { AcharPorUserId, AcharPorPrestadorId, AcharPorServicoId } from '../../core/use-cases/financeiro/TransacaoUseCase';
import { TransacaoController } from '../controllers/TransacaoController';

const transacaoRouter = Router();
const transacaoRepo = new PgTransacaoRepository();

const acharPorUserId = new AcharPorUserId(transacaoRepo);
const acharPorPrestadorId = new AcharPorPrestadorId(transacaoRepo);
const acharPorServicoId = new AcharPorServicoId(transacaoRepo);

const transacaoController = new TransacaoController(
  acharPorUserId,
  acharPorPrestadorId,
  acharPorServicoId,
);

transacaoRouter.get('/porUsuario', (req, res) => transacaoController.findByUserId(req, res));
transacaoRouter.get('/porPrestador', (req, res) => transacaoController.findByPrestadorId(req, res));
transacaoRouter.get('/porServico', (req, res) => transacaoController.findByServicoId(req, res));

export { transacaoRouter };
