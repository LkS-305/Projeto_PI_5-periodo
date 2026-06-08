import { Router } from 'express';
import { PgTransacaoRepository } from '../repositories/PgTransacaoRepository';
import { PgCarteiraRepository } from '../repositories/PgCarteiraRepository';
import { PgServicoRepository } from '../repositories/PgServicoRepository';
import { AsaasProvider } from '../providers/AsaasProvider';
import {
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorServicoId,
  IniciarPagamentoUseCase,
  LiberarPagamentoUseCase,
  ReembolsarPagamentoUseCase,
  ProcessarWebhookAsaasUseCase,
} from '../../core/use-cases/financeiro/TransacaoUseCase';
import { TransacaoController } from '../controllers/TransacaoController';
import { ensureAuthenticated } from '../../middlewares/AuthMiddleware';

const transacaoRouter = Router();

const transacaoRepo = new PgTransacaoRepository();
const carteiraRepo  = new PgCarteiraRepository();
const servicoRepo   = new PgServicoRepository();
const asaas         = new AsaasProvider();

const transacaoController = new TransacaoController(
  new AcharPorUserId(transacaoRepo),
  new AcharPorPrestadorId(transacaoRepo),
  new AcharPorServicoId(transacaoRepo),
  new IniciarPagamentoUseCase(transacaoRepo, asaas),
  new LiberarPagamentoUseCase(transacaoRepo, carteiraRepo),
  new ReembolsarPagamentoUseCase(transacaoRepo, asaas),
  new ProcessarWebhookAsaasUseCase(transacaoRepo, carteiraRepo, servicoRepo),
);

// Read
transacaoRouter.get('/porUsuario',   (req, res) => transacaoController.findByUserId(req, res));
transacaoRouter.get('/porPrestador', (req, res) => transacaoController.findByPrestadorId(req, res));
transacaoRouter.get('/porServico',   (req, res) => transacaoController.findByServicoId(req, res));

// Payment lifecycle (authenticated)
transacaoRouter.post('/iniciar',    ensureAuthenticated, (req, res) => transacaoController.iniciar(req, res));
transacaoRouter.put('/liberar',     ensureAuthenticated, (req, res) => transacaoController.liberar(req, res));
transacaoRouter.put('/reembolsar',  ensureAuthenticated, (req, res) => transacaoController.reembolsar(req, res));

// Asaas webhook — no auth, called externally by Asaas servers
transacaoRouter.post('/webhook/asaas', (req, res) => transacaoController.webhook(req, res));

export { transacaoRouter };
