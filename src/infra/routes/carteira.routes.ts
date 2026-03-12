import { Router } from 'express';
import { PgCarteiraRepository } from '../repositories/PgCarteiraRepository';

import { CriarCarteiraUseCase, DeletarCarteiraUseCase, AtualizarMetodosDePagamentoUseCase, AtualizarStatus, AtualizarSaldoUseCase, AcharPorUserId, AcharPorPrestadorId } from '../../core/use-cases/financeiro/CarteiraUseCase';

import { CarteiraController } from '../controllers/CarteiraController';

const carteiraRouter = Router();
const carteiraRepo = new PgCarteiraRepository();

const criarCarteiraUseCase = new CriarCarteiraUseCase(carteiraRepo);
const deletarCarteiraUseCase = new DeletarCarteiraUseCase(carteiraRepo);
const atualizarMetodosDePagamentoUseCase = new AtualizarMetodosDePagamentoUseCase(carteiraRepo);
const atualizarStatus =  new AtualizarStatus(carteiraRepo);
const atualizarSaldoUseCase = new AtualizarSaldoUseCase(carteiraRepo);
const acharPorUserId = new AcharPorUserId(carteiraRepo);
const acharPorPrestadorId = new AcharPorPrestadorId(carteiraRepo);

const carteiraController = new CarteiraController(criarCarteiraUseCase, deletarCarteiraUseCase, atualizarMetodosDePagamentoUseCase, atualizarStatus, atualizarSaldoUseCase, acharPorUserId, acharPorPrestadorId);

carteiraRouter.post('/criar-carteira', (req,res) => carteiraController.create(req,res));
carteiraRouter.delete('/deletar-carteira', (req,res) => carteiraController.delete(req,res));
carteiraRouter.patch('/atualizarMetodosDePagamento', (req,res) => carteiraController.updatePaymentMethods(req,res));
carteiraRouter.patch('/atualizarStatus', (req,res) => carteiraController.updateStatus(req,res));
carteiraRouter.patch('/atualizarSaldo', (req,res) => carteiraController.updateBalance(req,res));
carteiraRouter.get('/acharPorUserId', (req,res) => carteiraController.findByUserId(req,res));
carteiraRouter.get('/acharPorPrestadorId', (req,res) => carteiraController.findByPrestadorId(req,res));

