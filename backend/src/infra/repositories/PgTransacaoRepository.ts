import { pool } from "../database/postgres";
import { ITransacaoRepository } from "../../core/repositories/ITransacaoRepository";
import { Transacao } from "../../core/entities/Transacao";

export class PgTransacaoRepository implements ITransacaoRepository {
  async create(transacao: Transacao, transaction?: any): Promise<Transacao> {
    const executor = transaction || pool;

    const consulta = `
      INSERT INTO transacoes (
        id, servico_id, tipo, status, valor, descricao, metodo_pagamento
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const valores = [
      transacao.servico_id,
      transacao.tipo,
      transacao.status,
      transacao.valor,
      transacao.descricao,
      transacao.metodo_pagamento,
    ];

    const { rows } = await executor.query(consulta, valores);
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM transacoes WHERE id = $1", [id]);
  }

  async update(
    id: string,
    transacao: Partial<Transacao>,
  ): Promise<Transacao | null> {
    const query = `
      UPDATE transacoes
      SET 
        tipo = $1,
        status = $2,
        valor = $3,
        descricao = $4,
        metodo_pagamento = $5
      WHERE id = $6
      RETURNING *
    `;

    const values = [
      transacao.tipo,
      transacao.status,
      transacao.valor,
      transacao.descricao,
      transacao.metodo_pagamento,
      id,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async findByServicoId(servico_id: string): Promise<Transacao | null> {
    const { rows } = await pool.query(
      "SELECT * FROM transacoes WHERE servico_id = $1",
      [servico_id],
    );
    return rows[0] || null;
  }

  async findByUserId(user_id: string): Promise<Transacao[] | null> {
    const { rows } = await pool.query(
      `
      SELECT t.* FROM transacoes t
      JOIN servicos s ON s.id = t.servico_id
      WHERE s.user_id = $1
      ORDER BY t.created_at DESC
    `,
      [user_id],
    );
    return rows || null;
  }

  async findByPrestadorId(prestador_id: string): Promise<Transacao[] | null> {
    const { rows } = await pool.query(
      `
      SELECT t.* FROM transacoes t
      JOIN servicos s ON s.id = t.servico_id
      WHERE s.prestador_id = $1
      ORDER BY t.created_at DESC
    `,
      [prestador_id],
    );
    return rows || null;
  }
}
