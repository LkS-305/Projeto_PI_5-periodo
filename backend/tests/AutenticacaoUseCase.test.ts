import { RegisterUseCase, LoginUseCase } from '../src/core/use-cases/autenticacao/AutenticacaoUseCase';
import { InMemoryAutenticacaoRepository } from './repositories/InMemoryAutenticacaoRepository';
import { IUserRepository } from '../src/core/repositories/IUserRepository';
import { ResourceAlreadyExistsError, UnauthorizedError, ValidationError } from '../src/core/errors/AppError';
import { User } from '../src/core/entities/User';
import bcrypt from 'bcrypt';

function makeUserRepo(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return {
    delete: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    findByEmail: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as IUserRepository;
}

describe('RegisterUseCase', () => {
  it('deve registrar um novo usuário e retornar os dados sem a senha', async () => {
    const authRepo = new InMemoryAutenticacaoRepository();
    const userRepo = makeUserRepo();
    const sut = new RegisterUseCase(authRepo, userRepo);

    const resultado = await sut.executar({ email: 'novo@teste.com', senha: 'senha123', cpf: '12345678900' });

    expect(resultado).not.toBeNull();
    expect(resultado).not.toHaveProperty('senha');
    expect(resultado!.email).toBe('novo@teste.com');
  });

  it('deve lançar ResourceAlreadyExistsError se o e-mail já estiver cadastrado', async () => {
    const usuarioExistente = new User({ email: 'existente@teste.com', senha: 'hash', cpf: '000' });
    const authRepo = new InMemoryAutenticacaoRepository();
    const userRepo = makeUserRepo({ findByEmail: jest.fn().mockResolvedValue(usuarioExistente) });
    const sut = new RegisterUseCase(authRepo, userRepo);

    await expect(
      sut.executar({ email: 'existente@teste.com', senha: 'nova12345', cpf: '111' })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it('deve lançar ValidationError para e-mail com formato inválido', async () => {
    const authRepo = new InMemoryAutenticacaoRepository();
    const userRepo = makeUserRepo();
    const sut = new RegisterUseCase(authRepo, userRepo);

    await expect(
      sut.executar({ email: 'email-invalido', senha: 'senha123', cpf: '999' })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('LoginUseCase', () => {
  it('deve retornar token ao fazer login com credenciais válidas', async () => {
    const senhaHash = await bcrypt.hash('senha123', 10);
    const usuario = new User({ email: 'login@teste.com', senha: senhaHash, cpf: '123' });
    const authRepo = new InMemoryAutenticacaoRepository();
    const userRepo = makeUserRepo({ findByEmail: jest.fn().mockResolvedValue(usuario) });
    const sut = new LoginUseCase(authRepo, userRepo);

    const resultado = await sut.executar({ email: 'login@teste.com', senha: 'senha123' });

    expect(resultado).toHaveProperty('token');
    expect(resultado.user.email).toBe('login@teste.com');
  });

  it('deve lançar UnauthorizedError para senha incorreta', async () => {
    const senhaHash = await bcrypt.hash('correta', 10);
    const usuario = new User({ email: 'errado@teste.com', senha: senhaHash, cpf: '456' });
    const authRepo = new InMemoryAutenticacaoRepository();
    const userRepo = makeUserRepo({ findByEmail: jest.fn().mockResolvedValue(usuario) });
    const sut = new LoginUseCase(authRepo, userRepo);

    await expect(
      sut.executar({ email: 'errado@teste.com', senha: 'incorreta' })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('deve lançar UnauthorizedError para e-mail não cadastrado', async () => {
    const authRepo = new InMemoryAutenticacaoRepository();
    const userRepo = makeUserRepo();
    const sut = new LoginUseCase(authRepo, userRepo);

    await expect(
      sut.executar({ email: 'naoexiste@teste.com', senha: 'qualquer' })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
