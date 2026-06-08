import { ValidationError } from "../errors/AppError";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_REGEX = /<[^>]*>/g;
const DURACAO_REGEX = /^\d+\s*(min|h|hora|horas|minutos)$/i;

export function validarUUID(id: string, campo = "ID"): void {
  if (!id || !UUID_REGEX.test(id)) {
    throw new ValidationError(`${campo} inválido.`);
  }
}

export function validarEmail(email: string): void {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new ValidationError("E-mail inválido.");
  }
}

export function validarSenha(senha: string): void {
  if (!senha || senha.length < 8) {
    throw new ValidationError("A senha deve ter no mínimo 8 caracteres.");
  }
}

export function validarTexto(
  valor: string,
  campo: string,
  min = 2,
  max = 255,
): void {
  if (!valor || valor.trim().length < min) {
    throw new ValidationError(`${campo} deve ter no mínimo ${min} caracteres.`);
  }
  if (valor.trim().length > max) {
    throw new ValidationError(`${campo} deve ter no máximo ${max} caracteres.`);
  }
}

export function validarNota(nota: number | string): void {
  const num = Number(nota);
  if (isNaN(num) || num < 1 || num > 5) {
    throw new ValidationError("A nota deve ser um número entre 1 e 5.");
  }
}

export function sanitizarTexto(texto: string): string {
  return texto.replace(HTML_TAG_REGEX, "").trim();
}

export function validarCPF(cpf: string): void {
  const limpo = cpf.replace(/\D/g, "");
  if (limpo.length !== 11 || /^(\d)\1+$/.test(limpo)) {
    throw new ValidationError("CPF inválido.");
  }
}

export function validarCEP(cep: string): void {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) {
    throw new ValidationError("CEP inválido.");
  }
}

export function validarPreco(preco: number, campo = "Preço"): void {
  if (preco <= 0) {
    throw new ValidationError(`${campo} deve ser maior que zero.`);
  }
}

export function validarDataFutura(data: Date, campo = "Data"): void {
  if (data < new Date()) {
    throw new ValidationError(`${campo} não pode ser no passado.`);
  }
}

/** Data de início do serviço: permite hoje ou futuro (comparação por dia civil). */
export function validarDataInicioServicoAcordo(
  data: Date | string,
  campo = "Data de início",
): void {
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) {
    throw new ValidationError(`${campo} inválida.`);
  }
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const cmp = new Date(d);
  cmp.setHours(0, 0, 0, 0);
  if (cmp < hoje) {
    throw new ValidationError(`${campo} não pode ser anterior a hoje.`);
  }
}

export function validarDuracao(duracao: string, campo = "Duração"): void {
  if (!duracao || !DURACAO_REGEX.test(duracao.trim())) {
    throw new ValidationError(
      `${campo} inválida. Use o formato: '30 min', '2h', '1 hora'.`,
    );
  }
}

export function exigirCampos(
  body: Record<string, unknown>,
  campos: string[],
): void {
  const faltando = campos.filter(
    (c) => body[c] === undefined || body[c] === null || body[c] === "",
  );
  if (faltando.length > 0) {
    throw new ValidationError(
      `Campo(s) obrigatório(s) ausente(s): ${faltando.join(", ")}.`,
    );
  }
}
