import { Router } from "express";
import { PgPrestadorRepository } from "../repositories/PgPrestadorRepository";
import { PgUserRepository } from "../repositories/PgUserRepository";
import { PgPrestadorCategoriaRepository } from "../repositories/PgPrestadorCategoriaRepository";
import { PgCategoriaRepository } from "../repositories/PgCategoriaRepository";
import {
  CriarPrestadorUseCase,
  DeletarPrestadorUseCase,
  AtualizarPrestadorUseCase,
  AcharPorUserId,
} from "../../core/use-cases/prestador/PrestadorUseCase";
import {
  AdicionarCategoriaUseCase,
  RemoverCategoriaUseCase,
  ListarCategoriasDoPrestadorUseCase,
  ListarPrestadoresPorCategoriaUseCase,
} from "../../core/use-cases/prestador/PrestadorCategoriaUseCase";
import { PrestadorController } from "../controllers/PrestadorController";
import { PrestadorCategoriaController } from "../controllers/PrestadorCategoriaController";
import { ensureAuthenticated } from "../../middlewares/AuthMiddleware";

const prestadorRouter = Router();

const prestadorRepo = new PgPrestadorRepository();
const userRepo = new PgUserRepository();
const prestadorCategoriaRepo = new PgPrestadorCategoriaRepository();
const categoriaRepo = new PgCategoriaRepository();

const prestadorController = new PrestadorController(
  new CriarPrestadorUseCase(userRepo, prestadorRepo),
  new DeletarPrestadorUseCase(prestadorRepo),
  new AtualizarPrestadorUseCase(prestadorRepo),
  new AcharPorUserId(prestadorRepo),
);

const prestadorCategoriaController = new PrestadorCategoriaController(
  new AdicionarCategoriaUseCase(prestadorCategoriaRepo, prestadorRepo, categoriaRepo),
  new RemoverCategoriaUseCase(prestadorCategoriaRepo, prestadorRepo),
  new ListarCategoriasDoPrestadorUseCase(prestadorCategoriaRepo),
  new ListarPrestadoresPorCategoriaUseCase(prestadorCategoriaRepo),
);

/** Vitrine: leitura pública do perfil (sem JWT). Deve vir antes das rotas com auth. */
prestadorRouter.get(
  "/vitrina/:user_id",
  prestadorController.findPublicByUserId.bind(prestadorController),
);

prestadorRouter.post("/criarPrestador", ensureAuthenticated, prestadorController.criar.bind(prestadorController));
prestadorRouter.delete("/deletarPrestador", ensureAuthenticated, prestadorController.deletar.bind(prestadorController));
prestadorRouter.patch("/editarPrestador", ensureAuthenticated, prestadorController.atualizar.bind(prestadorController));
prestadorRouter.post("/buscarPorUserId", ensureAuthenticated, prestadorController.findByUserId.bind(prestadorController));

prestadorRouter.post("/categoria", ensureAuthenticated, prestadorCategoriaController.adicionar.bind(prestadorCategoriaController));
prestadorRouter.delete("/categoria", ensureAuthenticated, prestadorCategoriaController.remover.bind(prestadorCategoriaController));
prestadorRouter.get("/categorias", prestadorCategoriaController.listarCategorias.bind(prestadorCategoriaController));
prestadorRouter.get("/porCategoria", prestadorCategoriaController.listarPrestadores.bind(prestadorCategoriaController));

export { prestadorRouter };
