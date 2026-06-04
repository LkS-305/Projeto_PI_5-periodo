import { Categoria } from '../src/core/entities/Categoria';
import { InMemoryCategoriaRepository } from './repositories/InMemoryCategoriaRepository';
import {
  CriarCategoriaUseCase,
  DeletarCategoriaUseCase,
  AtualizarCategoriaUseCase,
  PesquisarPorId,
  PesquisarTudo,
  PesquisarPorNome,
} from '../src/core/use-cases/categoria/CategoriaUseCase';
import {
  ResourceNotFoundError,
  ResourceAlreadyExistsError,
} from '../src/core/errors/AppError';

describe('Suíte de Testes: Categoria', () => {
  let repo: InMemoryCategoriaRepository;

  beforeEach(() => {
    repo = new InMemoryCategoriaRepository();
  });

  // ─── CriarCategoriaUseCase ───────────────────────────────────────────────────

  describe('Cenário: Criar Categoria', () => {
    it('deve cadastrar uma nova categoria com sucesso', async () => {
      const sut = new CriarCategoriaUseCase(repo);

      const resultado = await sut.executar({
        nome: 'Marcenaria',
        slug: 'marcenaria',
        icon_url: 'url_do_icone',
      });

      expect(resultado.nome).toBe('Marcenaria');
      expect(resultado.id).toBeTruthy();
    });

    it('deve lançar ResourceAlreadyExistsError para nomes duplicados', async () => {
      const sut = new CriarCategoriaUseCase(repo);
      await repo.create(new Categoria({ nome: 'Repetida', slug: 'r', icon_url: 'u' }));

      await expect(
        sut.executar({ nome: 'Repetida', slug: 'r2', icon_url: 'u2' })
      ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
    });
  });

  // ─── DeletarCategoriaUseCase ─────────────────────────────────────────────────

  describe('Cenário: Deletar Categoria', () => {
    it('deve deletar uma categoria existente e retornar true', async () => {
      const sut = new DeletarCategoriaUseCase(repo);
      const criada = new Categoria({ nome: 'Para Deletar', slug: 'del', icon_url: 'u' });
      await repo.create(criada);

      const resultado = await sut.executar(criada.id!);

      expect(resultado).toBe(true);
      const busca = await repo.findById(criada.id!);
      expect(busca).toBeNull();
    });

    it('deve retornar true mesmo ao deletar ID inexistente (deleção idempotente)', async () => {
      const sut = new DeletarCategoriaUseCase(repo);

      const resultado = await sut.executar('123e4567-e89b-12d3-a456-426614174000');

      expect(resultado).toBe(true);
    });
  });

  // ─── PesquisarTudo ───────────────────────────────────────────────────────────

  describe('Cenário: Listar Todas as Categorias', () => {
    it('deve retornar todas as categorias cadastradas', async () => {
      const sut = new PesquisarTudo(repo);
      await repo.create(new Categoria({ nome: 'Cat 1', slug: 'c1', icon_url: 'i1' }));
      await repo.create(new Categoria({ nome: 'Cat 2', slug: 'c2', icon_url: 'i2' }));

      const lista = await sut.executar();

      expect(lista?.length).toBe(2);
    });

    it('deve retornar lista vazia quando não há categorias', async () => {
      const sut = new PesquisarTudo(repo);

      const lista = await sut.executar();

      expect(lista?.length).toBe(0);
    });
  });

  // ─── PesquisarPorId ──────────────────────────────────────────────────────────

  describe('Cenário: Pesquisar por ID', () => {
    it('deve retornar a categoria correta ao buscar por ID', async () => {
      const sut = new PesquisarPorId(repo);
      const criada = new Categoria({ nome: 'Marcenaria', slug: 'marcenaria', icon_url: 'url' });
      await repo.create(criada);

      const resultado = await sut.executar(criada.id!);

      expect(resultado?.nome).toBe('Marcenaria');
      expect(resultado?.id).toBe(criada.id);
    });

    it('deve lançar ResourceNotFoundError para ID inexistente', async () => {
      const sut = new PesquisarPorId(repo);

      await expect(
        sut.executar('123e4567-e89b-12d3-a456-426614174000')
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });

  // ─── PesquisarPorNome ────────────────────────────────────────────────────────

  describe('Cenário: Pesquisar por Nome', () => {
    it('deve encontrar uma categoria pelo nome exato', async () => {
      const sut = new PesquisarPorNome(repo);
      await repo.create(new Categoria({ nome: 'Pintura', slug: 'pintura', icon_url: 'url' }));

      const resultado = await sut.executar('Pintura');

      expect(resultado?.nome).toBe('Pintura');
    });

    it('deve retornar null para nome não cadastrado', async () => {
      const sut = new PesquisarPorNome(repo);

      const resultado = await sut.executar('Inexistente');

      expect(resultado).toBeNull();
    });
  });

  // ─── AtualizarCategoriaUseCase ───────────────────────────────────────────────

  describe('Cenário: Atualizar Categoria', () => {
    it('deve alterar nome, slug e icon_url de uma categoria existente', async () => {
      const sut = new AtualizarCategoriaUseCase(repo);
      const criada = new Categoria({ nome: 'Original', slug: 'original', icon_url: 'url_antiga' });
      await repo.create(criada);

      const resultado = await sut.executar({
        id: criada.id!,
        nome: 'Editada',
        slug: 'editada',
        icon_url: 'url_nova',
      });

      expect(resultado?.nome).toBe('Editada');
      expect(resultado?.slug).toBe('editada');
      expect(resultado?.icon_url).toBe('url_nova');
    });

    it('deve lançar ResourceNotFoundError ao atualizar categoria inexistente', async () => {
      const sut = new AtualizarCategoriaUseCase(repo);

      await expect(
        sut.executar({
          id: '123e4567-e89b-12d3-a456-426614174000',
          nome: 'Nova',
          slug: 'nova',
          icon_url: 'url',
        })
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });
});
