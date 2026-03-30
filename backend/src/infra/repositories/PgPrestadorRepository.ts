import { IPrestadorRepository } from '../../core/repositories/IPrestadorRepository';
import { Prestador } from '../../core/entities/Prestador';
import { pool } from '../database/postgres';
import { CriarPrestadorDto } from '../../core/dtos/prestador';

export class PgPrestadorRepository implements IPrestadorRepository {
  async create(p: CriarPrestadorDto): Promise<Prestador> {
    const query = `
      INSERT INTO prestadores (id, user_id)
      VALUES (gen_random_uuid(), $1)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [p.user_id]);
    return rows[0];
  }

  async findById(id: string) {
    const { rows } = await pool.query('SELECT * FROM prestadores WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async findByUserId(user_id: string) {
    const { rows } = await pool.query('SELECT * FROM prestadores WHERE user_id = $1', [user_id]);
    return rows[0] || null;
  }

  async listByCategory(categoria: string) {
    const { rows } = await pool.query('SELECT * FROM prestadores WHERE categorias ILIKE $1', [`%${categoria}%`]);
    return rows;
  }
}
