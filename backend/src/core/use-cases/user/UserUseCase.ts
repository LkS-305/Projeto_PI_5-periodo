import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUsuarioRepository } from "../../repositories/IUsuarioRepository";
import { User } from "../../entities/User";
import { Usuario } from "../../entities/Usuario";
import {
  RegisterDto,
  LoginDto,
  ChangeForgotPasswordDto,
  ChangePasswordDto,
} from "../../dtos/user";
import {
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../errors/AppError";
import { IMailProvider } from "../../dtos/mail";
import { IVerificacaoEmailCadastroRepository } from "../../repositories/IVerificacaoEmailCadastroRepository";
import { validarUUID } from "../../utils/validate";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private usuarioRepository: IUsuarioRepository,
  ) {}

  /** Nome inicial do perfil (tabela `usuarios`) até o utilizador completar o cadastro. */
  private nomeProvisorioDoEmail(email: string): string {
    const local = email.split("@")[0]?.trim() ?? "";
    const base = local.length > 0 ? local : "Usuário";
    return base.length > 200 ? base.slice(0, 200) : base;
  }

  async executar(
    dados: RegisterDto,
  ): Promise<{ token: string; user: Omit<User, "senha"> | null }> {
    if (!EMAIL_REGEX.test(dados.email)) {
      throw new ValidationError("E-mail inválido.");
    }

    const usuarioExiste = await this.userRepository.findByEmail(dados.email);

    if (usuarioExiste) {
      throw new ResourceAlreadyExistsError("Este e-mail já está cadastrado.");
    }
    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
    const novoUser = new User({ ...dados, senha: senhaCriptografada });
    await this.userRepository.register(novoUser);

    const perfilJaExiste = await this.usuarioRepository.findByUserId(
      novoUser.id,
    );
    if (!perfilJaExiste) {
      const perfil = new Usuario({
        user_id: novoUser.id,
        nome: this.nomeProvisorioDoEmail(dados.email),
        telefone: undefined,
      });
      await this.usuarioRepository.create(perfil);
    }

    const { senha, ...UsersemSenha } = novoUser;
    const token = jwt.sign(
      { id: novoUser.id, tipo: "User" },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "1d" },
    );
    return { token, user: UsersemSenha as Omit<User, "senha"> };
  }
}

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async executar(
    dados: LoginDto,
  ): Promise<{ token: string; user: Omit<User, "senha"> }> {
    const usuario = await this.userRepository.findByEmail(dados.email);

    if (!usuario) {
      throw new UnauthorizedError("E-mail ou senha incorretos.");
    }

    const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedError("E-mail ou senha incorretos.");
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: "User" },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "1d" },
    );

    const { senha, ...semSenha } = usuario;
    return { token, user: semSenha as Omit<User, "senha"> };
  }
}

export class DeletarUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async executar(id: string): Promise<boolean> {
    validarUUID(id, "ID do user");
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError("User");
    }

    await this.userRepository.delete(id);
    return true;
  }
}

export class AcharPorEmail {
  constructor(private userRepository: IUserRepository) {}

  async executar(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ResourceNotFoundError("User");
    }
    return user;
  }
}

export class VerificarEmailExiste {
  constructor(private userRepository: IUserRepository) {}

  async executar(email: string): Promise<{ existe: boolean }> {
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("E-mail inválido.");
    }
    const user = await this.userRepository.findByEmail(email);
    return { existe: !!user };
  }
}

export class AcharPorId {
  constructor(private userRepository: IUserRepository) {}

  async executar(id: string): Promise<User | null> {
    validarUUID(id, "ID do user");
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError("User");
    }
    return user;
  }
}

/** Envia código de 4 dígitos para verificação de e-mail antes de concluir o cadastro. */
export class EnviarCodigoVerificacaoCadastroUseCase {
  constructor(
    private userRepository: IUserRepository,
    private verificacaoRepo: IVerificacaoEmailCadastroRepository,
    private mailProvider: IMailProvider,
  ) {}

