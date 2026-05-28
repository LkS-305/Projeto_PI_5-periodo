import { randomUUID } from "crypto";
import { pool } from "../database/postgres";
import { Documento } from "../../core/entities/Documento";
import { IDocumentoRepository } from "../../core/repositories/IDocumentoRepository";
import { AppError } from "../../core/errors/AppError";
import { VerificacaoStatus } from "../../core/dtos/documento";

export class PgDocumentoRepository implements IDocumentoRepository {
  async create(documento: Documento): Promise<Documento> {
    const id = documento.id ?? randomUUID();

    const consulta = `
      INSERT INTO documentos (
        id,
        user_id,
        tipo,
        numero_documento,
        arquivo_url,
        selfie_url,
        data_expiracao,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const valores = [
      id,
      documento.user_id,
      documento.tipo,
      documento.numero_documento,
      documento.arquivo_url,
      documento.selfie_url,
      documento.data_expiracao,
      documento.status ?? "pendente",
    ];

    try {
      const { rows } = await pool.query(consulta, valores);
      return this.mapRowToDocumento(rows[0]);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error("Erro ao criar documento:", error);
      throw new AppError("Erro ao salvar documento no banco de dados.", 500);
    }
  }

  async update(documento: Documento): Promise<Documento> {
    const consulta = `
      UPDATE documentos
      SET
        tipo = $1,
        numero_documento = $2,
        arquivo_url = $3,
        selfie_url = $4,
        data_expiracao = $5,
        status = $6
      WHERE user_id = $7
      RETURNING *;
    `;

    const valores = [
      documento.tipo,
      documento.numero_documento ?? null,
      documento.arquivo_url,
      documento.selfie_url,
      documento.data_expiracao ?? null,
      documento.status,
      documento.user_id,
    ];

    try {
      const { rows } = await pool.query(consulta, valores);

      if (!rows[0]) {
        throw new AppError("Documento não encontrado.", 404);
      }

      return this.mapRowToDocumento(rows[0]);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error("Erro ao atualizar documento:", error);
      throw new AppError("Erro ao atualizar documento.", 500);
    }
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM documentos WHERE id = $1", [id]);
  }

  async findByUserId(user_id: string): Promise<Documento | null> {
    const consulta = `
      SELECT *
      FROM documentos
      WHERE user_id = $1
      LIMIT 1;
    `;

    const { rows } = await pool.query(consulta, [user_id]);

    if (!rows[0]) {
      return null;
    }

    return this.mapRowToDocumento(rows[0]);
  }

  async findPendentes(): Promise<any[]> {
    const consulta = `
      SELECT
        d.id,
        d.user_id,
        d.tipo,
        d.numero_documento,
        d.arquivo_url,
        d.selfie_url,
        d.data_expiracao,
        d.status,
        u.nome AS usuario_nome,
        usr.email AS usuario_email
      FROM documentos d
      INNER JOIN usuarios u ON u.user_id = d.user_id
      INNER JOIN users usr ON usr.id = d.user_id
      WHERE d.status = 'pendente'
      ORDER BY d.user_id;
    `;

    const { rows } = await pool.query(consulta);
    return rows;
  }

  async updateStatus(id: string, status: VerificacaoStatus): Promise<void> {
    const consulta = `
      UPDATE documentos
      SET status = $1
      WHERE id = $2;
    `;

    await pool.query(consulta, [status, id]);
  }

  private mapRowToDocumento(row: any): Documento {
    return new Documento(
      {
        user_id: row.user_id,
        tipo: row.tipo,
        numero_documento: row.numero_documento,
        arquivo_url: row.arquivo_url,
        selfie_url: row.selfie_url,
        data_expiracao: row.data_expiracao,
        status: row.status,
      },
      row.id,
    );
  }
}
