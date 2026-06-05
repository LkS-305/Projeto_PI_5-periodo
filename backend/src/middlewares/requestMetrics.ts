/**
 * Contadores globais de requisições HTTP (processo único).
 * Atualizado no evento `finish` da resposta e em desconexão sem resposta.
 */

export type ErrorSample = {
  kind: 'http_error' | 'no_response';
  method: string;
  path: string;
  status?: number;
  at: string;
};

export type MetricsSnapshot = {
  success: number;
  clientError: number;
  serverError: number;
  noResponse: number;
  total: number;
  startedAt: string;
  lastUpdatedAt: string;
  lastIssues: ErrorSample[];
};

const MAX_SAMPLES = 30;

const state = {
  success: 0,
  clientError: 0,
  serverError: 0,
  noResponse: 0,
  startedAt: new Date().toISOString(),
  lastUpdatedAt: new Date().toISOString(),
  lastIssues: [] as ErrorSample[],
};

function pushSample(sample: ErrorSample) {
  state.lastIssues.unshift(sample);
  if (state.lastIssues.length > MAX_SAMPLES) {
    state.lastIssues.length = MAX_SAMPLES;
  }
}

export function recordRequestOutcome(
  statusCode: number,
  method: string,
  path: string,
) {
  state.lastUpdatedAt = new Date().toISOString();
  if (statusCode >= 500) {
    state.serverError++;
    pushSample({
      kind: 'http_error',
      method,
      path,
      status: statusCode,
      at: state.lastUpdatedAt,
    });
  } else if (statusCode >= 400) {
    state.clientError++;
    pushSample({
      kind: 'http_error',
      method,
      path,
      status: statusCode,
      at: state.lastUpdatedAt,
    });
  } else {
    state.success++;
  }
}

/** Cliente fechou a conexão antes de qualquer cabeçalho de resposta. */
export function recordNoResponse(method: string, path: string) {
  state.noResponse++;
  state.lastUpdatedAt = new Date().toISOString();
  pushSample({
    kind: 'no_response',
    method,
    path,
    at: state.lastUpdatedAt,
  });
}

export function getMetricsSnapshot(): MetricsSnapshot {
  return {
    success: state.success,
    clientError: state.clientError,
    serverError: state.serverError,
    noResponse: state.noResponse,
    total:
      state.success + state.clientError + state.serverError + state.noResponse,
    startedAt: state.startedAt,
    lastUpdatedAt: state.lastUpdatedAt,
    lastIssues: [...state.lastIssues],
  };
}
