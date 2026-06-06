import { IServicoRepository } from "../../core/repositories/IServicoRepository";
import { Servico } from "../../core/entities/Servico";
import {
  AtualizarStatusServicoDto,
  AtualizarServicoDto,
} from "../../core/dtos/servico";
import { pool } from "../database/postgres";

export class PgServicoRepository implements IServicoRepository {
  async create(servico: Servico, transaction?: any): Promise<Servico> {
    const executor = transaction || pool;

    const consulta = `
      INSERT INTO servicos (
        id, user_id, prestador_id, categoria_id, titulo, descricao,
        preco_acordado, data_inicio, duracao, categoria, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const valoresServico = [
      servico.id,
      servico.user_id,
      servico.prestador_id,
      servico.categoria_id,
      servico.titulo,
      servico.descricao ?? null,
      servico.preco_acordado ?? 0,
      servico.data_inicio ?? null,
      servico.duracao ?? null,
      servico.categoria ?? null,
      servico.status ?? 'criado',
    ];

    const { rows } = await executor.query(consulta, valoresServico);
    return rows[0];
  }

  async findAll(): Promise<Servico[]> {
    const { rows } = await pool.query(
      "SELECT * FROM servicos ORDER BY created_at DESC",
    );
    return rows;
  }

  async getStats() {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM servicos WHERE status NOT IN ('cancelado', 'finalizado'))::int AS ativos,
        (SELECT COUNT(*) FROM agendamentos WHERE created_at >= NOW() - INTERVAL '7 days')::int AS agendamentos_semana,
        (SELECT COALESCE(SUM(valor::numeric), 0) FROM transacoes
          WHERE created_at >= DATE_TRUNC('month', NOW()))::numeric(10,2) AS receita_mensal,
        (SELECT ROUND(AVG(nota::numeric), 1) FROM servicos WHERE nota IS NOT NULL)::numeric(3,1) AS avaliacao_media
    `);
    return rows[0];
  }

  async findById(id: string): Promise<Servico | null> {
    const { rows } = await pool.query("SELECT * FROM servicos WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  }

  async findByUserId(user_id: string): Promise<Servico[] | null> {
    const { rows } = await pool.query(
      `SELECT * FROM servicos WHERE user_id = $1`,
      [user_id],

    );
    return rows;
  }

  async findByPrestadorId(prestador_id: string): Promise<Servico[] | null> {
    const { rows } = await pool.query(
      "SELECT * FROM servicos WHERE prestador_id = $1 ORDER BY created_at DESC",
      [prestador_id],
    );
    return rows;
  }

  async updateStatus(servico: AtualizarStatusServicoDto): Promise<void> {
    await pool.query("UPDATE servicos SET status = $1 WHERE id = $2", [
      servico.status,
      servico.id,
    ]);
  }

  async updateServico(dados: AtualizarServicoDto): Promise<void> {
    const campos: string[] = [];
    const valores: any[] = [];
    let idx = 1;

    if (dados.titulo !== undefined) {
      campos.push(`titulo = $${idx++}`);
      valores.push(dados.titulo);
    }
    if (dados.descricao !== undefined) {
      campos.push(`descricao = $${idx++}`);
      valores.push(dados.descricao);
    }
    if (dados.categoria !== undefined) {
      campos.push(`categoria = $${idx++}`);
      valores.push(dados.categoria);
    }
    if (dados.preco_acordado !== undefined) {
      campos.push(`preco_acordado = $${idx++}`);
      valores.push(dados.preco_acordado);
    }
    if (dados.data_inicio !== undefined) {
      campos.push(`data_inicio = $${idx++}`);
      valores.push(dados.data_inicio);
    }
    if (dados.duracao !== undefined) {
      campos.push(`duracao = $${idx++}`);
      valores.push(dados.duracao);
    }

    if (campos.length === 0) return;

    valores.push(dados.id);
    await pool.query(
      `UPDATE servicos SET ${campos.join(", ")} WHERE id = $${idx}`,
      valores,
    );
  }
}
