import { ValidationError } from '../errors/AppError';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarUUID(id: string, campo = 'ID'): void {
  if (!id || !UUID_REGEX.test(id)) {
    throw new ValidationError(`${campo} inválido.`);
  }
}

export function validarEmail(email: string): void {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new ValidationError('E-mail inválido.');
  }
}

export function validarSenha(senha: string): void {
  if (!senha || senha.length < 8) {
    throw new ValidationError('A senha deve ter no mínimo 8 caracteres.');
  }
}

export function validarTexto(valor: string, campo: string, min = 2, max = 255): void {
  if (!valor || valor.trim().length < min) {
    throw new ValidationError(`${campo} deve ter no mínimo ${min} caracteres.`);
  }
  if (valor.trim().length > max) {
    throw new ValidationError(`${campo} deve ter no máximo ${max} caracteres.`);
  }
}

export function validarNota(nota: string): void {
  const num = Number(nota);
  if (isNaN(num) || num < 1 || num > 5) {
    throw new ValidationError('A nota deve ser um número entre 1 e 5.');
  }
}
