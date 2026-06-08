import { InMemoryAvaliacaoRepository } from "./repositories/InMemoryAvaliacaoRepository";
import {
  CriarAvaliacaoUseCase,
  AtualizarAvaliacaoUseCase,
  DeletarAvaliacaoUseCase,
  ListarPorId,
} from "../src/core/use-cases/avaliacao/AvaliacaoUseCase";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../src/core/errors/AppError";

const UUID_VALIDO = "123e4567-e89b-12d3-a456-426614174000";
const SERVICO_ID = "223e4567-e89b-12d3-a456-426614174001";
const USUARIO_ID = "323e4567-e89b-12d3-a456-426614174002";
const PRESTADOR_ID = "423e4567-e89b-12d3-a456-426614174003";

describe("Suíte de Testes: Avaliação", () => {
  let repo: InMemoryAvaliacaoRepository;

  beforeEach(() => {
    repo = new InMemoryAvaliacaoRepository();
  });

  // ─── CriarAvaliacaoUseCase ───────────────────────────────────────────────────

  describe("Cenário: Criar Avaliação", () => {
    it("deve criar uma avaliação de serviço com sucesso", async () => {
      const sut = new CriarAvaliacaoUseCase(repo);

      const resultado = await sut.executar({
        servico_id: SERVICO_ID,
        usuario_id: USUARIO_ID,
        prestador_id: undefined,
        nota: 5,
        comentario: "Ótimo serviço!",
        media: undefined,
        destinatario: "servico",
      });

      expect(resultado).toBeTruthy();
      expect(resultado?.nota).toBe(5);
      expect(resultado?.servico_id).toBe(SERVICO_ID);
    });

    it("deve criar uma avaliação de prestador com sucesso", async () => {
      const sut = new CriarAvaliacaoUseCase(repo);

      const resultado = await sut.executar({
        servico_id: undefined,
        usuario_id: USUARIO_ID,
        prestador_id: PRESTADOR_ID,
        nota: 4,
        comentario: undefined,
        media: undefined,
        destinatario: "prestador",
      });

      expect(resultado?.prestador_id).toBe(PRESTADOR_ID);
      expect(resultado?.nota).toBe(4);
    });

    it("deve lançar ValidationError para nota menor que 1", async () => {
      const sut = new CriarAvaliacaoUseCase(repo);

      await expect(
        sut.executar({
          servico_id: SERVICO_ID,
          usuario_id: USUARIO_ID,
          prestador_id: undefined,
          nota: 0,
          comentario: undefined,
          media: undefined,
          destinatario: "servico",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("deve lançar ValidationError para nota maior que 5", async () => {
      const sut = new CriarAvaliacaoUseCase(repo);

      await expect(
        sut.executar({
          servico_id: SERVICO_ID,
          usuario_id: USUARIO_ID,
          prestador_id: undefined,
          nota: 6,
          comentario: undefined,
          media: undefined,
          destinatario: "servico",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  // ─── AtualizarAvaliacaoUseCase ───────────────────────────────────────────────

  describe("Cenário: Atualizar Avaliação", () => {
    it("deve atualizar o comentário de uma avaliação existente", async () => {
      const criar = new CriarAvaliacaoUseCase(repo);
      const sut = new AtualizarAvaliacaoUseCase(repo);
      const criada = await criar.executar({
        servico_id: SERVICO_ID,
        usuario_id: USUARIO_ID,
        prestador_id: undefined,
        nota: 3,
        comentario: "Comentário original",
        media: undefined,
        destinatario: "servico",
      });

      const resultado = await sut.executar(criada!.id, {
        comentario: "Comentário atualizado",
      });

      expect(resultado?.comentario).toBe("Comentário atualizado");
    });

    it("deve atualizar a nota de uma avaliação existente", async () => {
      const criar = new CriarAvaliacaoUseCase(repo);
      const sut = new AtualizarAvaliacaoUseCase(repo);
      const criada = await criar.executar({
        servico_id: SERVICO_ID,
        usuario_id: USUARIO_ID,
        prestador_id: undefined,
        nota: 3,
        comentario: undefined,
        media: undefined,
        destinatario: "servico",
      });

      const resultado = await sut.executar(criada!.id, { nota: 5 });

      expect(resultado?.nota).toBe(5);
    });

    it("deve lançar ResourceNotFoundError ao atualizar avaliação inexistente", async () => {
      const sut = new AtualizarAvaliacaoUseCase(repo);

      await expect(
        sut.executar(UUID_VALIDO, { comentario: "Novo comentário" }),
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("deve lançar ValidationError para nota inválida na atualização", async () => {
      const criar = new CriarAvaliacaoUseCase(repo);
      const sut = new AtualizarAvaliacaoUseCase(repo);
      const criada = await criar.executar({
        servico_id: SERVICO_ID,
        usuario_id: USUARIO_ID,
        prestador_id: undefined,
        nota: 3,
        comentario: undefined,
        media: undefined,
        destinatario: "servico",
      });

      await expect(
        sut.executar(criada!.id, { nota: 10 }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("deve lançar ValidationError para UUID com formato inválido", async () => {
      const sut = new AtualizarAvaliacaoUseCase(repo);

      await expect(
        sut.executar("id-invalido", { comentario: "Comentário" }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  // ─── DeletarAvaliacaoUseCase ─────────────────────────────────────────────────

  describe("Cenário: Deletar Avaliação", () => {
    it("deve deletar uma avaliação existente", async () => {
      const criar = new CriarAvaliacaoUseCase(repo);
      const sut = new DeletarAvaliacaoUseCase(repo);
      const criada = await criar.executar({
        servico_id: SERVICO_ID,
        usuario_id: USUARIO_ID,
        prestador_id: undefined,
        nota: 4,
        comentario: undefined,
        media: undefined,
        destinatario: "servico",
      });

      await sut.executar(criada!.id);

      const busca = await repo.listBy(criada!.id, "avaliacao");
      expect(busca).toBeNull();
    });

    it("deve lançar ValidationError para UUID com formato inválido", async () => {
      const sut = new DeletarAvaliacaoUseCase(repo);

      await expect(sut.executar("id-invalido")).rejects.toBeInstanceOf(
        ValidationError,
      );
    });
  });

  // ─── ListarPorId ─────────────────────────────────────────────────────────────

  describe("Cenário: Listar Avaliações", () => {
    it("deve listar avaliações por serviço", async () => {
      const criar = new CriarAvaliacaoUseCase(repo);
      const sut = new ListarPorId(repo);
      await criar.executar({
        servico_id: SERVICO_ID,
        usuario_id: USUARIO_ID,
        prestador_id: undefined,
        nota: 5,
        comentario: undefined,
        media: undefined,
        destinatario: "servico",
      });

      const resultado = await sut.executar(SERVICO_ID, "servico");

      expect(resultado).not.toBeNull();
      expect(resultado[0].servico_id).toBe(SERVICO_ID);
    });

    it("deve listar avaliações por prestador", async () => {
      const criar = new CriarAvaliacaoUseCase(repo);
      const sut = new ListarPorId(repo);
      await criar.executar({
        servico_id: undefined,
        usuario_id: USUARIO_ID,
        prestador_id: PRESTADOR_ID,
        nota: 4,
        comentario: undefined,
        media: undefined,
        destinatario: "prestador",
      });

      const resultado = await sut.executar(PRESTADOR_ID, "prestador");

      expect(resultado).not.toBeNull();
      expect(resultado[0].prestador_id).toBe(PRESTADOR_ID);
    });

    it("deve listar avaliações por usuário", async () => {
      const criar = new CriarAvaliacaoUseCase(repo);
      const sut = new ListarPorId(repo);
      await criar.executar({
        servico_id: SERVICO_ID,
        usuario_id: USUARIO_ID,
        prestador_id: undefined,
        nota: 3,
        comentario: undefined,
        media: undefined,
        destinatario: "usuario",
      });

      const resultado = await sut.executar(USUARIO_ID, "usuario");

      expect(resultado).not.toBeNull();
      expect(resultado[0].usuario_id).toBe(USUARIO_ID);
    });

    it("deve retornar lista vazia quando não há avaliações para o ID", async () => {
      const sut = new ListarPorId(repo);

      const resultado = await sut.executar(UUID_VALIDO, "servico");

      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado).toHaveLength(0);
    });

    it("deve lançar ValidationError para UUID com formato inválido", async () => {
      const sut = new ListarPorId(repo);

      await expect(
        sut.executar("id-invalido", "servico"),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
