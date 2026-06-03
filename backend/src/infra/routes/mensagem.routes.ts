import { Router } from "express";
import { PgMensagemRepository } from "../repositories/PgMensagemRepository";
import { MensagemController } from "../controllers/MensagemController";
import {
  EnviarMensagemUseCase,
  BuscarMensagensServicoUseCase,
  BuscarMensagensUsuarioUseCase,
  BuscarMensagensPrestadorUseCase,
  MarcarMensagemLidaUseCase,
} from "../../core/use-cases/mensagem/MensagemUseCase";
import { ensureAuthenticated } from "../../middlewares/AuthMiddleware";

const mensagemRouter = Router();

const mensagemRepo = new PgMensagemRepository();

const controller = new MensagemController(
  new EnviarMensagemUseCase(mensagemRepo),
  new BuscarMensagensServicoUseCase(mensagemRepo),
  new BuscarMensagensUsuarioUseCase(mensagemRepo),
  new BuscarMensagensPrestadorUseCase(mensagemRepo),
  new MarcarMensagemLidaUseCase(mensagemRepo),
);

// Todas as rotas exigem autenticação
mensagemRouter.use(ensureAuthenticated);

mensagemRouter.post("/enviar", (req, res) => controller.enviar(req, res));
mensagemRouter.get("/servico/:servico_id", (req, res) =>
  controller.listarPorServico(req, res),
);
mensagemRouter.get("/usuario", (req, res) =>
  controller.listarPorUsuario(req, res),
);
mensagemRouter.get("/prestador/:prestador_id", (req, res) =>
  controller.listarPorPrestador(req, res),
);
mensagemRouter.patch("/:mensagem_id/lida", (req, res) =>
  controller.marcarComoLida(req, res),
);

export { mensagemRouter };
