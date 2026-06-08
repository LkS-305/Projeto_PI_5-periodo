import { Response, Request } from "express";
import {
  RegisterUseCase,
  LoginUseCase,
  DeletarUserUseCase,
  AcharPorEmail,
  AcharPorId,
  ForgotPassword,
  ChangeForgotPassword,
  ChangePassword,
  VerificarEmailExiste,
  EnviarCodigoVerificacaoCadastroUseCase,
  ConfirmarCodigoVerificacaoCadastroUseCase,
} from "../../core/use-cases/user/UserUseCase";
import { AppError } from "../../core/errors/AppError";
import { exigirCampos } from "../../core/utils/validate";

export class UserController {
  constructor(
    private registerUC: RegisterUseCase,
    private loginUC: LoginUseCase,
    private deletarUC: DeletarUserUseCase,
    private acharPorEmail: AcharPorEmail,
    private acharPorId: AcharPorId,
    private forgotPasswordUC: ForgotPassword,
    private changeForgotPasswordUC: ChangeForgotPassword,
    private changePasswordUC: ChangePassword,
    private verificarEmailUC: VerificarEmailExiste,
    private enviarCodigoCadastroUC: EnviarCodigoVerificacaoCadastroUseCase,
    private confirmarCodigoCadastroUC: ConfirmarCodigoVerificacaoCadastroUseCase,
  ) {}

  async registrar(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["email", "senha", "cpf"]);
      const resultado = await this.registerUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async verificarEmail(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["email"]);
      const resultado = await this.verificarEmailUC.executar(req.body.email);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["email", "senha"]);
      const resultado = await this.loginUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(500)
          .json({
            status: "error",
            message: "User nao identifacado p0elo token",
          });
      }
      if (req.user.id != req.body.id) {
        return res
          .status(500)
          .json({
            status: "error",
            message: "user tentando apagar outro user",
          });
      }
      const resultado = await this.deletarUC.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async findByEmail(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["email"]);
      const resultado = await this.acharPorEmail.executar(req.body.email);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["id"]);
      const resultado = await this.acharPorId.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["email"]);
      await this.forgotPasswordUC.executar(req.body.email);
      return res.status(200).json({ ok: true });
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async changeForgotPassword(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["email", "codigo", "nova_senha"]);
      await this.changeForgotPasswordUC.executar(req.body);
      return res.status(200).json({ ok: true });
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async enviarCodigoCadastro(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["email"]);
      await this.enviarCodigoCadastroUC.executar(req.body.email);
      return res.status(200).json({ ok: true });
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      console.error("[user/enviarCodigoCadastro]", erro);
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async confirmarCodigoCadastro(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["email", "codigo"]);
      await this.confirmarCodigoCadastroUC.executar(
        req.body.email,
        String(req.body.codigo),
      );
      return res.status(200).json({ ok: true });
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      console.error("[user/confirmarCodigoCadastro]", erro);
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      exigirCampos(req.body, ["id", "senha_atual", "nova_senha"]);
      const resultado = await this.changePasswordUC.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError)
        return res
          .status(erro.statusCode)
          .json({ status: "error", message: erro.message });
      return res
        .status(500)
        .json({ status: "error", message: "Erro interno no servidor." });
    }
  }
}
