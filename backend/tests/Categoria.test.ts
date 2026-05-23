import { Categoria } from '../src/core/entities/Categoria';
import { InMemoryCategoriaRepository } from './repositories/InMemoryCategoriaRepository';
import {
  CriarCategoriaUseCase,
  DeletarCategoriaUseCase,
  AtualizarCategoriaUseCase,
  PesquisarPorId,
  PesquisarTudo,
  PesquisarPorNome
} from '../src/core/use-cases/categoria/CategoriaUseCase';

describe('Suite de testes: Categoria', () => {
  let repo: InMemoryCategoriaRepository;

  beforeEach(() => {
    repo = new InMemoryCategoriaRepository();
  });

  describe('Criar Categoria', () => {
    it('Deve cadastrar uma nova categoria', async () => {
      const sut = new CriarCategoriaUseCase(repo);
      const categoria = await sut.executar({
        nome: 'Marcenaria',
        slug: 'marcenaria',
        icon_url: 'url_do_icone',
      });

      expect(categoria.nome).toBe('Marcenaria');
      expect(categoria.id).toBeTruthy();
    });

    it('Não deve permitir categorias com nomes duplicados', async () => {
      const sut = new CriarCategoriaUseCase(repo);
      const repetida = new Categoria({ nome: 'Repetida', slug: 'r', icon_url: 'u' });
      await repo.create(repetida);

      await expect(
        sut.executar({ nome: 'Repetida', slug: 'r2', icon_url: 'u2' })
      ).rejects.toThrow(/Esta categoria ja existe/);
    });
  });

  describe('Deletar Categoria', () => {
    it('Deve deletar uma categoria existente', async () => {
      const sut = new DeletarCategoriaUseCase(repo);
      const criada = new Categoria({ nome: 'Teste', slug: 't', icon_url: 'u' });
      await repo.create(criada);

      const result = await sut.executar(criada.id!);
      expect(result).toBe(true);

      const busca = await repo.findById(criada.id!);
      expect(busca).toBeNull();
    });
  });

  describe('Listar Categorias', () => {
    it('Deve retornar todas as categorias cadastradas', async () => {
      const sut = new PesquisarTudo(repo);
      await repo.create(new Categoria({ nome: 'Cat 1', slug: 'c1', icon_url: 'i1' }));
      await repo.create(new Categoria({ nome: 'Cat 2', slug: 'c2', icon_url: 'i2' }));

      const lista = await sut.executar();
      expect(lista?.length).toBe(2);
    });
  });

  describe('Pesquisar por ID', () => {
    it('Deve retornar a categoria correta ao buscar por ID', async () => {
      const sut = new PesquisarPorId(repo);
      const criado = new Categoria({ nome: 'Marcenaria', slug: 'marcenaria', icon_url: 'url' });
      await repo.create(criado);

      const categoria = await sut.executar(criado.id!);
      expect(categoria?.nome).toBe('Marcenaria');
      expect(categoria?.id).toBe(criado.id);
    });
  });

  describe('Pesquisar por Nome', () => {
    it('Deve encontrar uma categoria pelo nome exato', async () => {
      const sut = new PesquisarPorNome(repo);
      await repo.create(new Categoria({ nome: 'Pintura', slug: 'pintura', icon_url: 'url' }));

      const categoria = await sut.executar('Pintura');
      expect(categoria?.nome).toBe('Pintura');
    });
  });

  describe('Atualizar Categoria', () => {
    it('Deve alterar os dados de uma categoria', async () => {
      const sut = new AtualizarCategoriaUseCase(repo);
      const criada = new Categoria({ nome: 'Original', slug: 'o', icon_url: 'u' });
      await repo.create(criada);

      const atualizada = await sut.executar({
        id: criada.id!,
        nome: 'Editada',
        slug: 'editada',
        icon_url: 'nova_url'
      });

      expect(atualizada?.nome).toBe('Editada');
      expect(atualizada?.slug).toBe('editada');
    });
  });
});
