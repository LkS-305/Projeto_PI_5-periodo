export type ErrorSample = {
  kind: "http_error" | "no_response";
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
