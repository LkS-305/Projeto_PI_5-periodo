import { Router } from "express";

import { PgDocumentoRepository } from "../repositories/PgDocumentoRepository";
import { PgUserRepository } from "../repositories/PgUserRepository";
import { DocumentoController } from "../controllers/DocumentoController";

import {
  CriarDocumentoUseCase,
  DeletarDocumentoUseCase,
  AtualizarDocumentoUseCase,
  AcharPorUserId,
  AtualizarStatus
} from "../../core/use-cases/documento/DocumentoUseCase";

const documentoRouter = Router();

const documentoRepo = new PgDocumentoRepository();
const userRepo = new PgUserRepository();

const criarDocumentoUC = new CriarDocumentoUseCase(documentoRepo, userRepo);
const deletarDocumentoUC = new DeletarDocumentoUseCase(documentoRepo);
const atualizarDocumentoUC = new AtualizarDocumentoUseCase(documentoRepo);
const acharPorUserIdUC = new AcharPorUserId(documentoRepo);
const atualizarStatusUC = new AtualizarStatus();

const documentoController = new DocumentoController(
  criarDocumentoUC,
  deletarDocumentoUC,
  atualizarDocumentoUC,
  acharPorUserIdUC,
  atualizarStatusUC,
);

documentoRouter.post("/criarDocumento", (req, res) =>
  documentoController.criar(req, res),
);
documentoRouter.delete("/deletarDocumento", (req, res) =>
  documentoController.delete(req, res),
);
documentoRouter.patch("/editarDocumento", (req, res) =>
  documentoController.update(req, res),
);
documentoRouter.get("/acharPorUserId", (req, res) =>
  documentoController.findByUserId(req, res),
);
documentoRouter.get("/atualizarStatus", (req, res) => documentoController.updateStatus(req, res))

export { documentoRouter };
