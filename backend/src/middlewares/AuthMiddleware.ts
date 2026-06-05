import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../core/errors/AppError';
import { UserType } from '../core/dtos/user';
import { logWarn } from '../core/utils/httpLogger';

interface TokenPayload {
  id: string;
  tipo: UserType;
  iat?: number;
  exp?: number;
}

export function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('Token não informado.'));
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new UnauthorizedError('Token mal formatado. Use Bearer <token>.'));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret-key',
    ) as TokenPayload;

    request.user = {
      id: decoded.id,
      tipo: decoded.tipo,
    };

    return next();
  } catch (err) {
    logWarn('auth.jwt.verify_failed', {
      errMessage: err instanceof Error ? err.message : String(err),
    });
    return next(new UnauthorizedError('Token inválido ou expirado.'));
  }
}

export function ensureRole(...roles: UserType[]) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      return next(new UnauthorizedError('Usuário não autenticado.'));
    }

    if (!roles.includes(request.user.tipo)) {
      return next(new UnauthorizedError('Usuário sem permissão para acessar este recurso.'));
    }

    return next();
  };
}
