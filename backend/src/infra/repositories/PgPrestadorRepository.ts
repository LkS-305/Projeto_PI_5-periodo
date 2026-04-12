import { IPrestadorRepository } from "../../core/repositories/IPrestadorRepository";
import { Prestador } from "../../core/entities/Prestador";
import { pool } from "../database/postgres";
import { CriarPrestadorDto } from "../../core/dtos/prestador";

export class PgPrestadorRepository implements IPrestadorRepository {
  async create(prestador: Prestador): Promise<Prestador> {
    const query = `
      INSERT INTO prestadores (id, user_id, bio)
      VALUES (gen_random_uuid(), $1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [prestador.user_id, prestador.bio]);
    return rows[0];
  }

  async findById(id: string) {
    const { rows } = await pool.query(
      "SELECT * FROM prestadores WHERE id = $1",
      [id],
    );
    return rows[0] || null;
  }

  async findByUserId(user_id: string) {
    const { rows } = await pool.query(
      "SELECT * FROM prestadores WHERE user_id = $1",
      [user_id],
    );
    return rows[0] || null;
  }

  async listByCategory(categoria: string) {
    const { rows } = await pool.query(
      "SELECT * FROM prestadores WHERE categorias ILIKE $1",
      [`%${categoria}%`],
    );
    return rows;
  }

  async delete(id: string): Promise<void> {
    const query = "DELETE FROM prestadores WHERE id = $1";
    await pool.query(query, [id]);
  }

  async update(
    id: string,
    dados: Partial<CriarPrestadorDto>,
  ): Promise<Prestador> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dados.user_id) {
      updates.push(`user_id = $${paramCount++}`);
      values.push(dados.user_id);
    }

    if (updates.length === 0) {
      const { rows } = await pool.query(
        "SELECT * FROM prestadores WHERE id = $1",
        [id],
      );
      return rows[0];
    }

    values.push(id);
    const query = `UPDATE prestadores SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}
