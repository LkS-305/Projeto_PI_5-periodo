import { Router } from "express";
import { PgServicoRepository } from "../repositories/PgServicoRepository";
import { PgTransacaoRepository } from "../repositories/PgTransacaoRepository";
import { PgAgendamentosRepository } from "../repositories/PgAgendamentosRepository";
import { ServicoController } from "../controllers/ServicoController";

import {
  CriarServicoUseCase,
  ListarServicosUseCase,
  PesquisarServicoId,
  PesquisarServicoUserId,
  PesquisarServicoPrestadorId,
  AtualizarServicoUseCase,
  AtualizarStatusUseCase,
} from "../../core/use-cases/servico/ServicoUseCase";

const servicoRouter = Router();

const servicoRepo = new PgServicoRepository();
const agendamentoRepo = new PgAgendamentosRepository();
const transacaoRepo = new PgTransacaoRepository();

const criarServicoUseCase = new CriarServicoUseCase(servicoRepo);
const listarServicosUseCase = new ListarServicosUseCase(servicoRepo);
const pesquisarServicoId = new PesquisarServicoId(servicoRepo);
const pesquisarServicoUserId = new PesquisarServicoUserId(servicoRepo);
const pesquisarServicoPrestadorId = new PesquisarServicoPrestadorId(servicoRepo);
const atualizarStatusUseCase = new AtualizarStatusUseCase(servicoRepo);
const atualizarServicoUseCase = new AtualizarServicoUseCase(servicoRepo)

const servicoController = new ServicoController(
  criarServicoUseCase,
  listarServicosUseCase,
  pesquisarServicoId,
  pesquisarServicoUserId,
  pesquisarServicoPrestadorId,
  atualizarStatusUseCase,
  atualizarServicoUseCase,
);

servicoRouter.get("/listarTodos", (req, res) =>
  servicoController.listAll(req, res),
);
servicoRouter.get("/stats", (req, res) =>
  servicoController.stats(req, res),
);
servicoRouter.post("/criar-servico", (req, res) =>
  servicoController.create(req, res),
);
servicoRouter.get("/acharPorId", (req, res) =>
  servicoController.findById(req, res),
);
servicoRouter.get("/acharPorUserId", (req, res) =>
  servicoController.findByUserId(req, res),
);
servicoRouter.get("/acharPorPretadorId", (req, res) =>
  servicoController.findByPrestadorId(req, res),
);
servicoRouter.patch("/atualizarStatus", (req, res) =>
  servicoController.updateStatus(req, res),
);
servicoRouter.patch("/atualizarServico", (req, res) =>
  servicoController.updateServico(req, res),
);

export { servicoRouter };
