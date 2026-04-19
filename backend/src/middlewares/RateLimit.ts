import rateLimit from 'express-rate-limit';

// Limite geral: 100 requisições por IP a cada 15 minutos
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
});

// Limite estrito para rotas de autenticação: 10 tentativas por IP a cada 15 minutos
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Muitas tentativas de autenticação. Tente novamente mais tarde.',
  },
});
