import { Router } from "express";
import { PgUsuarioRepository } from "../repositories/PgUsuarioRepository";
import { PgUserRepository } from "../repositories/PgUserRepository";
import {
  CriarUsuarioUseCase,
  DeletarUsuarioUseCase,
  AtualizarUsuarioUseCase,
  PesquisarPorUserId,
} from "../../core/use-cases/usuario/UsuarioUseCase";

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

usuarioRouter.post("/criarUsuario", (req, res) =>
  usuarioController.criar(req, res),
);
usuarioRouter.post("/deletarUsuario", (req, res) =>
  usuarioController.deletar(req, res),
);

usuarioRouter.post("/atualizar-usuario", (req, res) =>
  usuarioController.atualizar(req, res),
);

usuarioRouter.post("/buscarPorUserId", (req, res) =>
  usuarioController.findByUserId(req, res),
);

export { usuarioRouter };
