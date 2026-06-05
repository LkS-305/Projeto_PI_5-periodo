import { pool } from "../database/postgres";
import { ITransacaoRepository } from "../../core/repositories/ITransacaoRepository";
import { Transacao } from "../../core/entities/Transacao";

export class PgTransacaoRepository implements ITransacaoRepository {
  async create(transacao: Transacao, transaction?: any): Promise<Transacao> {
    const executor = transaction || pool;

    const consulta = `
      INSERT INTO transacoes (
        id, servico_id, tipo, status, valor, descricao, metodo_pagamento, asaas_payment_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const valores = [
      transacao.id,
      transacao.servico_id,
      transacao.tipo,
      transacao.status,
      transacao.valor,
      transacao.descricao ?? null,
      transacao.metodo_pagamento,
      transacao.asaas_payment_id ?? null,
    ];

    const { rows } = await executor.query(consulta, valores);
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM transacoes WHERE id = $1", [id]);
  }

  // COALESCE preserves existing values for fields not included in the partial update
  async update(id: string, transacao: Partial<Transacao>): Promise<Transacao | null> {
    const query = `
      UPDATE transacoes SET
        tipo             = COALESCE($1, tipo),
        status           = COALESCE($2, status),
        valor            = COALESCE($3, valor),
        descricao        = COALESCE($4, descricao),
        metodo_pagamento = COALESCE($5, metodo_pagamento),
        asaas_payment_id = COALESCE($6, asaas_payment_id)
      WHERE id = $7
      RETURNING *
    `;

    const values = [
      transacao.tipo           ?? null,
      transacao.status         ?? null,
      transacao.valor          ?? null,
      transacao.descricao      ?? null,
      transacao.metodo_pagamento ?? null,
      transacao.asaas_payment_id ?? null,
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
      `SELECT t.* FROM transacoes t
       JOIN servicos s ON s.id = t.servico_id
       WHERE s.user_id = $1
       ORDER BY t.created_at DESC`,
      [user_id],
    );
    return rows || null;
  }

  async findByPrestadorId(prestador_id: string): Promise<Transacao[] | null> {
    const { rows } = await pool.query(
      `SELECT t.* FROM transacoes t
       JOIN servicos s ON s.id = t.servico_id
       WHERE s.prestador_id = $1
       ORDER BY t.created_at DESC`,
      [prestador_id],
    );
    return rows || null;
  }

  async findByAsaasPaymentId(asaas_payment_id: string): Promise<Transacao | null> {
    const { rows } = await pool.query(
      "SELECT * FROM transacoes WHERE asaas_payment_id = $1",
      [asaas_payment_id],
    );
    return rows[0] || null;
  }

  async findPrestadorIdByServicoId(servico_id: string): Promise<string | null> {
    const { rows } = await pool.query(
      "SELECT prestador_id FROM servicos WHERE id = $1",
      [servico_id],
    );
    return rows[0]?.prestador_id ?? null;
  }
}
