import { Response, Request } from 'express';
import { RegisterUseCase, LoginUseCase, ForgotPassword, ChangePassword } from '../../core/use-cases/autenticacao/AutenticacaoUseCase';


export class AutenticacaoController {
  constructor(
    private registerUC: RegisterUseCase,
    private loginUC: LoginUseCase,
    private forgotPasswordUC: ForgotPassword,
    private changePasswordUC: ChangePassword,
  ){}

  async registrar(req: Request, res: Response) {
    try{
      const resultado = await this.registerUC.executar(req.body);
      return res.status(200).json(resultado);
    }
    catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
  }

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
      const resultado = await this.changePasswordUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }
}
