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
      const usuario = await sut.executar(user.user!.id, "Usuario Teste");

      expect(usuario.user_id).toBe(user.user!.id);
      expect(usuario).toBeTruthy();
    });
  });

  describe("Cenário: Deleção", () => {
    test("Deve deletar um usuário existente", async () => {
      const sut = new DeletarUsuarioUseCase(repo);
      const UUID = '123e4567-e89b-12d3-a456-426614174000';
      await repo.create({ user_id: UUID, nome: "nome ska" });

      const user = await repo.findByUserId(UUID);

      const result = await sut.executar(user!.user_id);
      expect(result).toBe(true);

      // Verifica se realmente sumiu do repositório
      const search = await repo.findByUserId(user!.user_id);
      expect(search).toBeNull();
    });

    test("Deve lançar erro ao tentar deletar um ID inexistente", async () => {
      const sut = new DeletarUsuarioUseCase(repo);
      const UUID_INEXISTENTE = '999e4567-e89b-12d3-a456-426614174999';
      await expect(sut.executar(UUID_INEXISTENTE)).rejects.toBeDefined();
    });
  });
});
