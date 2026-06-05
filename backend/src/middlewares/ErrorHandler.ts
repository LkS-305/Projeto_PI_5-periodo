import { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/errors/AppError';
import { logError, logWarn } from '../core/utils/httpLogger';

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const path = request.originalUrl?.split('?')[0] || request.url;

  if (error instanceof AppError) {
    logWarn('http.error_handler.app_error', {
      method: request.method,
      path,
      statusCode: error.statusCode,
      message: error.message,
    });
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  logError('http.error_handler.internal', error, {
    method: request.method,
    path,
  });

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server error'
  });

}

