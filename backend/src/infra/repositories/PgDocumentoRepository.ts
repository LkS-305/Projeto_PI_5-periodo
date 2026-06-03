import { pool } from "../database/postgres";
import { Documento } from "../../core/entities/Documento";
import { IDocumentoRepository } from "../../core/repositories/IDocumentoRepository";
import { AppError } from "../../core/errors/AppError";
import { verificacaoStatus } from "../../core/dtos/documento";

export class PgDocumentoRepository implements IDocumentoRepository {
  async create(documento: Documento): Promise<void> {
    const consulta = `
      INSERT INTO documentos (id, user_id, tipo, numero_documento, arquivo_url, selfie_url, data_expiracao, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const valores = [
      documento.id,
      documento.user_id,
      documento.tipo,
      documento.numero_documento ?? null,
      documento.arquivo_url,
      documento.selfie_url,
      documento.data_expiracao ?? null,
      documento.status,
    ];

    try {
      await pool.query(consulta, valores);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError('Usuário já possui um documento cadastrado.', 400);
      }
      console.error('Database Error:', error);
      throw new AppError('Erro ao salvar documento no banco de dados.', 500);
    }
  }

  async update(dados: Documento): Promise<void> {
    const consulta = `
      UPDATE documentos
      SET tipo = $1, numero_documento = $2, arquivo_url = $3, selfie_url = $4, data_expiracao = $5, status = $6
      WHERE user_id = $7
    `;
    const valores = [
      dados.tipo,
      dados.numero_documento ?? null,
      dados.arquivo_url,
      dados.selfie_url,
      dados.data_expiracao ?? null,
      dados.status,
      dados.user_id,
    ];

    try {
      await pool.query(consulta, valores);
    } catch (error: any) {
      console.error(error);
      throw new AppError('Erro ao atualizar documento.', 500);
    }
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM documentos WHERE id = $1", [id]);
  }

  async findByUserId(user_id: string): Promise<Documento | null> {
    const consulta = "SELECT * FROM documentos WHERE user_id = $1 LIMIT 1";
    try {
      const { rows } = await pool.query(consulta, [user_id]);
      if (!rows[0]) return null;
      return new Documento(
        {
          user_id: rows[0].user_id,
          tipo: rows[0].tipo,
          numero_documento: rows[0].numero_documento,
          arquivo_url: rows[0].arquivo_url,
          selfie_url: rows[0].selfie_url,
          data_expiracao: rows[0].data_expiracao,
          status: rows[0].status,
        },
        rows[0].id,
      );
    } catch (error: any) {
      console.error('Erro ao buscar documento:', error.message);
      throw error;
    }
  }

  async updateStatus(id: string, status: verificacaoStatus): Promise<void> {
    const consulta = 'UPDATE documentos SET status = $1 WHERE id = $2';
    try {
      await pool.query(consulta, [status, id]);
    } catch (error: any) {
      console.error(error);
      throw new AppError('Erro ao atualizar status do documento.', 500);
    }
  }
}
