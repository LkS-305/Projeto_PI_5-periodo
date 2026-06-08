/** Rotas canónicas da app (URLs públicas). Usar em Link/router para evitar strings espalhadas. */

export const ROUTES = {
  landing: "/",
  login: "/login",
  register: "/register",
  hub: "/home",
  explore: "/explore",
  demand: "/demand",
  contracts: "/contracts",
  dashboard: "/dashboard",
  messages: "/messages",
  settings: "/settings",
  profile: "/profile",
  portifolio: "/portifolio",
  becomePrestador: "/become-prestador",
  bookings: "/bookings",
  services: "/services",
  /** Serviços concluídos ou cancelados (histórico dedicado). */
  servicosHistorico: "/servicos/historico",
  testAuth: "/test-auth",
} as const;

export type RouteKey = keyof typeof ROUTES;

export function prestadorProfilePath(userId: string): string {
  return `/prestador/${encodeURIComponent(userId)}`;
}

/** Detalhe do contrato/serviço (pedido, aceitar, etc.) */
export function contractDetailPath(servicoId: string): string {
  return `/contracts/${encodeURIComponent(servicoId)}`;
}

/** Alias: `/contracts/informacoes/:id` (redireciona para `contractDetailPath`). */
export function contractInformacoesPath(servicoId: string): string {
  return `/contracts/informacoes/${encodeURIComponent(servicoId)}`;
}

export function messagesWithServico(servicoId: string): string {
  return `${ROUTES.messages}?servico_id=${encodeURIComponent(servicoId)}`;
}
