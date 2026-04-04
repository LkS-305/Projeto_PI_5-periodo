import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { InMemoryPrestadorRepository } from "./repositories/InMemoryPrestadorRepository";
import {
  CriarPrestadorUseCase,
  DeletarPrestadorUseCase,
  AtualizarPrestadorUseCase,
  AcharPorId,
  AcharPorUserId,
  ListarPorCategoria,
} from "../src/core/use-cases/prestador/PrestadorUseCase";

describe("Suíte de Testes: Prestador", () => {
  let repo: InMemoryPrestadorRepository;

  // Reinicia o repositório antes de cada teste para um não interferir no outro
  beforeEach(() => {
    repo = new InMemoryPrestadorRepository();
  });

  describe("Cenário: Cadastro de Prestador", () => {
    test("Deve cadastrar um novo prestador com sucesso", async () => {
      const sut = new CriarPrestadorUseCase(repo);
      const prestador = await sut.executar({
        user_id: "user-123",
      });

      assert.strictEqual(prestador.id, "test-uuid-123");
      assert.ok(prestador);
    });

    test("Deve criar múltiplos prestadores com IDs diferentes", async () => {
      const sut = new CriarPrestadorUseCase(repo);
      const prestador1 = await sut.executar({ user_id: "user-1" });
      const prestador2 = await sut.executar({ user_id: "user-2" });

      assert.notStrictEqual(prestador1.id, prestador2.id);
      assert.ok(prestador1.id);
      assert.ok(prestador2.id);
    });
  });

  describe("Cenário: Busca e Deleção", () => {
    test("Deve buscar um prestador pelo ID", async () => {
      const sut = new AcharPorId(repo);
      const criado = await repo.create({
        user_id: "user-teste",
      } as any);

      const encontrado = await sut.executar(criado.id!);
      assert.ok(encontrado);
      assert.strictEqual(encontrado.id, criado.id);
    });

    test("Deve buscar um prestador pelo User ID", async () => {
      const sut = new AcharPorUserId(repo);
      const criado = await repo.create({
        user_id: "user-busca-123",
      } as any);

      const encontrado = await sut.executar(criado.id!);
      assert.ok(encontrado);
    });

    test("Deve deletar um prestador existente", async () => {
      const sut = new DeletarPrestadorUseCase(repo);
      const criado = await repo.create({
        user_id: "user-delete",
      } as any);

      const resultado = await sut.executar(criado.id!);
      assert.strictEqual(resultado, true);

      // Verifica se realmente sumiu do repositório
      const busca = await repo.findById(criado.id!);
      assert.strictEqual(busca, null);
    });

    test("Deve retornar erro ao tentar deletar um ID inexistente", async () => {
      const sut = new DeletarPrestadorUseCase(repo);

      await assert.rejects(async () => {
        await sut.executar("id-inexistente");
      }, /Prestador não encontrado/);
    });
  });
});
