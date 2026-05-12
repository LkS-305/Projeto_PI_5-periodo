import { Router } from "express";
import { PgServicoRepository } from "../repositories/PgServicoRepository";
import { PgTransacaoRepository } from "../repositories/PgTransacaoRepository";
import { PgAgendamentosRepository } from "../repositories/PgAgendamentosRepository";
import { ServicoController } from "../controllers/ServicoController";

import {
  CriarServicoUseCase,
  DeletarServicoUseCase,
  PesquisarServicoId,
  PesquisarServicoUserId,
  PesquisarServicoPrestadorId,
  UpdateStatusUseCase,
} from "../../core/use-cases/servico/ServicoUseCase";

const servicoRouter = Router();

const servicoRepo = new PgServicoRepository();
const agendamentoRepo = new PgAgendamentosRepository();
const transacaoRepo = new PgTransacaoRepository();

const criarServicoUC = new CriarServicoUseCase(servicoRepo);
const deletarServicoUC = new DeletarServicoUseCase(servicoRepo);
const pesquisarServicoId = new PesquisarServicoId(servicoRepo);
const pesquisarServicoUserId = new PesquisarServicoUserId(servicoRepo);
const pesquisarServicoPrestadorId = new PesquisarServicoPrestadorId(
  servicoRepo,
);

const updateStatusUC = new UpdateStatusUseCase(servicoRepo);

const servicoController = new ServicoController(
  criarServicoUC,
  pesquisarServicoId,
  pesquisarServicoUserId,
  pesquisarServicoPrestadorId,
  updateStatusUC,
);

servicoRouter.post("/criarServico", (req, res) =>
  servicoController.create(req, res),
);

servicoRouter.patch("/atualizarServico", (req, res) =>
  servicoController.updateStatus(req, res),
);

servicoRouter.get("/buscarPorId", (req, res) =>
  servicoController.findById(req, res),
);

servicoRouter.get("/buscarPorUserId", (req, res) =>
  servicoController.findByUserId(req, res),
);

servicoRouter.get("/buscarPorPretadorId", (req, res) =>
  servicoController.findByPrestadorId(req, res),
);

export { servicoRouter };
