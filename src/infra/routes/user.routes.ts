import { Router } from 'express';
import { PgUsuarioRepository } from '../repositories/PgUsuarioRepository';
import { CriarUsuarioUseCase, DeletarUsuarioUseCase, AtualizarUsuarioUseCase, PesquisarPorId,PesquisarPorEmail } from '../../core/use-cases/usuario/UsuarioUseCase';
import { LoginUsuarioUseCase } from '../../core/use-cases/autenticacao/LoginUsuarioUseCase'; 

import { UsuarioController } from '../controllers/UsuarioController';


const userRouter = Router();

const usuarioRepo = new PgUsuarioRepository();

const criarUsuarioUC = new CriarUsuarioUseCase(usuarioRepo);
const deleteUsuarioUC = new DeletarUsuarioUseCase(usuarioRepo);
const atualizarUsuarioUC = new AtualizarUsuarioUseCase(usuarioRepo);
const loginUsuarioUC = new LoginUsuarioUseCase(usuarioRepo);
const pesquisarPorIdUC = new PesquisarPorId(usuarioRepo);
const pesquisarPorEmailUC = new PesquisarPorEmail(usuarioRepo);




const usuarioController = new UsuarioController(criarUsuarioUC, deleteUsuarioUC, atualizarUsuarioUC, pesquisarPorIdUC, pesquisarPorEmailUC, loginUsuarioUC);


userRouter.post('/criarUsuario', (req, res) => usuarioController.criar(req, res));

userRouter.post('/login', (req, res) => usuarioController.login(req, res));

userRouter.post('/buscarPorId', (req, res) => usuarioController.findById(req, res));

userRouter.post('/atualizar-usuario', (req, res) => usuarioController.deletar(req, res));

userRouter.post('/buscarPorEmail', (req, res) => usuarioController.deletar(req, res));

userRouter.post('/deletarUsuario', (req, res) => usuarioController.deletar(req, res));



export { userRouter };
