import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';
import { RegisterDto, LoginDto } from '../../dtos/user';
import {
  ResourceAlreadyExistsError,
  UnauthorizedError,
  ValidationError,
} from '../../errors/AppError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimal interface — the in-memory repo only needs register/findByEmail for these use cases
export interface IAutenticacaoRepository {
  register(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export class RegisterUseCase {
  constructor(
    private autenticacaoRepository: IAutenticacaoRepository,
    private userRepository: IUserRepository,
  ) {}

  async executar(dados: RegisterDto): Promise<Omit<User, 'senha'> | null> {
    if (!EMAIL_REGEX.test(dados.email)) {
      throw new ValidationError('E-mail inválido.');
    }

    const usuarioExiste = await this.userRepository.findByEmail(dados.email);
    if (usuarioExiste) {
      throw new ResourceAlreadyExistsError('Este e-mail já está cadastrado.');
    }

    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
    const novoUser = new User({ ...dados, senha: senhaCriptografada });

    await this.autenticacaoRepository.register(novoUser);

    const { senha, ...semSenha } = novoUser;
    return semSenha as Omit<User, 'senha'>;
  }
}

export class LoginUseCase {
  constructor(
    private autenticacaoRepository: IAutenticacaoRepository,
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
      { id: usuario.id },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '1d' },
    );

    const { senha, ...semSenha } = usuario;
    return { token, user: semSenha as Omit<User, 'senha'> };
  }
}
