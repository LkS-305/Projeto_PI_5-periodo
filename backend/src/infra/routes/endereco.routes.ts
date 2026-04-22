import { Router } from "express";

import { PgEnderecoRepository } from "../repositories/PgEnderecoRepository";
import { PgUserRepository } from "../repositories/PgUserRepository";
import { EnderecoController } from "../controllers/EnderecoController";

import {
  CriarEnderecoUseCase,
  DeletarEnderecoUseCase,
  AtualizarEnderecoUseCase,
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorCidade,
  SetarPrincipal,
  UnsetarPrincipal,
} from "../../core/use-cases/endereco/EnderecoUseCase";
import { BuscarCepUseCase } from "../../core/use-cases/endereco/BuscarCepUseCase";

const enderecoRouter = Router();

const enderecoRepo = new PgEnderecoRepository();
const userRepo = new PgUserRepository();

const criarEnderecoUC = new CriarEnderecoUseCase(enderecoRepo, userRepo);
const deletarEnderecoUC = new DeletarEnderecoUseCase(enderecoRepo);
const atualizarEnderecoUC = new AtualizarEnderecoUseCase(enderecoRepo);
const acharPorUserIdUC = new AcharPorUserId(enderecoRepo);
const acharPorPrestadorIdUC = new AcharPorPrestadorId(enderecoRepo);
const acharPorCidadeUC = new AcharPorCidade(enderecoRepo);
const setPrincipalUC = new SetarPrincipal(enderecoRepo);
const unsetPrincipalUC = new UnsetarPrincipal(enderecoRepo);
const buscarCepUC = new BuscarCepUseCase();

const enderecoController = new EnderecoController(
  criarEnderecoUC,
  deletarEnderecoUC,
  atualizarEnderecoUC,
  acharPorUserIdUC,
  acharPorPrestadorIdUC,
  acharPorCidadeUC,
  setPrincipalUC,
  unsetPrincipalUC,
  buscarCepUC,
);

enderecoRouter.post("/criarEndereco", (req, res) =>
  enderecoController.criar(req, res),
);
enderecoRouter.delete("/deletarEndereco", (req, res) =>
  enderecoController.delete(req, res),
);
enderecoRouter.patch("/atualizarEndereco", (req, res) =>
  enderecoController.update(req, res),
);
enderecoRouter.get("/acharPorUserId", (req, res) =>
  enderecoController.findByUserId(req, res),
);
enderecoRouter.get("/acharPorPrestadorId", (req, res) =>
  enderecoController.findByPrestadorId(req, res),
);
enderecoRouter.get("/acharPorCidade", (req, res) =>
  enderecoController.findByCity(req, res),
);
enderecoRouter.get("/setPrincipal", (req, res) =>
  enderecoController.setIsPrincipal(req, res),
);
enderecoRouter.get("/unsetPrincipal", (req, res) =>
  enderecoController.unsetIsPrincipal(req, res),
);

enderecoRouter.get("/buscarCep", (req, res) => enderecoController.getCep(req, res))

export { enderecoRouter };
