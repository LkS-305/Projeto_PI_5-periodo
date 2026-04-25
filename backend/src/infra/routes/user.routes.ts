import { Router } from "express";
import { PgUserRepository } from "../repositories/PgUserRepository";

import {
  RegisterUseCase,
  LoginUseCase,
  ForgotPassword,
  ChangePassword,
} from "../../core/use-cases/user/UserUseCase";

import { NodemailerMailProvider } from "../providers/NodemailerMailProvider";
import { UserController } from "../controllers/UserController";

const userRouter = Router();

const userRepo = new PgUserRepository();
const mailProvider = new NodemailerMailProvider();

const registerUC = new RegisterUseCase(userRepo);
const loginUC = new LoginUseCase(userRepo);
const forgotPasswordUC = new ForgotPassword(userRepo, mailProvider);
const changePasswordUC = new ChangePassword(userRepo);

const userController = new UserController(
  registerUC,
  loginUC,
  forgotPasswordUC,
  changePasswordUC,
);

userRouter.post("/register", (req, res) => userController.registrar(req, res));

userRouter.post("/login", (req, res) => userController.login(req, res));

userRouter.post("/forgotPassword", (req, res) =>
  userController.forgotPassword(req, res),
);

userRouter.post("/changePassword", (req, res) =>
  userController.changePassword(req, res),
);

export { userRouter };
