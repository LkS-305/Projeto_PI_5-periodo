import rateLimit from 'express-rate-limit';

const isProd = process.env.NODE_ENV === 'production';
/** Desliga o rate limit (útil em dev local com hot reload / vários tabs). */
const disabled =
  process.env.DISABLE_RATE_LIMIT === '1' ||
  process.env.DISABLE_RATE_LIMIT === 'true';

/** Máximo de pedidos por IP por janela (SPA + polling consome mais que 100). */
const globalMax = Number(
  process.env.RATE_LIMIT_MAX ?? (isProd ? 2500 : 12000),
);
const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MIN ?? 15);

const limitJson = {
  status: 'error' as const,
  message: 'Muitas requisições. Tente novamente em alguns minutos.',
};

// Limite geral por IP (rotas autenticadas + polling de mensagens, etc.)
export const globalRateLimit = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: globalMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => disabled,
  message: limitJson,
});

// Limite para rotas de autenticação (quando aplicado ao router)
export const authRateLimit = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX ?? (isProd ? 40 : 200)),
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => disabled,
  message: {
    status: 'error',
    message: 'Muitas tentativas de autenticação. Tente novamente mais tarde.',
  },
});
