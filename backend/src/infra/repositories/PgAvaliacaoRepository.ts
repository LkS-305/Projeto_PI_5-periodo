import { IAvaliacaoRepository } from '../../core/repositories/IAvaliacaoRepository';
import { Avaliacao } from '../../core/entities/Avaliacao';
import { pool } from '../database/postgres';

import { CriarAvaliacaoDto } from '../../core/dtos/avaliacao';
import { randomUUID } from 'crypto';

export class PgAvaliacaoRepository implements IAvaliacaoRepository {
  async create(avaliacao: CriarAvaliacaoDto): Promise<Avaliacao | null> {
    const { servico_id, usuario_id, prestador_id, nota, comentario, media, destinatario } = avaliacao;
    if (!destinatario) return null;

    const id = randomUUID();
    const notaStr = String(nota);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO avaliacoes (id, servico_id, usuario_id, prestador_id, nota, comentario, media, destinatario)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, servico_id, usuario_id, prestador_id,
           CAST(NULLIF(TRIM(nota), '') AS NUMERIC(4,1)) AS nota,
           comentario, media, destinatario, created_at, updated_at`,
        [
          id,
          servico_id ?? null,
          usuario_id ?? null,
          prestador_id ?? null,
          notaStr,
          comentario ?? null,
          media ?? null,
          destinatario,
        ],
      );

      const row = rows[0];
      if (!row) {
        await client.query('ROLLBACK');
        return null;
      }

      if (servico_id) {
        if (destinatario === 'prestador') {
          await client.query(
            'UPDATE servicos SET nota_prestador = $1::numeric WHERE id = $2',
            [nota, servico_id],
          );
        } else if (destinatario === 'usuario') {
          await client.query(
            'UPDATE servicos SET nota_usuario = $1::numeric WHERE id = $2',
            [nota, servico_id],
          );
        } else if (destinatario === 'servico') {
          await client.query('UPDATE servicos SET nota = $1::numeric WHERE id = $2', [nota, servico_id]);
        }
      }

      await client.query('COMMIT');

      return new Avaliacao(
        {
          servico_id: row.servico_id ?? undefined,
          usuario_id: row.usuario_id ?? undefined,
          prestador_id: row.prestador_id ?? undefined,
          nota: Number(row.nota),
          comentario: row.comentario ?? undefined,
          media: row.media ?? undefined,
          destinatario: row.destinatario,
        },
        row.id,
      );
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM avaliacoes WHERE id = $1', [id]);
  }

  async update(id: string, dados: Partial<CriarAvaliacaoDto>): Promise<Avaliacao | null> {
    const { nota, comentario, media } = dados;
    const notaVal = nota !== undefined ? String(nota) : undefined;
    const { rows } = await pool.query(
      `UPDATE avaliacoes SET
         nota = COALESCE($1::text, nota),
         comentario = COALESCE($2, comentario),
         media = COALESCE($3, media)
       WHERE id = $4
       RETURNING id, servico_id, usuario_id, prestador_id,
         CAST(NULLIF(TRIM(nota), '') AS NUMERIC(4,1)) AS nota,
         comentario, media, destinatario, created_at, updated_at`,
      [notaVal ?? null, comentario ?? null, media ?? null, id],
    );
    const row = rows[0];
    if (!row) return null;
    return new Avaliacao(
      {
        servico_id: row.servico_id ?? undefined,
        usuario_id: row.usuario_id ?? undefined,
        prestador_id: row.prestador_id ?? undefined,
        nota: Number(row.nota),
        comentario: row.comentario ?? undefined,
        media: row.media ?? undefined,
        destinatario: row.destinatario,
      },
      row.id,
    );
  }

  async listBy(id: string, listBy: string): Promise<Avaliacao[] | null> {
    const listarDaTabela = `
        SELECT id, servico_id, usuario_id, prestador_id,
               CAST(NULLIF(TRIM(COALESCE(nota, '')), '') AS NUMERIC(4,1)) AS nota,
               comentario, media, destinatario, created_at, updated_at
        FROM avaliacoes`;

    if (listBy == 'usuario') {
      const { rows } = await pool.query(
        `${listarDaTabela}
         WHERE usuario_id = $1
         ORDER BY created_at DESC`,
        [id],
      );
      return rows?.length ? rows : null;
    }
    if (listBy == 'prestador') {
      const { rows } = await pool.query(
        `${listarDaTabela}
         WHERE prestador_id = $1
         ORDER BY created_at DESC`,
        [id],
      );
      return rows?.length ? rows : null;
    }
    if (listBy == 'servico') {
      const { rows } = await pool.query(
        `${listarDaTabela}
         WHERE servico_id = $1
         ORDER BY created_at DESC`,
        [id],
      );
      return rows ?? [];
    }
    if (listBy == 'avaliacao') {
      const { rows } = await pool.query(
        `${listarDaTabela}
         WHERE id = $1`,
        [id],
      );
      return rows.length ? rows : null;
    }

    return null;
  }
}
