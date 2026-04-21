import {
  CriarPrestadorUseCase,
  DeletarPrestadorUseCase,
  AtualizarPrestadorUseCase,
  AcharPorUserId,
} from '../src/core/use-cases/prestador/PrestadorUseCase';
import { IPrestadorRepository } from '../src/core/repositories/IPrestadorRepository';
import { IUserRepository } from '../src/core/repositories/IUserRepository';
import { ResourceNotFoundError, ValidationError } from '../src/core/errors/AppError';
import { Prestador } from '../src/core/entities/Prestador';
import { User } from '../src/core/entities/User';

const USER_ID_VALIDO = '123e4567-e89b-12d3-a456-426614174000';
const USER_MOCK = new User({ email: 'user@teste.com', senha: 'hash', cpf: '123' }, USER_ID_VALIDO);
const PRESTADOR_MOCK = new Prestador({ user_id: USER_ID_VALIDO, nome: 'João Silva', bio: 'Eletricista experiente', score: 0 });

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
    delete: jest.fn(),
    update: jest.fn(),
    findByEmail: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as unknown as IUserRepository;
}

describe('CriarPrestadorUseCase', () => {
  it('deve criar um prestador quando o usuário existe', async () => {
    const userRepo = makeUserRepo({ findById: jest.fn().mockResolvedValue(USER_MOCK) });
    const prestadorRepo = makePrestadorRepo();
    const sut = new CriarPrestadorUseCase(userRepo, prestadorRepo);

    const resultado = await sut.executar({
      user_id: USER_ID_VALIDO,
      nome: 'João Silva',
      bio: 'Eletricista experiente',
      score: 0,
    });

    expect(resultado).toEqual(PRESTADOR_MOCK);
    expect(prestadorRepo.create).toHaveBeenCalled();
  });

  it('deve lançar ResourceNotFoundError quando o usuário não existe', async () => {
    const userRepo = makeUserRepo();
    const prestadorRepo = makePrestadorRepo();
    const sut = new CriarPrestadorUseCase(userRepo, prestadorRepo);

    await expect(
      sut.executar({ user_id: USER_ID_VALIDO, nome: 'João Silva', bio: 'Eletricista experiente', score: 0 })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ValidationError para UUID inválido', async () => {
    const userRepo = makeUserRepo();
    const prestadorRepo = makePrestadorRepo();
    const sut = new CriarPrestadorUseCase(userRepo, prestadorRepo);

    await expect(
      sut.executar({ user_id: 'id-invalido', nome: 'João', bio: 'Bio válida aqui', score: 0 })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('DeletarPrestadorUseCase', () => {
  it('deve deletar um prestador existente', async () => {
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new DeletarPrestadorUseCase(prestadorRepo);

    await sut.executar(USER_ID_VALIDO);

    expect(prestadorRepo.delete).toHaveBeenCalledWith(USER_ID_VALIDO);
  });

  it('deve lançar ResourceNotFoundError quando o prestador não existe', async () => {
    const prestadorRepo = makePrestadorRepo();
    const sut = new DeletarPrestadorUseCase(prestadorRepo);

    await expect(sut.executar(USER_ID_VALIDO)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ValidationError para UUID inválido', async () => {
    const prestadorRepo = makePrestadorRepo();
    const sut = new DeletarPrestadorUseCase(prestadorRepo);

    await expect(sut.executar('id-invalido')).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('AcharPorUserId', () => {
  it('deve retornar o prestador quando encontrado', async () => {
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new AcharPorUserId(prestadorRepo);

    const resultado = await sut.executar(USER_ID_VALIDO);

    expect(resultado).toEqual(PRESTADOR_MOCK);
  });

  it('deve lançar ResourceNotFoundError quando não encontrado', async () => {
    const prestadorRepo = makePrestadorRepo();
    const sut = new AcharPorUserId(prestadorRepo);

    await expect(sut.executar(USER_ID_VALIDO)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

describe('AtualizarPrestadorUseCase', () => {
  it('deve atualizar um prestador existente', async () => {
    const prestadorExistente = new Prestador({ user_id: USER_ID_VALIDO, nome: 'Antigo', bio: 'Bio antiga válida', score: 0 });
    const prestadorRepo = makePrestadorRepo({
      findByUserId: jest.fn().mockResolvedValue(prestadorExistente),
      update: jest.fn().mockResolvedValue(prestadorExistente),
    });
    const sut = new AtualizarPrestadorUseCase(prestadorRepo);

    const resultado = await sut.executar({ user_id: USER_ID_VALIDO, nome: 'Novo Nome' });

    expect(resultado).toBeTruthy();
    expect(prestadorRepo.update).toHaveBeenCalled();
  });

  it('deve lançar ResourceNotFoundError quando o prestador não existe', async () => {
    const prestadorRepo = makePrestadorRepo();
    const sut = new AtualizarPrestadorUseCase(prestadorRepo);

    await expect(
      sut.executar({ user_id: USER_ID_VALIDO, nome: 'Nome' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
