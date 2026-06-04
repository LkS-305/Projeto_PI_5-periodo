import { pool } from '../database/postgres';
import { IPrestadorCategoriaRepository } from '../../core/repositories/IPrestadorCategoriaRepository';
import { Categoria } from '../../core/entities/Categoria';
import { Prestador } from '../../core/entities/Prestador';

export class PgPrestadorCategoriaRepository implements IPrestadorCategoriaRepository {
  async adicionar(prestador_id: string, categoria_id: string): Promise<void> {
    await pool.query(
      `INSERT INTO prestador_categorias (prestador_id, categoria_id)
       VALUES ($1, $2)
       ON CONFLICT (prestador_id, categoria_id) DO NOTHING`,
      [prestador_id, categoria_id],
    );
  }

  async remover(prestador_id: string, categoria_id: string): Promise<void> {
    await pool.query(
      `DELETE FROM prestador_categorias
       WHERE prestador_id = $1 AND categoria_id = $2`,
      [prestador_id, categoria_id],
    );
  }

  async listarPorPrestador(prestador_id: string): Promise<Categoria[]> {
    const { rows } = await pool.query(
      `SELECT c.*
       FROM categorias c
       JOIN prestador_categorias pc ON pc.categoria_id = c.id
       WHERE pc.prestador_id = $1
       ORDER BY c.nome`,
      [prestador_id],
    );
    return rows;
  }

  async listarPrestadoresPorCategoria(categoria_id: string): Promise<Prestador[]> {
    const { rows } = await pool.query(
      `SELECT p.*
       FROM prestadores p
       JOIN prestador_categorias pc ON pc.prestador_id = p.user_id
       WHERE pc.categoria_id = $1
       ORDER BY p.nome`,
      [categoria_id],
    );
    return rows;
  }
}
