import { pool } from '../database/postgres';
import { IExploreRepository, ExploreCategoria, ExploreCard } from '../../core/repositories/IExploreRepository';

export class PgExploreRepository implements IExploreRepository {
  async buscarParaExplore(): Promise<ExploreCategoria[]> {
    const { rows } = await pool.query(`
      SELECT
        c.id        AS categoria_id,
        c.nome      AS categoria_nome,
        p.user_id,
        p.nome,
        p.score,
        p.foto_url,
        e.cidade,
        e.estado,
        (
          SELECT COALESCE(
            json_agg(
              json_build_object('url', pi.url, 'tipo', pi.tipo, 'ordem', pi.ordem)
              ORDER BY pi.ordem
            ),
            '[]'::json
          )
          FROM portfolio_items pi
          WHERE pi.prestador_id = p.user_id
        ) AS portfolio,
        (
          SELECT COALESCE(array_agg(c2.nome ORDER BY c2.nome), '{}')
          FROM prestador_categorias pc2
          JOIN categorias c2 ON c2.id = pc2.categoria_id
          WHERE pc2.prestador_id = p.user_id
        ) AS tags
      FROM categorias c
      JOIN prestador_categorias pc ON pc.categoria_id = c.id
      JOIN prestadores p ON p.user_id = pc.prestador_id
      LEFT JOIN enderecos e ON e.user_id = p.user_id AND e.is_principal = true
      ORDER BY c.nome, p.score DESC
    `);

    const grouped = new Map<string, ExploreCategoria>();

    for (const row of rows) {
      if (!grouped.has(row.categoria_id)) {
        grouped.set(row.categoria_id, {
          categoria_id: row.categoria_id,
          categoria: row.categoria_nome,
          prestadores: [],
        });
      }

      const card: ExploreCard = {
        user_id: row.user_id,
        nome: row.nome,
        score: row.score,
        foto_url: row.foto_url,
        cidade: row.cidade,
        estado: row.estado,
        portfolio: row.portfolio ?? [],
        tags: row.tags ?? [],
      };

      grouped.get(row.categoria_id)!.prestadores.push(card);
    }

    return Array.from(grouped.values());
  }
}
