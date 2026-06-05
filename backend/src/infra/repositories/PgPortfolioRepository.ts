import { pool } from '../database/postgres';
import { IPortfolioRepository, PortfolioItem } from '../../core/repositories/IPortfolioRepository';

export class PgPortfolioRepository implements IPortfolioRepository {
  async create(item: Omit<PortfolioItem, 'created_at'>): Promise<PortfolioItem> {
    const { rows } = await pool.query(
      `INSERT INTO portfolio_items (id, prestador_id, url, tipo, descricao, ordem)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [item.id, item.prestador_id, item.url, item.tipo, item.descricao ?? null, item.ordem],
    );
    return rows[0];
  }

  async delete(id: string): Promise<string | null> {
    const { rows } = await pool.query(
      `DELETE FROM portfolio_items WHERE id = $1 RETURNING url`,
      [id],
    );
    return rows[0]?.url ?? null;
  }

  async findById(id: string): Promise<PortfolioItem | null> {
    const { rows } = await pool.query(
      `SELECT * FROM portfolio_items WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async findByPrestadorId(prestador_id: string): Promise<PortfolioItem[]> {
    const { rows } = await pool.query(
      `SELECT * FROM portfolio_items WHERE prestador_id = $1 ORDER BY ordem ASC`,
      [prestador_id],
    );
    return rows;
  }

  async reordenar(items: { id: string; ordem: number }[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          `UPDATE portfolio_items SET ordem = $1 WHERE id = $2`,
          [item.ordem, item.id],
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async countByPrestadorId(prestador_id: string): Promise<number> {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS total FROM portfolio_items WHERE prestador_id = $1`,
      [prestador_id],
    );
    return rows[0].total;
  }
}