  async executar(email: string): Promise<void> {
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("E-mail inválido.");
    }
    const trimmed = email.trim();
    const user = await this.userRepository.findByEmail(trimmed);
    if (user) {
      throw new ResourceAlreadyExistsError("Este e-mail já está cadastrado.");
    }
    const codigo = Math.floor(1000 + Math.random() * 9000).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000);
    await this.verificacaoRepo.upsert(trimmed, codigo, expira);
    await this.mailProvider.sendMail({
      to: trimmed,
      subject: "Código de verificação — DOMI",
      body: `Seu código de verificação é: <b>${codigo}</b>. Ele expira em 15 minutos.`,
    });
  }
}

export class ConfirmarCodigoVerificacaoCadastroUseCase {
  constructor(private verificacaoRepo: IVerificacaoEmailCadastroRepository) {}

  async executar(email: string, codigo: string): Promise<void> {
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("E-mail inválido.");
    }
    const trimmed = email.trim();
    const row = await this.verificacaoRepo.findByEmail(trimmed);
    if (!row) {
      throw new ValidationError("Solicite um novo código de verificação.");
    }
    if (new Date() > new Date(row.expira_em)) {
      await this.verificacaoRepo.deleteByEmail(trimmed);
      throw new ValidationError("O código expirou. Volte e solicite um novo.");
    }
    if (row.codigo !== codigo.trim()) {
      throw new ValidationError("Código inválido.");
    }
    await this.verificacaoRepo.deleteByEmail(trimmed);
  }
}

export class ForgotPassword {
  constructor(
    private userRepository: IUserRepository,
    private mailProvider: IMailProvider,
  ) {}

  async executar(email: string) {
    const trimmed = email.trim();
    const usuario = await this.userRepository.findByEmail(trimmed);
    if (!usuario) return;

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracao = new Date(Date.now() + 30 * 60000);

    await this.userRepository.updateRecoveryToken(
      usuario.id,
      codigo,
      expiracao,
    );

    await this.mailProvider.sendMail({
      to: trimmed,
      subject: "Recuperação de senha — DOMI",
      body: `Seu código de recuperação (6 dígitos) é: <b>${codigo}</b>. Ele expira em 30 minutos.`,
    });
  }
}

export class ChangeForgotPassword {
  constructor(private userRepository: IUserRepository) {}

  async executar(props: ChangeForgotPasswordDto): Promise<void> {
    const usuario = await this.userRepository.findByEmail(props.email.trim());

    if (
      !usuario ||
      !usuario.recovery_token ||
      usuario.recovery_token !== props.codigo.trim()
    ) {
      throw new ValidationError("Código inválido ou e-mail incorreto.");
    }

    if (
      usuario.recovery_token_expires &&
      new Date() > new Date(usuario.recovery_token_expires)
    ) {
      throw new ValidationError(
        "O código de recuperação expirou. Solicite um novo.",
      );
    }

    const senhaHashed = await bcrypt.hash(props.nova_senha, 10);
    await this.userRepository.changePassword(usuario.id, senhaHashed);
    await this.userRepository.updateRecoveryToken(usuario.id, null, null);
  }
}

export class ChangePassword {
  constructor(private userRepository: IUserRepository) {}

  async executar(props: ChangePasswordDto) {
    const usuario = await this.userRepository.findById(props.id);
    if (!usuario) throw new Error("Usuário não encontrado");

    // CORREÇÃO: Comparar hash em vez de string pura
    const senhaValida = await bcrypt.compare(props.senha_atual, usuario.senha);
    if (!senhaValida) {
      throw new Error("Senha atual não compatível");
    }

    // CORREÇÃO: Gerar hash da nova senha antes de mandar pro banco
    const novaSenhaHash = await bcrypt.hash(props.nova_senha, 10);
    await this.userRepository.changePassword(usuario.id, novaSenhaHash);
  }
}
