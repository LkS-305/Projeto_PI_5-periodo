import { Router } from "express";
import { PgUserRepository } from "../repositories/PgUserRepository";
import { PgUsuarioRepository } from "../repositories/PgUsuarioRepository";
import { PgVerificacaoEmailCadastroRepository } from "../repositories/PgVerificacaoEmailCadastroRepository";

import {
  RegisterUseCase,
  LoginUseCase,
  DeletarUserUseCase,
  AcharPorEmail,
  AcharPorId,
  ForgotPassword,
  ChangeForgotPassword,
  ChangePassword,
  VerificarEmailExiste,
  EnviarCodigoVerificacaoCadastroUseCase,
  ConfirmarCodigoVerificacaoCadastroUseCase,
} from "../../core/use-cases/user/UserUseCase";

import { NodemailerMailProvider } from "../providers/NodemailerMailProvider";
import { UserController } from "../controllers/UserController";
import { ensureAuthenticated } from "../../middlewares/AuthMiddleware";

const userRouter = Router();

const userRepo = new PgUserRepository();
const usuarioRepo = new PgUsuarioRepository();
const verificacaoCadastroRepo = new PgVerificacaoEmailCadastroRepository();
const mailProvider = new NodemailerMailProvider();

const registerUC = new RegisterUseCase(userRepo, usuarioRepo);
const loginUC = new LoginUseCase(userRepo);
const deleteUC = new DeletarUserUseCase(userRepo);
const acharPorEmail = new AcharPorEmail(userRepo);
const acharPorId = new AcharPorId(userRepo);
const forgotPasswordUC = new ForgotPassword(userRepo, mailProvider);
const changeForgotPasswordUC = new ChangeForgotPassword(userRepo);
const changePasswordUC = new ChangePassword(userRepo);
const verificarEmailUC = new VerificarEmailExiste(userRepo);
const enviarCodigoCadastroUC = new EnviarCodigoVerificacaoCadastroUseCase(
  userRepo,
  verificacaoCadastroRepo,
  mailProvider,
);
const confirmarCodigoCadastroUC = new ConfirmarCodigoVerificacaoCadastroUseCase(
  verificacaoCadastroRepo,
);

const userController = new UserController(
  registerUC,
  loginUC,
  deleteUC,
  acharPorEmail,
  acharPorId,
  forgotPasswordUC,
  changeForgotPasswordUC,
  changePasswordUC,
  verificarEmailUC,
  enviarCodigoCadastroUC,
  confirmarCodigoCadastroUC,
);

userRouter.post("/verificarEmail", userController.verificarEmail.bind(userController));

userRouter.post("/register", userController.registrar.bind(userController));

userRouter.post("/login", userController.login.bind(userController));

userRouter.post("/forgotPassword", userController.forgotPassword.bind(userController));

userRouter.post("/changeForgotPassword", userController.changeForgotPassword.bind(userController));

userRouter.post("/enviarCodigoCadastro", userController.enviarCodigoCadastro.bind(userController));

userRouter.post("/confirmarCodigoCadastro", userController.confirmarCodigoCadastro.bind(userController));

userRouter.delete("/deletarUser", ensureAuthenticated, userController.delete.bind(userController));

userRouter.post("/buscarPorEmail", ensureAuthenticated, userController.findByEmail.bind(userController));

userRouter.post("/buscarPorId", ensureAuthenticated, userController.findById.bind(userController));

userRouter.post("/changePassword", ensureAuthenticated, userController.changePassword.bind(userController));

export { userRouter };
