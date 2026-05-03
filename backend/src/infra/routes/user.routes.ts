import { Router } from "express";
import { PgUserRepository } from "../repositories/PgUserRepository";

import {
  RegisterUseCase,
  LoginUseCase,
  DeletarUserUseCase,
  AcharPorEmail,
  AcharPorId,
  ForgotPassword,
  ChangePassword,
} from "../../core/use-cases/user/UserUseCase";

import { NodemailerMailProvider } from "../providers/NodemailerMailProvider";
import { UserController } from "../controllers/UserController";
import { ensureAuthenticated } from "../../middlewares/AuthMiddleware";

const userRouter = Router();

const userRepo = new PgUserRepository();
const mailProvider = new NodemailerMailProvider();

const registerUC = new RegisterUseCase(userRepo);
const loginUC = new LoginUseCase(userRepo);
const deleteUC = new DeletarUserUseCase(userRepo);
const acharPorEmail = new AcharPorEmail(userRepo);
const acharPorId = new AcharPorId(userRepo);
const forgotPasswordUC = new ForgotPassword(userRepo, mailProvider);
const changePasswordUC = new ChangePassword(userRepo);

const userController = new UserController(
  registerUC,
  loginUC,
  deleteUC,
  acharPorEmail,
  acharPorId,
  forgotPasswordUC,
  changePasswordUC,
);

userRouter.post("/register", userController.registrar.bind(userController));

userRouter.post("/login", userController.login.bind(userController));

userRouter.delete("/deletarUser", ensureAuthenticated, userController.delete.bind(userController));

userRouter.post("/buscarPorEmail", ensureAuthenticated, userController.findByEmail.bind(userController));

userRouter.post("/buscarPorId", ensureAuthenticated, userController.findById.bind(userController));

userRouter.post("/forgotPassword", ensureAuthenticated, userController.forgotPassword.bind(userController));

userRouter.post("/changePassword", ensureAuthenticated, userController.changePassword.bind(userController));

export { userRouter };
