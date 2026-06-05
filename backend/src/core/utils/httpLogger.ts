/**
 * Logs estruturados (JSON em uma linha) para grep/agregadores.
 * Use em middlewares, errorHandler, controllers, repositórios e use cases.
 */

const SENSITIVE_KEYS = new Set([
  'senha',
  'password',
  'token',
  'authorization',
  'access_token',
  'cpf',
  'recovery_token',
]);

export function sanitizeForLog(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[max-depth]';
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeForLog(v, depth + 1));
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const lower = k.toLowerCase();
    if (SENSITIVE_KEYS.has(lower)) {
      out[k] = '[redacted]';
    } else if (typeof v === 'object' && v !== null) {
      out[k] = sanitizeForLog(v, depth + 1);
    } else {
      out[k] = v;
    }
  }
  return out;
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function emit(level: LogLevel, event: string, payload: Record<string, unknown>) {
  const line = JSON.stringify({
    level,
    ts: new Date().toISOString(),
    event,
    ...payload,
  });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export function logDebug(event: string, payload: Record<string, unknown> = {}) {
  if (process.env.LOG_DEBUG !== '1' && process.env.LOG_DEBUG !== 'true') return;
  emit('debug', event, payload);
}

export function logInfo(event: string, payload: Record<string, unknown> = {}) {
  emit('info', event, payload);
}

export function logWarn(event: string, payload: Record<string, unknown> = {}) {
  emit('warn', event, payload);
}

export function logError(
  event: string,
  err: unknown,
  payload: Record<string, unknown> = {},
) {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  emit('error', event, { ...payload, errMessage: message, errStack: stack });
}

/** Trecho curto de SQL para logs (sem dados sensíveis de parâmetros). */
export function sqlSnippetForLog(queryTextOrConfig: unknown, maxLen = 300): string {
  if (typeof queryTextOrConfig === 'string') {
    return queryTextOrConfig.replace(/\s+/g, ' ').trim().slice(0, maxLen);
  }
  if (
    queryTextOrConfig &&
    typeof queryTextOrConfig === 'object' &&
    'text' in queryTextOrConfig &&
    typeof (queryTextOrConfig as { text?: string }).text === 'string'
  ) {
    return (queryTextOrConfig as { text: string }).text.replace(/\s+/g, ' ').trim().slice(0, maxLen);
  }
  return '[query]';
}

/** Erro num use case (ex.: integração externa, regra de negócio com catch). */
export function logUseCaseCatch(
  useCase: string,
  action: string,
  err: unknown,
  extra: Record<string, unknown> = {},
) {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  logWarn('use_case.catch', {
    useCase,
    action,
    message,
    ...(stack ? { errStack: stack } : {}),
    ...extra,
  });
}

/** Erro tratado no controller (resposta 4xx já enviada ao cliente). */
export function logControllerError(
  controller: string,
  action: string,
  err: unknown,
  extra: Record<string, unknown> = {},
) {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  logWarn('controller.catch', {
    controller,
    action,
    clientMessage: message,
    ...(stack ? { errStack: stack } : {}),
    ...extra,
  });
}
