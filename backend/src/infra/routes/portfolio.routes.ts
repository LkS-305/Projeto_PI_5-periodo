import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PgPortfolioRepository } from '../repositories/PgPortfolioRepository';
import { PgPrestadorRepository } from '../repositories/PgPrestadorRepository';
import {
  AdicionarItemPortfolioUseCase,
  DeletarItemPortfolioUseCase,
  ListarPortfolioPorPrestadorUseCase,
  ReordenarPortfolioUseCase,
} from '../../core/use-cases/portfolio/PortfolioUseCase';
import { PortfolioController } from '../controllers/PortfolioController';
import { ensureAuthenticated } from '../../middlewares/AuthMiddleware';

const portfolioRouter = Router();

const uploadDir = path.resolve('uploads', 'portfolio');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/', 'video/'];
    if (!allowed.some(prefix => file.mimetype.startsWith(prefix))) {
      return cb(new Error('Apenas imagens e vídeos são permitidos.'));
    }
    cb(null, true);
  },
});

const portfolioRepo = new PgPortfolioRepository();
const prestadorRepo = new PgPrestadorRepository();

const portfolioController = new PortfolioController(
  new AdicionarItemPortfolioUseCase(portfolioRepo, prestadorRepo),
  new DeletarItemPortfolioUseCase(portfolioRepo),
  new ListarPortfolioPorPrestadorUseCase(portfolioRepo),
  new ReordenarPortfolioUseCase(portfolioRepo, prestadorRepo),
);

portfolioRouter.post('/upload', ensureAuthenticated, upload.single('arquivo'), (req, res) =>
  portfolioController.upload(req, res),
);
portfolioRouter.delete('/:id', ensureAuthenticated, (req, res) =>
  portfolioController.delete(req, res),
);
portfolioRouter.get('/', (req, res) =>
  portfolioController.listar(req, res),
);
portfolioRouter.patch('/reordenar', ensureAuthenticated, (req, res) =>
  portfolioController.reordenarItens(req, res),
);

export { portfolioRouter };
