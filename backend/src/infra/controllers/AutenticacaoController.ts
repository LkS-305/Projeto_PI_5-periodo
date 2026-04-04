import { Response, Request } from 'express';
import { LoginUseCase, ForgotPassword, ChangePassword } from '../../core/use-cases/autenticacao/AutenticacaoUseCase';


export class AutenticacaoController {
  constructor(
    private loginUC: LoginUseCase,
    private forgotPasswordUC: ForgotPassword,
    private changePasswordUC: ChangePassword,
  ){}

  async login(req: Request, res: Response){
    try {
        const resultado = await this.loginUC.executar(req.body);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const resultado = await this.forgotPasswordUC.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const resultado = await this.changePasswordUC.executar(req.body.id, req.body.dados);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }
}
