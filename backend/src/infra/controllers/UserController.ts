import { Response, Request } from 'express';
import { RegisterUseCase, LoginUseCase, ForgotPassword, ChangePassword } from '../../core/use-cases/user/UserUseCase';
import { AppError } from '../../core/errors/AppError';
import { exigirCampos } from '../../core/utils/validate';

export class UserController {
  constructor(
    private registerUC: RegisterUseCase,
    private loginUC: LoginUseCase,
    private forgotPasswordUC: ForgotPassword,
    private changePasswordUC: ChangePassword,
  ) {}

  async registrar(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['email', 'senha', 'cpf']);
      const resultado = await this.registerUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['email', 'senha']);
      const resultado = await this.loginUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['email']);
      const resultado = await this.forgotPasswordUC.executar(req.body.email);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ['id', 'senha_atual', 'nova_senha']);
      const resultado = await this.changePasswordUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }
}
