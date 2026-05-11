import { pool } from "../database/postgres";
import { Documento } from "../../core/entities/Documento";
import { IDocumentoRepository } from "../../core/repositories/IDocumentoRepository";
import { AppError } from "../../core/errors/AppError";
import { verificacaoStatus } from "../../core/dtos/documento";

export class PgDocumentoRepository implements IDocumentoRepository {
  async create(documento: Documento): Promise<void> {
    const consulta = `
      INSERT INTO documentos (user_id, tipo, documento_url, selfie_url, verificacaoStatus)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const valores = [
      documento.user_id,
      documento.tipo,
      documento.documento_url,
      documento.selfie_url,
    ];

    try {
      await pool.query(consulta, valores);
    } catch (error: any) {

      // Erro de violação de restrição única (Ex: Email ou CPF já existem)
      if (error.code === '23505') {

        const detail = error.detail; // O Postgres costuma dizer qual campo falhou
        if (detail.includes('user_id')) {
          throw new AppError('Este user_id ja esta em uso.', 400);
        }
      }

    // Erro genérico de banco (Conexão, sintaxe, etc)
    console.error('Database Error:', error);
    throw new AppError('Erro interno ao processar o cadastro no banco de dados.', 500);
   }
  }

  async delete(user_id: string): Promise<void> {
    const query = "DELETE FROM documentos WHERE user_id = $1";
    await pool.query(query, [user_id]);
  }

  async update(dados: Documento): Promise<void> {
    const consulta = `
        UPDATE documentos 
        SET tipo = $1,
            documento_url = $2,
            selfie_url = $3
        WHERE user_id = $4
        RETURNING *
    `;

    const valores = [dados.tipo, dados.documento_url, dados.selfie_url, dados.user_id];

  try {
    await pool.query(consulta, valores);
  } catch (error: any) {
    console.error(error);
    throw new AppError("Erro de sintaxe na atualização: " + error.message);
  }
  }

  async findByUserId(user_id: string): Promise<Documento | null> {
    const consulta = "SELECT * FROM documentos WHERE user_id = $1"; // Sem vírgula, sem RETURNING
  
try {
    const { rows } = await pool.query(consulta, [user_id]);
    return rows[0] || null;
  } catch (error: any) {
    // Esse log vai aparecer no terminal onde o SERVIDOR (npm run dev) está rodando
    console.error("ERRO NA QUERY:", consulta);
    console.error("MENSAGEM:", error.message);
    throw error;
  }
 }

  async updateStatus(id: string, status: verificacaoStatus): Promise<void> {
    const consulta = 'UPDATE documentos SET verificacaoStatus = $1 WHERE user_id = $2';
    const valores = [status, id]
   try {
    await pool.query(consulta, valores);
  } catch (error: any) {
    console.error(error);
    throw new AppError("Erro de sintaxe na atualização: " + error.message);
  }
 }
}
