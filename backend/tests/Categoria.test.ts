import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
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
    test('Deve cadastrar uma nova categoria', async () => {
      const sut = new CriarCategoriaUseCase(repo);
      const categoria = await sut.executar({
        nome: 'Marcenaria',
        slug: 'marcenaria',
        icon_url: 'url_do_icone',
      });

      assert.strictEqual(categoria.nome, 'Marcenaria');
      assert.ok(categoria.id);
    });

    test('Não deve permitir categorias com nomes duplicados', async () => {
      const sut = new CriarCategoriaUseCase(repo);
      await repo.create({ nome: 'Repetida', slug: 'r', icon_url: 'u' });

      await assert.rejects(
        async () => { await sut.executar({ nome: 'Repetida', slug: 'r2', icon_url: 'u2' }) },
        /Esta categoria ja existe/ // Ajuste conforme a mensagem real do seu Use Case
      );
    });
  });

  describe('Deletar Categoria', () => {
    test('Deve deletar uma categoria existente', async () => {
      const sut = new DeletarCategoriaUseCase(repo);
      const criada = await repo.create({ nome: 'Teste', slug: 't', icon_url: 'u' });

      const result = await sut.executar(criada.id!);
      assert.strictEqual(result, true);
      
      const busca = await repo.findById(criada.id!);
      assert.strictEqual(busca, null);
    });
  });

  describe('Listar Categorias', () => {
    test('Deve retornar todas as categorias cadastradas', async () => {
      const sut = new PesquisarTudo(repo);
      await repo.create({ nome: 'Cat 1', slug: 'c1', icon_url: 'i1' });
      await repo.create({ nome: 'Cat 2', slug: 'c2', icon_url: 'i2' });

      const lista = await sut.executar();
      if (lista) {
        assert.strictEqual(lista.length, 2);
      }
    });
  });

  describe('Pesquisar por ID', () => {
    test('Deve retornar a categoria correta ao buscar por ID', async () => {
      const sut = new PesquisarPorId(repo);
      const criado = await repo.create({
        nome: 'Marcenaria',
        slug: 'marcenaria',
        icon_url: 'url',
      });

      const categoria = await sut.executar(criado.id!);
      assert.strictEqual(categoria?.nome, 'Marcenaria');
      assert.strictEqual(categoria?.id, criado.id);
    });
  });

  describe('Pesquisar por Nome', () => {
    test('Deve encontrar uma categoria pelo nome exato', async () => {
      const sut = new PesquisarPorNome(repo);
      await repo.create({ nome: 'Pintura', slug: 'pintura', icon_url: 'url' });

      const categoria = await sut.executar('Pintura');
      assert.strictEqual(categoria?.nome, 'Pintura');
    });
  });

  describe('Atualizar Categoria', () => {
    test('Deve alterar os dados de uma categoria', async () => {
      const sut = new AtualizarCategoriaUseCase(repo);
      const criada = await repo.create({ nome: 'Original', slug: 'o', icon_url: 'u' });

      const atualizada = await sut.executar(criada.id!, {
        nome: 'Editada',
        slug: 'editada',
        icon_url: 'nova_url'
      });

      assert.strictEqual(atualizada?.nome, 'Editada');
      assert.strictEqual(atualizada?.slug, 'editada');
    });
  });
});
