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

prestadorRouter.post("/criarPrestador", (req, res) =>
  prestadorController.criar(req, res),
);

prestadorRouter.post("/deletarPrestador", (req, res) =>
  prestadorController.deletar(req, res),
);

prestadorRouter.patch("/atualizarPrestador", (req, res) =>
  prestadorController.atualizar(req, res),
);

prestadorRouter.get("/buscarPorUserId", (req, res) =>
  prestadorController.findByUserId(req, res),
);

export { prestadorRouter };
