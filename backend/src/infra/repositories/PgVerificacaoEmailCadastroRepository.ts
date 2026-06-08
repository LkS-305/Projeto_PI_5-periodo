import {
  IVerificacaoEmailCadastroRepository,
  VerificacaoEmailCadastroRow,
} from "../../core/repositories/IVerificacaoEmailCadastroRepository";
import { AppError } from "../../core/errors/AppError";
import { pool } from "../database/postgres";

function relancarSeTabelaInexistente(e: unknown): never {
  const code =
    typeof e === "object" && e !== null && "code" in e
      ? String((e as { code: unknown }).code)
      : "";
  const msg = e instanceof Error ? e.message : String(e);
  if (code === "42P01" || msg.includes("verificacao_email_cadastro")) {
    throw new AppError(
      "A tabela de verificação de e-mail não existe nesta base. Execute o script backend/src/infra/database/add_verificacao_email_cadastro.sql (ou recrie a BD com init.sql).",
      503,
    );
  }
  throw e;
}

export class PgVerificacaoEmailCadastroRepository implements IVerificacaoEmailCadastroRepository {
  async upsert(email: string, codigo: string, expira_em: Date): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO verificacao_email_cadastro (email, codigo, expira_em)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET
         codigo = EXCLUDED.codigo,
         expira_em = EXCLUDED.expira_em,
         created_at = NOW()`,
        [email.trim(), codigo, expira_em],
      );
    } catch (e) {
      relancarSeTabelaInexistente(e);
    }
  }

  async findByEmail(
    email: string,
  ): Promise<VerificacaoEmailCadastroRow | null> {
    try {
      const { rows } = await pool.query(
        `SELECT email, codigo, expira_em FROM verificacao_email_cadastro WHERE email = $1`,
        [email.trim()],
      );
      return rows[0] ?? null;
    } catch (e) {
      relancarSeTabelaInexistente(e);
    }
  }

  async deleteByEmail(email: string): Promise<void> {
    try {
      await pool.query(
        `DELETE FROM verificacao_email_cadastro WHERE email = $1`,
        [email.trim()],
      );
    } catch (e) {
      relancarSeTabelaInexistente(e);
    }
  }
}
