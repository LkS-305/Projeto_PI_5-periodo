import {
  DeletarUsuarioUseCase,
  AtualizarUsuarioUseCase,
  PesquisarPorId,
  PesquisarPorEmail,
} from '../src/core/use-cases/usuario/UsuarioUseCase';
import { IUsuarioRepository } from '../src/core/repositories/IUsuarioRepository';
import { ResourceNotFoundError, ValidationError } from '../src/core/errors/AppError';
import { Usuario } from '../src/core/entities/Usuario';

const ID_VALIDO = '123e4567-e89b-12d3-a456-426614174000';
const USUARIO_MOCK = { user_id: ID_VALIDO, nome: 'Teste', score: 0 } as Usuario;

function makeRepo(overrides: Partial<Record<keyof IUsuarioRepository, jest.Mock>> = {}): IUsuarioRepository {
  return {
    create: jest.fn(),
    delete: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    findByUserId: jest.fn().mockResolvedValue(null),
    findByEmail: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as unknown as IUsuarioRepository;
}

describe('DeletarUsuarioUseCase', () => {
  it('deve chamar delete com o ID correto', async () => {
    const repo = makeRepo();
    const sut = new DeletarUsuarioUseCase(repo);

    await sut.executar(ID_VALIDO);

    expect(repo.delete).toHaveBeenCalledWith(ID_VALIDO);
  });

  it('deve lançar ValidationError para UUID inválido', async () => {
    const repo = makeRepo();
    const sut = new DeletarUsuarioUseCase(repo);

    await expect(sut.executar('id-invalido')).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('AtualizarUsuarioUseCase', () => {
  it('deve chamar update com o ID e dados corretos', async () => {
    const repo = makeRepo();
    const sut = new AtualizarUsuarioUseCase(repo);
    const dados = { nome: 'Novo Nome' };

    await sut.executar(ID_VALIDO, dados);

    expect(repo.update).toHaveBeenCalledWith(ID_VALIDO, dados);
  });

  it('deve lançar ValidationError para UUID inválido', async () => {
    const repo = makeRepo();
    const sut = new AtualizarUsuarioUseCase(repo);

    await expect(sut.executar('id-invalido', { nome: 'x' })).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('PesquisarPorId', () => {
  it('deve retornar o usuário quando encontrado', async () => {
    const repo = makeRepo({ findByUserId: jest.fn().mockResolvedValue(USUARIO_MOCK) });
    const sut = new PesquisarPorId(repo);

    const resultado = await sut.executar(ID_VALIDO);

    expect(resultado).toEqual(USUARIO_MOCK);
  });

  it('deve lançar ResourceNotFoundError quando não encontrado', async () => {
    const repo = makeRepo();
    const sut = new PesquisarPorId(repo);

    await expect(sut.executar(ID_VALIDO)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ValidationError para UUID inválido', async () => {
    const repo = makeRepo();
    const sut = new PesquisarPorId(repo);

    await expect(sut.executar('id-invalido')).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('PesquisarPorEmail', () => {
  it('deve retornar o usuário quando encontrado pelo e-mail', async () => {
    const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(USUARIO_MOCK) });
    const sut = new PesquisarPorEmail(repo);

    const resultado = await sut.executar('teste@email.com');

    expect(resultado).toEqual(USUARIO_MOCK);
  });

  it('deve lançar ResourceNotFoundError quando e-mail não encontrado', async () => {
    const repo = makeRepo();
    const sut = new PesquisarPorEmail(repo);

    await expect(sut.executar('naoexiste@email.com')).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ValidationError para e-mail inválido', async () => {
    const repo = makeRepo();
    const sut = new PesquisarPorEmail(repo);

    await expect(sut.executar('email-invalido')).rejects.toBeInstanceOf(ValidationError);
  });
});
