import { Router } from "express";
import { PgUsuarioRepository } from "../repositories/PgUsuarioRepository";
import { PgUserRepository } from "../repositories/PgUserRepository";
import {
  CriarUsuarioUseCase,
  DeletarUsuarioUseCase,
  AtualizarUsuarioUseCase,
  PesquisarPorUserId,
} from "../../core/use-cases/usuario/UsuarioUseCase";
import { ensureAuthenticated } from "../../middlewares/AuthMiddleware";
import { UsuarioController } from "../controllers/UsuarioController";

const usuarioRouter = Router();

const usuarioRepo = new PgUsuarioRepository();
const userRepo = new PgUserRepository();

const criarUsuarioUC = new CriarUsuarioUseCase(usuarioRepo, userRepo);
const deleteUsuarioUC = new DeletarUsuarioUseCase(usuarioRepo);
const atualizarUsuarioUC = new AtualizarUsuarioUseCase(usuarioRepo);
const pesquisarPorUserIdUC = new PesquisarPorUserId(usuarioRepo);

const usuarioController = new UsuarioController(
  criarUsuarioUC,
  deleteUsuarioUC,
  atualizarUsuarioUC,
  pesquisarPorUserIdUC,
);

usuarioRouter.post("/criarUsuario", ensureAuthenticated, usuarioController.criar.bind(usuarioController));

usuarioRouter.delete("/deletarUsuario", ensureAuthenticated, usuarioController.deletar.bind(usuarioController));

usuarioRouter.patch("/editarUsuario", ensureAuthenticated, usuarioController.atualizar.bind(usuarioController));

usuarioRouter.post("/buscarPorUserId", ensureAuthenticated, usuarioController.findByUserId.bind(usuarioController));

export { usuarioRouter };
