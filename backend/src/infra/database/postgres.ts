import { Pool, QueryResult, QueryConfig } from 'pg';
import dotenv from 'dotenv';
import { logError, logInfo, logWarn, sqlSnippetForLog } from '../../core/utils/httpLogger';

dotenv.config();

const dbHost = (process.env.DB_HOST || 'localhost').trim();
const dbPortParsed = parseInt(process.env.DB_PORT || '5432', 10);
const dbPort = Number.isFinite(dbPortParsed) ? dbPortParsed : 5432;

logInfo('db.pool.target', {
  host: dbHost,
  port: dbPort,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
});

export const pool = new Pool({
  user: process.env.DB_USER,
  host: dbHost,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: dbPort,
});

const rawQuery = pool.query.bind(pool);

/** Intercepta falhas de SQL em todo o backend (repositórios, health, migrate). */
(pool as unknown as { query: (...a: unknown[]) => unknown }).query = (...args: unknown[]) => {
  if (args.length >= 3 && typeof args[2] === 'function') {
    return (rawQuery as (...a: unknown[]) => unknown)(...args);
  }
  const queryTextOrConfig = args[0] as string | QueryConfig;
  const values = args[1] as unknown[] | undefined;
  const started = Date.now();
  const promise = (rawQuery as (q: string | QueryConfig, v?: unknown[]) => Promise<QueryResult>)(
    queryTextOrConfig,
    values as never[] | undefined,
  );
  return promise.then(
    (res) => {
      const slowMs = parseInt(process.env.LOG_SLOW_QUERY_MS || '0', 10);
      if (slowMs > 0) {
        const durationMs = Date.now() - started;
        if (durationMs >= slowMs) {
          logInfo('db.query.slow', {
            durationMs,
            sqlSnippet: sqlSnippetForLog(queryTextOrConfig),
          });
        }
      }
      return res;
    },
    (err: unknown) => {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code?: string }).code)
          : '';
      const base = {
        durationMs: Date.now() - started,
        sqlSnippet: sqlSnippetForLog(queryTextOrConfig),
        paramCount: Array.isArray(values) ? values.length : undefined,
        pgCode: code || undefined,
      };
      if (code === '23505') {
        logWarn('db.pool.query.unique_violation', base);
      } else {
        logError('db.pool.query', err, base);
      }
      throw err;
    },
  );
};

pool.on('connect', () => {
  logInfo('db.pool.client_connected', {});
});

pool.on('error', (err) => {
  logError('db.pool.idle_client_error', err, {});
});

const logDbNotice = process.env.LOG_DB_NOTICE === '1' || process.env.LOG_DB_NOTICE === 'true';

pool.on('acquire', (client) => {
  if (!client.listeners('notice').length) {
    client.on('notice', (msg) => {
      const message = msg.message;
      if (!message) return;
      if (logDbNotice) {
        logInfo('db.client.notice', { message: message.slice(0, 500) });
        return;
      }
      let color = '\x1b[94m';
      if (message.includes('INSERT')) color = '\x1b[32m';
      else if (message.includes('DELETE')) color = '\x1b[31m';
      else if (message.includes('UPDATE')) color = '\x1b[33m';
      console.log(`${color}Postgres ${message}\x1b[0m`);
    });
  }
});
