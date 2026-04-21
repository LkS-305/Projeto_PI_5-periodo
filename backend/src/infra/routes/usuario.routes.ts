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

const userRouter = Router();

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

userRouter.post("/criarUsuario", (req, res) =>
  usuarioController.criar(req, res),
);
userRouter.post("/deletarUsuario", (req, res) =>
  usuarioController.deletar(req, res),
);

userRouter.post("/atualizar-usuario", (req, res) =>
  usuarioController.atualizar(req, res),
);

userRouter.post("/buscarPorUserId", (req, res) =>
  usuarioController.findByUserId(req, res),
);

export { userRouter };
