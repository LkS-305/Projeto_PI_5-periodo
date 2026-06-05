import { BuscarExploreUseCase } from '../src/core/use-cases/explore/ExploreUseCase';
import { IExploreRepository, ExploreCategoria } from '../src/core/repositories/IExploreRepository';

const EXPLORE_MOCK: ExploreCategoria[] = [
  {
    categoria_id: 'cat-1',
    categoria: 'Eletricista',
    prestadores: [
      {
        user_id: 'user-1',
        nome: 'João Silva',
        score: 4.8,
        foto_url: null,
        cidade: 'São Paulo',
        estado: 'SP',
        portfolio: [{ url: '/uploads/portfolio/foto.jpg', tipo: 'imagem', ordem: 0 }],
        tags: ['Eletricista', 'Quadro elétrico'],
      },
    ],
  },
  {
    categoria_id: 'cat-2',
    categoria: 'Pedreiro(a)',
    prestadores: [
      {
        user_id: 'user-2',
        nome: 'Maria Souza',
        score: 4.9,
        foto_url: '/uploads/foto.png',
        cidade: 'Campinas',
        estado: 'SP',
        portfolio: [],
        tags: ['Pedreiro(a)', 'Alvenaria'],
      },
    ],
  },
];

function makeExploreRepo(
  overrides: Partial<Record<keyof IExploreRepository, jest.Mock>> = {},
): IExploreRepository {
  return {
    buscarParaExplore: jest.fn().mockResolvedValue(EXPLORE_MOCK),
    ...overrides,
  } as unknown as IExploreRepository;
}

// ─── BuscarExploreUseCase ─────────────────────────────────────────────────────

describe('BuscarExploreUseCase', () => {
  it('deve retornar as categorias com seus prestadores', async () => {
    const sut = new BuscarExploreUseCase(makeExploreRepo());

    const resultado = await sut.executar();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].categoria).toBe('Eletricista');
    expect(resultado[1].categoria).toBe('Pedreiro(a)');
  });

  it('deve retornar os prestadores dentro de cada categoria', async () => {
    const sut = new BuscarExploreUseCase(makeExploreRepo());

    const resultado = await sut.executar();

    expect(resultado[0].prestadores).toHaveLength(1);
    expect(resultado[0].prestadores[0].nome).toBe('João Silva');
    expect(resultado[0].prestadores[0].score).toBe(4.8);
  });

  it('deve incluir portfolio e tags em cada card', async () => {
    const sut = new BuscarExploreUseCase(makeExploreRepo());

    const resultado = await sut.executar();
    const card = resultado[0].prestadores[0];

    expect(card.portfolio).toHaveLength(1);
    expect(card.portfolio[0].tipo).toBe('imagem');
    expect(card.tags).toContain('Quadro elétrico');
  });

  it('deve aceitar prestadores sem foto e com portfólio vazio', async () => {
    const sut = new BuscarExploreUseCase(makeExploreRepo());

    const resultado = await sut.executar();
    const card = resultado[1].prestadores[0];

    expect(card.foto_url).toBe('/uploads/foto.png');
    expect(card.portfolio).toEqual([]);
  });

  it('deve retornar lista vazia quando não há categorias cadastradas', async () => {
    const sut = new BuscarExploreUseCase(
      makeExploreRepo({ buscarParaExplore: jest.fn().mockResolvedValue([]) }),
    );

    const resultado = await sut.executar();

    expect(resultado).toEqual([]);
  });

  it('deve chamar o repositório exatamente uma vez', async () => {
    const repo = makeExploreRepo();
    const sut = new BuscarExploreUseCase(repo);

    await sut.executar();

    expect(repo.buscarParaExplore).toHaveBeenCalledTimes(1);
  });
});
