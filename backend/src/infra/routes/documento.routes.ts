import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { PgDocumentoRepository } from "../repositories/PgDocumentoRepository";
import { PgUsuarioRepository } from "../repositories/PgUsuarioRepository";
import { DocumentoController } from "../controllers/DocumentoController";
import { ensureAuthenticated } from "../../middlewares/AuthMiddleware";

import {
  CriarDocumentoUseCase,
  DeletarDocumentoUseCase,
  AtualizarDocumentoUseCase,
  AcharPorUserId,
  AtualizarStatus,
} from "../../core/use-cases/documento/DocumentoUseCase";

const documentoRouter = Router();

// Garante que a pasta de uploads existe
const uploadDir = path.resolve("uploads", "documentos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas imagens são permitidas."));
    }
    cb(null, true);
  },
});

const documentoRepo = new PgDocumentoRepository();
const usuarioRepo = new PgUsuarioRepository();

const criarDocumentoUC = new CriarDocumentoUseCase(documentoRepo, usuarioRepo);
const deletarDocumentoUC = new DeletarDocumentoUseCase(documentoRepo);
const atualizarDocumentoUC = new AtualizarDocumentoUseCase(documentoRepo);
const acharPorUserIdUC = new AcharPorUserId(documentoRepo);
const atualizarStatusUC = new AtualizarStatus(documentoRepo);

const documentoController = new DocumentoController(
  criarDocumentoUC,
  deletarDocumentoUC,
  atualizarDocumentoUC,
  acharPorUserIdUC,
  atualizarStatusUC,
);

// Upload de documento + selfie (aprovação automática)
documentoRouter.post(
  "/upload",
  ensureAuthenticated,
  upload.fields([
    { name: "documento", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  (req, res) => documentoController.upload(req, res),
);

documentoRouter.delete("/deletarDocumento", ensureAuthenticated, (req, res) =>
  documentoController.delete(req, res),
);

documentoRouter.patch("/editarDocumento", ensureAuthenticated, (req, res) =>
  documentoController.update(req, res),
);

documentoRouter.get("/acharPorUserId", ensureAuthenticated, (req, res) =>
  documentoController.findByUserId(req, res),
);

documentoRouter.patch("/:id/status", ensureAuthenticated, (req, res) =>
  documentoController.updateStatus(req, res),
);

export { documentoRouter };
