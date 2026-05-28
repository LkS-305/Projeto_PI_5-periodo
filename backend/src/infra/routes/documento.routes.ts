import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { PgDocumentoRepository } from "../repositories/PgDocumentoRepository";
import { PgUsuarioRepository } from "../repositories/PgUsuarioRepository";
import { DocumentoController } from "../controllers/DocumentoController";
import { ensureAuthenticated, ensureRole } from "../../middlewares/AuthMiddleware";

import {
  CriarDocumentoUseCase,
  DeletarDocumentoUseCase,
  AtualizarDocumentoUseCase,
  AcharPorUserId,
  AtualizarStatus,
  ListarDocumentosPendentes,
} from "../../core/use-cases/documento/DocumentoUseCase";

const documentoRouter = Router();

const uploadDir = path.resolve("uploads", "documentos");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`;

    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Apenas imagens são permitidas."));
    }

    callback(null, true);
  },
});

const documentoRepo = new PgDocumentoRepository();
const usuarioRepo = new PgUsuarioRepository();

const criarDocumentoUC = new CriarDocumentoUseCase(documentoRepo, usuarioRepo);
const deletarDocumentoUC = new DeletarDocumentoUseCase(documentoRepo);
const atualizarDocumentoUC = new AtualizarDocumentoUseCase(documentoRepo);
const acharPorUserIdUC = new AcharPorUserId(documentoRepo);
const atualizarStatusUC = new AtualizarStatus(documentoRepo);
const listarPendentesUC = new ListarDocumentosPendentes(documentoRepo);

const documentoController = new DocumentoController(
  criarDocumentoUC,
  deletarDocumentoUC,
  atualizarDocumentoUC,
  acharPorUserIdUC,
  atualizarStatusUC,
  listarPendentesUC,
);

// rotas do usuário autenticado
documentoRouter.post("/criarDocumento", ensureAuthenticated, (req, res) =>
  documentoController.criar(req, res),
);

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

// rotas exclusivas de admin
documentoRouter.get("/pendentes", ensureAuthenticated, ensureRole("Admin"), (req, res) =>
  documentoController.findPendentes(req, res),
);

documentoRouter.patch("/:id/status", ensureAuthenticated, ensureRole("Admin"), (req, res) =>
  documentoController.updateStatus(req, res),
);

export { documentoRouter };
