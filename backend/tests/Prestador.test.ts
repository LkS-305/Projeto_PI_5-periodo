import {
  CriarPrestadorUseCase,
  DeletarPrestadorUseCase,
  AtualizarPrestadorUseCase,
  AcharPorUserId,
} from '../src/core/use-cases/prestador/PrestadorUseCase';
import { IPrestadorRepository } from '../src/core/repositories/IPrestadorRepository';
import { IUserRepository } from '../src/core/repositories/IUserRepository';
import {
  ResourceNotFoundError,
  ValidationError,
} from '../src/core/errors/AppError';
import { Prestador } from '../src/core/entities/Prestador';
import { User } from '../src/core/entities/User';

const UUID_VALIDO = '123e4567-e89b-12d3-a456-426614174000';
const USER_MOCK = new User({ email: 'user@teste.com', senha: 'hash', cpf: '12345678900', id: UUID_VALIDO });
const PRESTADOR_MOCK = new Prestador({ user_id: UUID_VALIDO, nome: 'João Silva', bio: 'Eletricista experiente com 5 anos' });

function makePrestadorRepo(overrides: Partial<Record<keyof IPrestadorRepository, jest.Mock>> = {}): IPrestadorRepository {
  return {
    create: jest.fn().mockResolvedValue(PRESTADOR_MOCK),
    delete: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    findByUserId: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as unknown as IPrestadorRepository;
}

function makeUserRepo(overrides: Partial<Record<keyof IUserRepository, jest.Mock>> = {}): IUserRepository {
  return {
    register: jest.fn(),
    login: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    updateRecoveryToken: jest.fn(),
    changePassword: jest.fn(),
    findByEmail: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as unknown as IUserRepository;
}

// ─── CriarPrestadorUseCase ───────────────────────────────────────────────────

describe('CriarPrestadorUseCase', () => {
  it('deve criar um prestador quando o usuário existe', async () => {
    const userRepo = makeUserRepo({ findById: jest.fn().mockResolvedValue(USER_MOCK) });
    const prestadorRepo = makePrestadorRepo();
    const sut = new CriarPrestadorUseCase(userRepo, prestadorRepo);

    const resultado = await sut.executar({
      user_id: UUID_VALIDO,
      nome: 'João Silva',
      bio: 'Eletricista experiente com 5 anos',
    });

    expect(resultado).toMatchObject({ user_id: UUID_VALIDO, nome: 'João Silva' });
    expect(prestadorRepo.create).toHaveBeenCalled();
  });

  it('deve lançar ResourceNotFoundError quando o usuário não existe', async () => {
    const sut = new CriarPrestadorUseCase(makeUserRepo(), makePrestadorRepo());

    await expect(
      sut.executar({ user_id: UUID_VALIDO, nome: 'João Silva', bio: 'Eletricista experiente com 5 anos' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ValidationError para ID vazio', async () => {
    const sut = new CriarPrestadorUseCase(makeUserRepo(), makePrestadorRepo());

    await expect(
      sut.executar({ user_id: '  ', nome: 'João', bio: 'Bio válida com texto suficiente' })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('deve lançar ValidationError para nome menor que 2 caracteres', async () => {
    const userRepo = makeUserRepo({ findById: jest.fn().mockResolvedValue(USER_MOCK) });
    const sut = new CriarPrestadorUseCase(userRepo, makePrestadorRepo());

    await expect(
      sut.executar({ user_id: UUID_VALIDO, nome: 'A', bio: 'Bio válida com texto suficiente' })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('deve lançar ValidationError para bio menor que 10 caracteres', async () => {
    const userRepo = makeUserRepo({ findById: jest.fn().mockResolvedValue(USER_MOCK) });
    const sut = new CriarPrestadorUseCase(userRepo, makePrestadorRepo());

    await expect(
      sut.executar({ user_id: UUID_VALIDO, nome: 'João Silva', bio: 'Curta' })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

// ─── DeletarPrestadorUseCase ─────────────────────────────────────────────────

describe('DeletarPrestadorUseCase', () => {
  it('deve deletar um prestador existente', async () => {
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new DeletarPrestadorUseCase(prestadorRepo);

    await sut.executar(UUID_VALIDO);

    expect(prestadorRepo.delete).toHaveBeenCalledWith(UUID_VALIDO);
  });

  it('deve lançar ResourceNotFoundError quando o prestador não existe', async () => {
    const sut = new DeletarPrestadorUseCase(makePrestadorRepo());

    await expect(sut.executar(UUID_VALIDO)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ValidationError para ID vazio', async () => {
    const sut = new DeletarPrestadorUseCase(makePrestadorRepo());

    await expect(sut.executar('')).rejects.toBeInstanceOf(ValidationError);
  });
});

// ─── AcharPorUserId ──────────────────────────────────────────────────────────

describe('AcharPorUserId', () => {
  it('deve retornar o prestador quando encontrado', async () => {
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new AcharPorUserId(prestadorRepo);

    const resultado = await sut.executar(UUID_VALIDO);

    expect(resultado).toEqual(PRESTADOR_MOCK);
  });

  it('deve lançar ResourceNotFoundError quando não encontrado', async () => {
    const sut = new AcharPorUserId(makePrestadorRepo());

    await expect(sut.executar(UUID_VALIDO)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ValidationError para ID vazio', async () => {
    const sut = new AcharPorUserId(makePrestadorRepo());

    await expect(sut.executar('  ')).rejects.toBeInstanceOf(ValidationError);
  });
});

// ─── AtualizarPrestadorUseCase ───────────────────────────────────────────────

describe('AtualizarPrestadorUseCase', () => {
  it('deve atualizar nome e bio de um prestador existente', async () => {
    const prestadorExistente = new Prestador({ user_id: UUID_VALIDO, nome: 'Nome Antigo', bio: 'Bio antiga mas válida aqui' });
    const prestadorRepo = makePrestadorRepo({
      findByUserId: jest.fn().mockResolvedValue(prestadorExistente),
      update: jest.fn().mockResolvedValue(undefined),
    });
    const sut = new AtualizarPrestadorUseCase(prestadorRepo);

    const resultado = await sut.executar({ user_id: UUID_VALIDO, nome: 'Nome Novo', bio: 'Bio nova e bem descritiva' });

    expect(resultado.nome).toBe('Nome Novo');
    expect(resultado.bio).toBe('Bio nova e bem descritiva');
    expect(prestadorRepo.update).toHaveBeenCalled();
  });

  it('deve lançar ResourceNotFoundError quando o prestador não existe', async () => {
    const sut = new AtualizarPrestadorUseCase(makePrestadorRepo());

    await expect(
      sut.executar({ user_id: UUID_VALIDO, nome: 'Nome' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ValidationError para nome menor que 2 caracteres', async () => {
    const prestadorExistente = new Prestador({ user_id: UUID_VALIDO, nome: 'Nome Antigo', bio: 'Bio antiga mas válida aqui' });
    const prestadorRepo = makePrestadorRepo({
      findByUserId: jest.fn().mockResolvedValue(prestadorExistente),
    });
    const sut = new AtualizarPrestadorUseCase(prestadorRepo);

    await expect(
      sut.executar({ user_id: UUID_VALIDO, nome: 'A' })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('deve lançar ValidationError para bio menor que 10 caracteres', async () => {
    const prestadorExistente = new Prestador({ user_id: UUID_VALIDO, nome: 'Nome Antigo', bio: 'Bio antiga mas válida aqui' });
    const prestadorRepo = makePrestadorRepo({
      findByUserId: jest.fn().mockResolvedValue(prestadorExistente),
    });
    const sut = new AtualizarPrestadorUseCase(prestadorRepo);

    await expect(
      sut.executar({ user_id: UUID_VALIDO, bio: 'Curta' })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('deve lançar ValidationError para ID vazio', async () => {
    const sut = new AtualizarPrestadorUseCase(makePrestadorRepo());

    await expect(
      sut.executar({ user_id: '', nome: 'Nome' })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
