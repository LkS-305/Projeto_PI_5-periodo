import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { InMemoryUsuarioRepository } from "./repositories/InMemoryUsuarioRepository";
import {
  CriarUsuarioUseCase,
  DeletarUsuarioUseCase,
  AtualizarUsuarioUseCase,
  PesquisarPorUserId,
} from "../src/core/use-cases/usuario/UsuarioUseCase";
import { RegisterUseCase } from "../src/core/use-cases/user/UserUseCase";
import { InMemoryUserRepository } from "./repositories/InMemoryUserRepository";

describe("Suíte de Testes: Usuário", () => {
  let repo: InMemoryUsuarioRepository;
  let userRepo: InMemoryUserRepository;

  // Reinicia o repositório antes de cada teste para um não interferir no outro
  beforeEach(() => {
    repo = new InMemoryUsuarioRepository();
    userRepo = new InMemoryUserRepository();
  });

  describe("Cenário: Cadastro de Usuario", () => {
    test("Deve cadastrar um novo usuario com sucesso", async () => {
      const sutUser = new RegisterUseCase(userRepo);
      const user = await sutUser.executar({
        email: "teste@gmail.com",
        senha: "password123",
        cpf: "00000000000",
      });

      const sut = new CriarUsuarioUseCase(repo, userRepo);
      const usuario = await sut.executar({
        user_id: user!.id,
        nome: "Usuario Teste",
        score: 0,
      });

      assert.strictEqual(usuario.user_id, user!.id);
      assert.ok(usuario);
    });
  });

  describe("Cenário: Deleção", () => {
    test("Deve deletar um usuário existente", async () => {
      const sut = new DeletarUsuarioUseCase(repo);
      const usuario = await repo.create({
        user_id: "111",
        nome: "nome ska",
        score: 2,
      });

      const user = await repo.findByUserId(usuario.user_id);

      const result = await sut.executar(user!.user_id);
      assert.strictEqual(result, true);

      // Verifica se realmente sumiu do repositório
      const search = await repo.findByUserId(user!.user_id);
      assert.strictEqual(search, null);
    });

    test("Deve retornar false ao tentar deletar um ID inexistente", async () => {
      const sut = new DeletarUsuarioUseCase(repo);
      const result = await sut.executar("id-que-nao-existe");
      assert.strictEqual(result, false);
    });
  });
});
