export class AppError {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400
  ) {}
}


export class ResourceNotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} não encontrado(a).`, 404);
  }
}

// Erro 409 - Conflito (Duplicidade)
export class ResourceAlreadyExistsError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

// Erro 401 - Não Autorizado
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado.') {
    super(message, 401);
  }
}
