import { Router } from 'express';
import { PgAutenticacaoRepository } from '../repositories/PgAutenticacaoRepository';
import { PgUsuarioRepository } from '../repositories/PgUsuarioRepository';

import { LoginUseCase, ForgotPassword, ChangePassword  } from '../../core/use-cases/autenticacao/AutenticacaoUseCase'; 

import { NodemailerMailProvider } from '../providers/NodemailerMailProvider';
import { AutenticacaoController } from '../controllers/AutenticacaoController';


const autenticacaoRouter = Router();

const autenticacaoRepo = new PgAutenticacaoRepository();
const usuarioRepo = new PgUsuarioRepository();
const mailProvider = new NodemailerMailProvider();


const loginUC = new LoginUseCase(autenticacaoRepo, usuarioRepo);
const forgotPasswordUC = new ForgotPassword(autenticacaoRepo, usuarioRepo, mailProvider);
const changePasswordUC = new ChangePassword(autenticacaoRepo, usuarioRepo);




const autenticacaoController = new AutenticacaoController (loginUC, forgotPasswordUC, changePasswordUC);



autenticacaoRouter.post('/login', (req, res) => autenticacaoController.login(req, res));

autenticacaoRouter.post('/forgotPassword', (req,res) => autenticacaoController.forgotPassword(req,res));

autenticacaoRouter.post('/changePassword', (req,res) => autenticacaoController.changePassword(req,res));

export { autenticacaoRouter };
