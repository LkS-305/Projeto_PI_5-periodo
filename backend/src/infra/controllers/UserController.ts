import { Response, Request } from 'express';
import { RegisterUseCase, LoginUseCase, DeletarUserUseCase, AcharPorEmail, AcharPorId, ForgotPassword, ChangePassword, VerificarEmailExiste } from '../../core/use-cases/user/UserUseCase';
import { AppError } from '../../core/errors/AppError';
import { exigirCampos } from '../../core/utils/validate';
import { logControllerError, logError } from '../../core/utils/httpLogger';

export class UserController {
  constructor(
    private registerUC: RegisterUseCase,
    private loginUC: LoginUseCase,
    private deletarUC: DeletarUserUseCase,
    private acharPorEmail: AcharPorEmail,
    private acharPorId: AcharPorId,
    private forgotPasswordUC: ForgotPassword,
    private changePasswordUC: ChangePassword,
    private verificarEmailUC: VerificarEmailExiste,
  ) {}

  async registrar(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['email', 'senha', 'cpf']);
      const resultado = await this.registerUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        logControllerError('UserController', 'registrar', erro, { statusCode: erro.statusCode });
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      logError('controller.internal', erro, { controller: 'UserController', action: 'registrar' });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async verificarEmail(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['email']);
      const resultado = await this.verificarEmailUC.executar(req.body.email);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        logControllerError('UserController', 'verificarEmail', erro, { statusCode: erro.statusCode });
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      logError('controller.internal', erro, { controller: 'UserController', action: 'verificarEmail' });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['email', 'senha']);
      const resultado = await this.loginUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        logControllerError('UserController', 'login', erro, { statusCode: erro.statusCode });
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      logError('controller.internal', erro, { controller: 'UserController', action: 'login' });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(500).json({ status: 'error', message: 'User nao identifacado p0elo token' });
      }
      if (req.user.id != req.body.id) {
        return res.status(500).json({ status: 'error', message: 'user tentando apagar outro user' });
      }
      const resultado = await this.deletarUC.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        logControllerError('UserController', 'delete', erro, { statusCode: erro.statusCode });
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      logError('controller.internal', erro, { controller: 'UserController', action: 'delete' });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }


  async findByEmail(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['email']);
      const resultado = await this.acharPorEmail.executar(req.body.email);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        logControllerError('UserController', 'findByEmail', erro, { statusCode: erro.statusCode });
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      logError('controller.internal', erro, { controller: 'UserController', action: 'findByEmail' });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }



  async findById(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['id']);
      const resultado = await this.acharPorId.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        logControllerError('UserController', 'findById', erro, { statusCode: erro.statusCode });
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      logError('controller.internal', erro, { controller: 'UserController', action: 'findById' });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }


  async forgotPassword(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['email']);
      const resultado = await this.forgotPasswordUC.executar(req.body.email);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        logControllerError('UserController', 'forgotPassword', erro, { statusCode: erro.statusCode });
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      logError('controller.internal', erro, { controller: 'UserController', action: 'forgotPassword' });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['id', 'senha_atual', 'nova_senha']);
      const resultado = await this.changePasswordUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        logControllerError('UserController', 'changePassword', erro, { statusCode: erro.statusCode });
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      logError('controller.internal', erro, { controller: 'UserController', action: 'changePassword' });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }
}
