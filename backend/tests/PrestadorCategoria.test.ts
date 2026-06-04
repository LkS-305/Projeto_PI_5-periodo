import {
  AdicionarCategoriaUseCase,
  RemoverCategoriaUseCase,
  ListarCategoriasDoPrestadorUseCase,
  ListarPrestadoresPorCategoriaUseCase,
} from '../src/core/use-cases/prestador/PrestadorCategoriaUseCase';
import { IPrestadorCategoriaRepository } from '../src/core/repositories/IPrestadorCategoriaRepository';
import { IPrestadorRepository } from '../src/core/repositories/IPrestadorRepository';
import { ICategoriaRepository } from '../src/core/repositories/ICategoriaRepository';
import { Prestador } from '../src/core/entities/Prestador';
import { Categoria } from '../src/core/entities/Categoria';
import { AppError, ResourceNotFoundError } from '../src/core/errors/AppError';

const UUID_VALIDO = '123e4567-e89b-12d3-a456-426614174000';
const UUID_CATEGORIA = '223e4567-e89b-12d3-a456-426614174001';

const PRESTADOR_MOCK = new Prestador({ user_id: UUID_VALIDO, nome: 'João Silva', bio: 'Eletricista experiente com 5 anos' });
const CATEGORIA_MOCK = new Categoria({ nome: 'Elétrica', slug: 'eletrica', icon_url: 'icone.png' });

function makePrestadorCategoriaRepo(
  overrides: Partial<Record<keyof IPrestadorCategoriaRepository, jest.Mock>> = {},
): IPrestadorCategoriaRepository {
  return {
    adicionar: jest.fn().mockResolvedValue(undefined),
    remover: jest.fn().mockResolvedValue(undefined),
    listarPorPrestador: jest.fn().mockResolvedValue([]),
    listarPrestadoresPorCategoria: jest.fn().mockResolvedValue([]),
    ...overrides,
  } as unknown as IPrestadorCategoriaRepository;
}

