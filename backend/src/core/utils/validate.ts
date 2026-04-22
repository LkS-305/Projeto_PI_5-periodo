import { ValidationError } from '../errors/AppError';

const UUID_REGEX  = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_REGEX = /<[^>]*>/g;

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

export function sanitizarTexto(texto: string): string {
  return texto.replace(HTML_TAG_REGEX, '').trim();
}

export function validarCPF(cpf: string): void {
  const limpo = cpf.replace(/\D/g, '');
  if (limpo.length !== 11 || /^(\d)\1+$/.test(limpo)) {
    throw new ValidationError('CPF inválido.');
  }
}

export function validarCEP(cep: string): void {
  const limpo = cep.replace(/\D/g, '');
  if (limpo.length !== 8) {
    throw new ValidationError('CEP inválido.');
  }
}

export function exigirCampos(body: Record<string, unknown>, campos: string[]): void {
  const faltando = campos.filter(c => body[c] === undefined || body[c] === null || body[c] === '');
  if (faltando.length > 0) {
    throw new ValidationError(`Campo(s) obrigatório(s) ausente(s): ${faltando.join(', ')}.`);
  }
}
