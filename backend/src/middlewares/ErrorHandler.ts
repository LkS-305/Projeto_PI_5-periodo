import { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/errors/AppError';


export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  console.error(' [Internal Error]: ', error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server error'
  });

}

