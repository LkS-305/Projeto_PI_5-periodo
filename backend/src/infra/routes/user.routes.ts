import { Router } from 'express';
import { PgUsuarioRepository } from '../repositories/PgUsuarioRepository';
import { DeletarUsuarioUseCase, AtualizarUsuarioUseCase, PesquisarPorId, PesquisarPorEmail } from '../../core/use-cases/usuario/UsuarioUseCase';

import { UsuarioController } from '../controllers/UsuarioController';


const userRouter = Router();

const usuarioRepo = new PgUsuarioRepository();

const deleteUsuarioUC = new DeletarUsuarioUseCase(usuarioRepo);
const atualizarUsuarioUC = new AtualizarUsuarioUseCase(usuarioRepo);
const pesquisarPorIdUC = new PesquisarPorId(usuarioRepo);
const pesquisarPorEmailUC = new PesquisarPorEmail(usuarioRepo);




const usuarioController = new UsuarioController(deleteUsuarioUC, atualizarUsuarioUC, pesquisarPorIdUC, pesquisarPorEmailUC);


userRouter.post('/deletarUsuario', (req, res) => usuarioController.deletar(req, res));

userRouter.post('/atualizar-usuario', (req, res) => usuarioController.atualizar(req, res));

<<<<<<< HEAD
userRouter.post('/buscarPorEmail', (req, res) => usuarioController.findByName(req, res));
=======
userRouter.post('/buscarPorId', (req, res) => usuarioController.findById(req, res));
>>>>>>> 983c23b (finalizando crud e enderecos)

userRouter.post('/buscarPorEmail', (req, res) => usuarioController.deletar(req, res));



export { userRouter };
