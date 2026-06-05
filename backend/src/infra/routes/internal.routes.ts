import { Router, Request, Response } from 'express';
import { getMetricsSnapshot } from '../../middlewares/requestMetrics';

const internalRouter = Router();

/**
 * JSON com contadores e últimas falhas / sem retorno.
 * Opcional: ?METRICS_SECRET no .env — se definido, exige header X-Metrics-Secret igual ao valor.
 */
function guardMetrics(req: Request, res: Response): boolean {
  const secret = process.env.METRICS_SECRET?.trim();
  if (!secret) return true;
  const sent = req.get('x-metrics-secret');
  if (sent === secret) return true;
  res.status(401).json({ erro: 'Métricas protegidas: envie X-Metrics-Secret correto.' });
  return false;
}

internalRouter.get('/metrics', (req, res) => {
  if (!guardMetrics(req, res)) return;
  res.json(getMetricsSnapshot());
});

/**
 * Server-Sent Events: envia snapshot a cada 2s (quadro “quase tempo real”).
 * No navegador: new EventSource('http://localhost:3002/internal/metrics/stream', { headers: { 'X-Metrics-Secret': '...' }})
 * — EventSource não permite headers custom em todos os browsers; use polling GET /internal/metrics ou extensão.
 */
internalRouter.get('/metrics/stream', (req, res) => {
  if (!guardMetrics(req, res)) return;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const tick = () => {
    try {
      const data = JSON.stringify(getMetricsSnapshot());
      res.write(`event: metrics\ndata: ${data}\n\n`);
    } catch {
      res.end();
    }
  };

  tick();
  const id = setInterval(tick, 2000);

  req.on('close', () => {
    clearInterval(id);
    res.end();
  });
});

export { internalRouter };
