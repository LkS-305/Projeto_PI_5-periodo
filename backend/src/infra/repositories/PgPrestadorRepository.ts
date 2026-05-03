import { IPrestadorRepository } from "../../core/repositories/IPrestadorRepository";
import { Prestador } from "../../core/entities/Prestador";
import { pool } from "../database/postgres";
import { AppError } from "../../core/errors/AppError";

export class PgPrestadorRepository implements IPrestadorRepository {
  async create(prestador: Prestador): Promise<void> {
    const consulta = `
      INSERT INTO prestadores (user_id, nome, bio, score, status_verificacao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const valores = [
      prestador.user_id,
      prestador.nome,
      prestador.bio,
      prestador.score,
      prestador.status_verificacao || "pendente",
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

  async findById(id: string): Promise<Prestador | null> {
    const { rows } = await pool.query(
      "SELECT * FROM prestadores WHERE id = $1",
      [id],
    );
    return rows[0] || null;
  }

  async findByUserId(user_id: string): Promise<Prestador | null> {
    const { rows } = await pool.query(
      "SELECT * FROM prestadores WHERE user_id = $1",
      [user_id],
    );
    return rows[0] || null;
  }

  async listByCategory(categoria: string): Promise<Prestador[] | null> {
    const { rows } = await pool.query(
      "SELECT * FROM prestadores WHERE bio ILIKE $1",
      [`%${categoria}%`],
    );
    return rows.length ? rows : null;
  }

  async delete(user_id: string): Promise<void> {
    const query = "DELETE FROM prestadores WHERE user_id = $1";
    await pool.query(query, [user_id]);
  }

  async update(prestador: Prestador): Promise<void> {
    const query = `
      UPDATE prestadores
      SET nome = $1,
          bio = $2,
          score = $3,
          foto_url = $4,
          status_verificacao = $5
      WHERE user_id = $6
    `;
    await pool.query(query, [
      prestador.nome,
      prestador.bio,
      prestador.score,
      prestador.foto_url || null,
      prestador.status_verificacao || null,
      prestador.user_id,
    ]);
  }
}
