import { Request, Response, NextFunction } from 'express';
import { recordRequestOutcome, recordNoResponse } from './requestMetrics';
import { logInfo, sanitizeForLog } from '../core/utils/httpLogger';

const LOG_BODY =
  process.env.LOG_REQUEST_BODY !== '0' &&
  process.env.LOG_REQUEST_BODY !== 'false';

const LOG_COLORS =
  process.env.LOG_COLORS !== '0' && process.env.LOG_COLORS !== 'false';

/** Polling do painel de métricas: não poluir o terminal a cada 2s (contadores continuam a ser atualizados). */
function isInternalMetricsPollPath(path: string): boolean {
  return path === '/internal/metrics' || path.startsWith('/internal/metrics/');
}

/**
 * Middleware: métricas no `finish` (cobre res.json, send, sendStatus, etc.)
 * + log legível opcional com cores + corpo sanitizado.
 */
export const logFullCycle = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.originalUrl?.split('?')[0] || req.url;
  let finished = false;

  const onFinish = () => {
    if (finished) return;
    finished = true;
    const durationMs = Date.now() - start;
    const code = res.statusCode;

    if (!res.headersSent) {
      recordNoResponse(req.method, path);
      if (!isInternalMetricsPollPath(path)) {
        logInfo('http.request.aborted_without_headers', {
          method: req.method,
          path,
          durationMs,
        });
      }
      return;
    }

    recordRequestOutcome(code, req.method, path);

    if (!isInternalMetricsPollPath(path)) {
      logInfo('http.request.finish', {
        method: req.method,
        path,
        status: code,
        durationMs,
      });

      if (LOG_COLORS) {
        const reset = '\x1b[0m';
        const cyan = '\x1b[36m';
        const yellow = '\x1b[33m';
        const green = '\x1b[32m';
        const red = '\x1b[31m';
        const colorStatus = code >= 400 ? red : green;
        console.log(
          `${cyan}${req.method}${reset} ${path} ${colorStatus}${code}${reset} ${yellow}${durationMs}ms${reset}`,
        );
      }
    }
  };

  res.on('finish', onFinish);

  req.on('close', () => {
    if (finished) return;
    if (!res.headersSent) {
      finished = true;
      recordNoResponse(req.method, path);
      if (!isInternalMetricsPollPath(path)) {
        logInfo('http.request.no_response', {
          method: req.method,
          path,
          hint: 'conexão encerrada antes da resposta (abort, queda de rede, etc.)',
        });
      }
    }
  });

  if (
    LOG_BODY &&
    req.body &&
    typeof req.body === 'object' &&
    Object.keys(req.body).length > 0 &&
    !isInternalMetricsPollPath(path)
  ) {
    const safe = sanitizeForLog(req.body);
    if (LOG_COLORS) {
      const magenta = '\x1b[35m';
      const yellow = '\x1b[33m';
      const reset = '\x1b[0m';
      console.log(
        `${magenta}>>>${reset} ${req.method} ${path} ${yellow}body${reset}`,
        JSON.stringify(safe),
      );
    } else {
      logInfo('http.request.body', { method: req.method, path, body: safe });
    }
  }

  next();
};
