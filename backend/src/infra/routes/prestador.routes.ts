import { Router } from "express";
import { PgPrestadorRepository } from "../repositories/PgPrestadorRepository";
import { PgUserRepository } from "../repositories/PgUserRepository";
import {
  CriarPrestadorUseCase,
  DeletarPrestadorUseCase,
  AtualizarPrestadorUseCase,
  AcharPorUserId,
} from "../../core/use-cases/prestador/PrestadorUseCase";
import { PrestadorController } from "../controllers/PrestadorController";
import { ensureAuthenticated } from "../../middlewares/AuthMiddleware";

const prestadorRouter = Router();

const prestadorRepo = new PgPrestadorRepository();
const userRepo = new PgUserRepository();

const criarPrestadorUC = new CriarPrestadorUseCase(userRepo, prestadorRepo);
const deletarPrestadorUC = new DeletarPrestadorUseCase(prestadorRepo);
const atualizarPrestadorUC = new AtualizarPrestadorUseCase(prestadorRepo);
const pesquisarPorUserIdUC = new AcharPorUserId(prestadorRepo);

const prestadorController = new PrestadorController(
  criarPrestadorUC,
  deletarPrestadorUC,
  atualizarPrestadorUC,
  pesquisarPorUserIdUC,
);

prestadorRouter.post("/criarPrestador", ensureAuthenticated, prestadorController.criar.bind(prestadorController));

prestadorRouter.delete("/deletarPrestador", ensureAuthenticated, prestadorController.deletar.bind(prestadorController));

prestadorRouter.patch("/editarPrestador", ensureAuthenticated, prestadorController.atualizar.bind(prestadorController));

prestadorRouter.post("/buscarPorUserId", ensureAuthenticated, prestadorController.findByUserId.bind(prestadorController));

export { prestadorRouter };
