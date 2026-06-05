import {
  AdicionarItemPortfolioUseCase,
  DeletarItemPortfolioUseCase,
  ListarPortfolioPorPrestadorUseCase,
  ReordenarPortfolioUseCase,
} from '../src/core/use-cases/portfolio/PortfolioUseCase';
import { IPortfolioRepository, PortfolioItem } from '../src/core/repositories/IPortfolioRepository';
import { IPrestadorRepository } from '../src/core/repositories/IPrestadorRepository';
import { Prestador } from '../src/core/entities/Prestador';
import { AppError, ResourceNotFoundError } from '../src/core/errors/AppError';

const UUID_PRESTADOR = '123e4567-e89b-12d3-a456-426614174000';
const UUID_ITEM      = '223e4567-e89b-12d3-a456-426614174001';

const PRESTADOR_MOCK = new Prestador({
  user_id: UUID_PRESTADOR,
  nome: 'João Silva',
  bio: 'Eletricista experiente com 5 anos',
});

const ITEM_MOCK: PortfolioItem = {
  id: UUID_ITEM,
  prestador_id: UUID_PRESTADOR,
  url: '/uploads/portfolio/foto.jpg',
  tipo: 'imagem',
  ordem: 0,
};

function makePortfolioRepo(
  overrides: Partial<Record<keyof IPortfolioRepository, jest.Mock>> = {},
): IPortfolioRepository {
  return {
    create: jest.fn().mockResolvedValue(ITEM_MOCK),
    delete: jest.fn().mockResolvedValue(ITEM_MOCK.url),
    findById: jest.fn().mockResolvedValue(null),
    findByPrestadorId: jest.fn().mockResolvedValue([]),
    reordenar: jest.fn().mockResolvedValue(undefined),
    countByPrestadorId: jest.fn().mockResolvedValue(0),
    ...overrides,
  } as unknown as IPortfolioRepository;
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

// ─── AdicionarItemPortfolioUseCase ───────────────────────────────────────────

describe('AdicionarItemPortfolioUseCase', () => {
  it('deve adicionar um item ao portfólio com sucesso', async () => {
    const portfolioRepo = makePortfolioRepo();
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new AdicionarItemPortfolioUseCase(portfolioRepo, prestadorRepo);

    const resultado = await sut.executar({
      prestador_id: UUID_PRESTADOR,
      url: '/uploads/portfolio/foto.jpg',
      tipo: 'imagem',
    });

    expect(resultado).toMatchObject({ prestador_id: UUID_PRESTADOR, tipo: 'imagem' });
    expect(portfolioRepo.create).toHaveBeenCalled();
  });

  it('deve definir a ordem do novo item como o total atual de itens', async () => {
    const portfolioRepo = makePortfolioRepo({ countByPrestadorId: jest.fn().mockResolvedValue(3) });
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new AdicionarItemPortfolioUseCase(portfolioRepo, prestadorRepo);

    await sut.executar({ prestador_id: UUID_PRESTADOR, url: '/foto.jpg', tipo: 'imagem' });

    const chamada = (portfolioRepo.create as jest.Mock).mock.calls[0][0];
    expect(chamada.ordem).toBe(3);
  });

  it('deve lançar ResourceNotFoundError quando o prestador não existe', async () => {
    const sut = new AdicionarItemPortfolioUseCase(makePortfolioRepo(), makePrestadorRepo());

    await expect(
      sut.executar({ prestador_id: UUID_PRESTADOR, url: '/foto.jpg', tipo: 'imagem' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar AppError quando o portfólio já tem 10 itens', async () => {
    const portfolioRepo = makePortfolioRepo({ countByPrestadorId: jest.fn().mockResolvedValue(10) });
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new AdicionarItemPortfolioUseCase(portfolioRepo, prestadorRepo);

    await expect(
      sut.executar({ prestador_id: UUID_PRESTADOR, url: '/foto.jpg', tipo: 'imagem' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve lançar erro quando o portfólio tem exatamente 9 itens', async () => {
    const portfolioRepo = makePortfolioRepo({ countByPrestadorId: jest.fn().mockResolvedValue(9) });
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new AdicionarItemPortfolioUseCase(portfolioRepo, prestadorRepo);

    await expect(
      sut.executar({ prestador_id: UUID_PRESTADOR, url: '/foto.jpg', tipo: 'imagem' }),
    ).resolves.not.toThrow();
  });

  it('deve aceitar item do tipo vídeo', async () => {
    const portfolioRepo = makePortfolioRepo({
      create: jest.fn().mockResolvedValue({ ...ITEM_MOCK, tipo: 'video' }),
    });
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new AdicionarItemPortfolioUseCase(portfolioRepo, prestadorRepo);

    const resultado = await sut.executar({ prestador_id: UUID_PRESTADOR, url: '/video.mp4', tipo: 'video' });

    expect(resultado.tipo).toBe('video');
  });
});

// ─── DeletarItemPortfolioUseCase ─────────────────────────────────────────────

describe('DeletarItemPortfolioUseCase', () => {
  it('deve deletar o item e retornar a URL do arquivo', async () => {
    const portfolioRepo = makePortfolioRepo({ findById: jest.fn().mockResolvedValue(ITEM_MOCK) });
    const sut = new DeletarItemPortfolioUseCase(portfolioRepo);

    const url = await sut.executar(UUID_ITEM, UUID_PRESTADOR);

    expect(url).toBe(ITEM_MOCK.url);
    expect(portfolioRepo.delete).toHaveBeenCalledWith(UUID_ITEM);
  });

  it('deve lançar ResourceNotFoundError quando o item não existe', async () => {
    const sut = new DeletarItemPortfolioUseCase(makePortfolioRepo());

    await expect(sut.executar(UUID_ITEM, UUID_PRESTADOR)).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('deve lançar AppError quando o prestador não é dono do item', async () => {
    const itemDeOutro = { ...ITEM_MOCK, prestador_id: 'outro-prestador-id' };
    const portfolioRepo = makePortfolioRepo({ findById: jest.fn().mockResolvedValue(itemDeOutro) });
    const sut = new DeletarItemPortfolioUseCase(portfolioRepo);

    const erro = await sut.executar(UUID_ITEM, UUID_PRESTADOR).catch(e => e);

    expect(erro).toBeInstanceOf(AppError);
    expect(erro.statusCode).toBe(403);
  });
});

// ─── ListarPortfolioPorPrestadorUseCase ──────────────────────────────────────

describe('ListarPortfolioPorPrestadorUseCase', () => {
  it('deve retornar os itens do portfólio ordenados', async () => {
    const itens: PortfolioItem[] = [
      { ...ITEM_MOCK, id: 'a', ordem: 0 },
      { ...ITEM_MOCK, id: 'b', ordem: 1 },
    ];
    const portfolioRepo = makePortfolioRepo({ findByPrestadorId: jest.fn().mockResolvedValue(itens) });
    const sut = new ListarPortfolioPorPrestadorUseCase(portfolioRepo);

    const resultado = await sut.executar(UUID_PRESTADOR);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].ordem).toBe(0);
    expect(resultado[1].ordem).toBe(1);
  });

  it('deve retornar lista vazia quando não há itens', async () => {
    const sut = new ListarPortfolioPorPrestadorUseCase(makePortfolioRepo());

    const resultado = await sut.executar(UUID_PRESTADOR);

    expect(resultado).toEqual([]);
  });
});

// ─── ReordenarPortfolioUseCase ────────────────────────────────────────────────

describe('ReordenarPortfolioUseCase', () => {
  it('deve reordenar os itens do portfólio com sucesso', async () => {
    const portfolioRepo = makePortfolioRepo();
    const prestadorRepo = makePrestadorRepo({ findByUserId: jest.fn().mockResolvedValue(PRESTADOR_MOCK) });
    const sut = new ReordenarPortfolioUseCase(portfolioRepo, prestadorRepo);

    const novaOrdem = [{ id: 'a', ordem: 1 }, { id: 'b', ordem: 0 }];
    await sut.executar(UUID_PRESTADOR, novaOrdem);

    expect(portfolioRepo.reordenar).toHaveBeenCalledWith(novaOrdem);
  });

  it('deve lançar ResourceNotFoundError quando o prestador não existe', async () => {
    const sut = new ReordenarPortfolioUseCase(makePortfolioRepo(), makePrestadorRepo());

    await expect(
      sut.executar(UUID_PRESTADOR, [{ id: 'a', ordem: 0 }]),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
