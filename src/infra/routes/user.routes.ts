import { Router } from 'express';
import { PgUsuarioRepository } from '../repositories/PgUsuarioRepository';
import { CriarUsuarioUseCase } from '../../core/use-cases/usuario/CriarUsuarioUseCase';
import { LoginUsuarioUseCase } from '../../core/use-cases/autenticacao/LoginUsuarioUseCase';
import { UsuarioController } from '../controllers/UsuarioController';
import { PesquisarUsuarioUseCase } from '../../core/use-cases/usuario/PesquisarUsuarioUseCase';
import { DeletarUsuarioUseCase } from '../../core/use-cases/usuario/DeletarUsuarioUseCase';


const userRouter = Router();

const usuarioRepo = new PgUsuarioRepository();
const criarUsuarioUC = new CriarUsuarioUseCase(usuarioRepo);
const loginUsuarioUC = new LoginUsuarioUseCase(usuarioRepo);
const pesquisarUsuarioUC = new PesquisarUsuarioUseCase(usuarioRepo);
const deleteUsuarioUC = new DeletarUsuarioUseCase(usuarioRepo);
const usuarioController = new UsuarioController(criarUsuarioUC, loginUsuarioUC, pesquisarUsuarioUC, deleteUsuarioUC);


userRouter.post('/criarUsuario', (req, res) => usuarioController.criar(req, res));

userRouter.post('/login', (req, res) => usuarioController.login(req, res));

userRouter.post('/buscarPorId', (req, res) => usuarioController.findById(req, res));

userRouter.post('/deletarUsuario', (req, res) => usuarioController.deletar(req, res));



export { userRouter };
