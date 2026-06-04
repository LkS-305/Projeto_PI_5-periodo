import { Router } from 'express';
import { PgTransacaoRepository } from '../repositories/PgTransacaoRepository';
import { PgCarteiraRepository } from '../repositories/PgCarteiraRepository';
import {
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorServicoId,
  IniciarPagamentoUseCase,
  LiberarPagamentoUseCase,
  ReembolsarPagamentoUseCase,
} from '../../core/use-cases/financeiro/TransacaoUseCase';
import { TransacaoController } from '../controllers/TransacaoController';

const transacaoRouter = Router();
const transacaoRepo = new PgTransacaoRepository();
const carteiraRepo = new PgCarteiraRepository();

const transacaoController = new TransacaoController(
  new AcharPorUserId(transacaoRepo),
  new AcharPorPrestadorId(transacaoRepo),
  new AcharPorServicoId(transacaoRepo),
  new IniciarPagamentoUseCase(transacaoRepo, carteiraRepo),
  new LiberarPagamentoUseCase(transacaoRepo, carteiraRepo),
  new ReembolsarPagamentoUseCase(transacaoRepo, carteiraRepo),
);

transacaoRouter.get('/porUsuario', (req, res) => transacaoController.findByUserId(req, res));
transacaoRouter.get('/porPrestador', (req, res) => transacaoController.findByPrestadorId(req, res));
transacaoRouter.get('/porServico', (req, res) => transacaoController.findByServicoId(req, res));

transacaoRouter.post('/iniciar', (req, res) => transacaoController.iniciar(req, res));
transacaoRouter.put('/liberar', (req, res) => transacaoController.liberar(req, res));
transacaoRouter.put('/reembolsar', (req, res) => transacaoController.reembolsar(req, res));

export { transacaoRouter };
