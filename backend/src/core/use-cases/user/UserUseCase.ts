import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';
import { RegisterDto, LoginDto, ChangeForgotPasswordDto, ChangePasswordDto } from '../../dtos/user';
import {
  ResourceAlreadyExistsError,
  UnauthorizedError,
  ValidationError,
} from '../../errors/AppError';
import { IMailProvider } from '../../dtos/mail';  

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
  ) {}

  async executar(dados: RegisterDto): Promise<{token: string, user: Omit<User, 'senha'> | null}> {
    if (!EMAIL_REGEX.test(dados.email)) {
      throw new ValidationError('E-mail inválido.');
    }

    const usuarioExiste = await this.userRepository.findByEmail(dados.email);
    
    if (usuarioExiste) {
      throw new ResourceAlreadyExistsError('Este e-mail já está cadastrado.');
    }
    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
    const novoUser = new User({ ...dados, senha: senhaCriptografada });
    console.log('entidade criada:', novoUser);
    await this.userRepository.register(novoUser);

    const { senha, ...UsersemSenha } = novoUser;
    const token = jwt.sign(
      { id: novoUser.id,
        tipo: 'User'  },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '1d' },
    );
    console.log('Criei com sucesso: ', UsersemSenha);
    return { token, user: UsersemSenha as Omit<User, 'senha'>};

  }
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
  ) {}

  async executar(dados: LoginDto): Promise<{ token: string; user: Omit<User, 'senha'> }> {
    const usuario = await this.userRepository.findByEmail(dados.email);

    if (!usuario) {
      throw new UnauthorizedError('E-mail ou senha incorretos.');
    }

    const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedError('E-mail ou senha incorretos.');
    }

    const token = jwt.sign(
      { id: usuario.id,
        tipo: 'User' },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '1d' },
    );

    const { senha, ...semSenha } = usuario;
    return { token, user: semSenha as Omit<User, 'senha'> };
  }
}

export class ForgotPassword {
  constructor(
    private userRepository: IUserRepository,
    private mailProvider: IMailProvider,
  ) {}

  async executar(email: string) {
    const usuario = await this.userRepository.findByEmail(email);
    if (!usuario) return;

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracao = new Date(Date.now() + 30 * 60000);

    await this.userRepository.updateRecoveryToken(
      usuario.id,
      codigo,
      expiracao,
    );

    // Envia o e-mail de fato
    await this.mailProvider.sendMail({
      to: email,
      subject: "Recuperação de Senha - Projeto PI",
      body: `Seu código de recuperação é: <b>${codigo}</b>. Ele expira em 30 minutos.`,
    });
  }
}

export class ChangeForgotPassword {
  // Injetamos apenas o Repositório, pois o e-mail já foi enviado na etapa anterior
  constructor(private userRepository: IUserRepository) {}

  async executar(props: ChangeForgotPasswordDto): Promise<void> {
    // 1. Busca o usuário pelo e-mail
    const usuario = await this.userRepository.findByEmail(props.email);

    // 2. Validações de segurança
    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    if (!usuario.recovery_token || usuario.recovery_token !== props.codigo) {
      throw new Error("Código de verificação inválido.");
    }

    // 3. Valida se o código expirou (comparando com a data atual do seu Kali)
    if (
      usuario.recovery_token_expires &&
      new Date() > usuario.recovery_token_expires
    ) {
      throw new Error("O código de recuperação expirou. Solicite um novo.");
    }

    // 4. Criptografa a nova senha antes de salvar
    // Nunca salve a senha em texto limpo no Postgres!
    const saltRounds = 10;
    const senhaHashed = await bcrypt.hash(props.nova_senha, saltRounds);

    // 5. Persistência dos dados
    await this.userRepository.changePassword(usuario.id, senhaHashed);

    // 6. Limpeza (Segurança): invalida o código para que ele não possa ser usado de novo
    await this.userRepository.updateRecoveryToken(usuario.id, null, null);

    console.log(`[AUTH] Senha alterada com sucesso para: ${props.email}`);
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