function makePrestadorRepo(
  overrides: Partial<Record<keyof IPrestadorRepository, jest.Mock>> = {},
): IPrestadorRepository {
  return {
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findById: jest.fn().mockResolvedValue(null),
    findByUserId: jest.fn().mockResolvedValue(null),
    listByCategory: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as unknown as IPrestadorRepository;
}

function makeCategoriaRepo(
  overrides: Partial<Record<keyof ICategoriaRepository, jest.Mock>> = {},
): ICategoriaRepository {
  return {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    findByName: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as unknown as ICategoriaRepository;
}

// ─── AdicionarCategoriaUseCase ───────────────────────────────────────────────

describe('AdicionarCategoriaUseCase', () => {
  it('deve associar uma categoria a um prestador com sucesso', async () => {
    const pcRepo = makePrestadorCategoriaRepo();
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const categoriaRepo = makeCategoriaRepo({ findById: jest.fn().mockResolvedValue(CATEGORIA_MOCK) });
    const sut = new AdicionarCategoriaUseCase(pcRepo, prestadorRepo, categoriaRepo);

    await sut.executar(UUID_VALIDO, UUID_CATEGORIA);

    expect(pcRepo.adicionar).toHaveBeenCalledWith(UUID_VALIDO, UUID_CATEGORIA);
  });

  it('deve lançar ResourceNotFoundError quando o prestador não existe', async () => {
    const sut = new AdicionarCategoriaUseCase(
      makePrestadorCategoriaRepo(),
      makePrestadorRepo(),
      makeCategoriaRepo(),
    );

    await expect(sut.executar(UUID_VALIDO, UUID_CATEGORIA)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar ResourceNotFoundError quando a categoria não existe', async () => {
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new AdicionarCategoriaUseCase(
      makePrestadorCategoriaRepo(),
      prestadorRepo,
      makeCategoriaRepo(),
    );

    await expect(sut.executar(UUID_VALIDO, UUID_CATEGORIA)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar AppError quando o prestador já possui 5 categorias', async () => {
    const cincoCategoria = Array(5).fill(CATEGORIA_MOCK);
    const pcRepo = makePrestadorCategoriaRepo({
      listarPorPrestador: jest.fn().mockResolvedValue(cincoCategoria),
    });
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const categoriaRepo = makeCategoriaRepo({ findById: jest.fn().mockResolvedValue(CATEGORIA_MOCK) });
    const sut = new AdicionarCategoriaUseCase(pcRepo, prestadorRepo, categoriaRepo);

    await expect(sut.executar(UUID_VALIDO, UUID_CATEGORIA)).rejects.toBeInstanceOf(AppError);
  });

  it('não deve lançar erro quando o prestador tem exatamente 4 categorias', async () => {
    const quatroCategoria = Array(4).fill(CATEGORIA_MOCK);
    const pcRepo = makePrestadorCategoriaRepo({
      listarPorPrestador: jest.fn().mockResolvedValue(quatroCategoria),
    });
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const categoriaRepo = makeCategoriaRepo({ findById: jest.fn().mockResolvedValue(CATEGORIA_MOCK) });
    const sut = new AdicionarCategoriaUseCase(pcRepo, prestadorRepo, categoriaRepo);

    await expect(sut.executar(UUID_VALIDO, UUID_CATEGORIA)).resolves.not.toThrow();
    expect(pcRepo.adicionar).toHaveBeenCalled();
  });
});

// ─── RemoverCategoriaUseCase ─────────────────────────────────────────────────

describe('RemoverCategoriaUseCase', () => {
  it('deve remover uma categoria de um prestador com sucesso', async () => {
    const pcRepo = makePrestadorCategoriaRepo();
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new RemoverCategoriaUseCase(pcRepo, prestadorRepo);

    await sut.executar(UUID_VALIDO, UUID_CATEGORIA);

    expect(pcRepo.remover).toHaveBeenCalledWith(UUID_VALIDO, UUID_CATEGORIA);
  });

  it('deve lançar ResourceNotFoundError quando o prestador não existe', async () => {
    const sut = new RemoverCategoriaUseCase(makePrestadorCategoriaRepo(), makePrestadorRepo());

    await expect(sut.executar(UUID_VALIDO, UUID_CATEGORIA)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

// ─── ListarCategoriasDoPrestadorUseCase ─────────────────────────────────────

describe('ListarCategoriasDoPrestadorUseCase', () => {
  it('deve retornar as categorias associadas ao prestador', async () => {
    const categorias = [CATEGORIA_MOCK, new Categoria({ nome: 'Pintura', slug: 'pintura' })];
    const pcRepo = makePrestadorCategoriaRepo({
      listarPorPrestador: jest.fn().mockResolvedValue(categorias),
    });
    const sut = new ListarCategoriasDoPrestadorUseCase(pcRepo);

    const resultado = await sut.executar(UUID_VALIDO);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].nome).toBe('Elétrica');
    expect(pcRepo.listarPorPrestador).toHaveBeenCalledWith(UUID_VALIDO);
  });

  it('deve retornar lista vazia quando o prestador não tem categorias', async () => {
    const sut = new ListarCategoriasDoPrestadorUseCase(makePrestadorCategoriaRepo());

    const resultado = await sut.executar(UUID_VALIDO);

    expect(resultado).toEqual([]);
  });
});

// ─── ListarPrestadoresPorCategoriaUseCase ────────────────────────────────────

describe('ListarPrestadoresPorCategoriaUseCase', () => {
  it('deve retornar os prestadores de uma categoria', async () => {
    const prestadores = [PRESTADOR_MOCK, new Prestador({ user_id: UUID_VALIDO, nome: 'Maria Souza', bio: 'Pintora profissional há 3 anos' })];
    const pcRepo = makePrestadorCategoriaRepo({
      listarPrestadoresPorCategoria: jest.fn().mockResolvedValue(prestadores),
    });
    const sut = new ListarPrestadoresPorCategoriaUseCase(pcRepo);

    const resultado = await sut.executar(UUID_CATEGORIA);

    expect(resultado).toHaveLength(2);
    expect(pcRepo.listarPrestadoresPorCategoria).toHaveBeenCalledWith(UUID_CATEGORIA);
  });

  it('deve retornar lista vazia quando nenhum prestador está na categoria', async () => {
    const sut = new ListarPrestadoresPorCategoriaUseCase(makePrestadorCategoriaRepo());

    const resultado = await sut.executar(UUID_CATEGORIA);

    expect(resultado).toEqual([]);
  });
});
