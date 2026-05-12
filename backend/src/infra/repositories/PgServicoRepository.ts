import { IServicoRepository } from "../../core/repositories/IServicoRepository";
import { Servico } from "../../core/entities/Servico";
import { AtualizarStatusServicoDto, AtualizarServicoDto, CriarServicoDto } from "../../core/dtos/servico";
import { pool } from "../database/postgres";
import { AtualizarStatus } from "../../core/use-cases/financeiro/CarteiraUseCase";

export class PgServicoRepository implements IServicoRepository {
  async create(servico: CriarServicoDto, transaction?: any): Promise<Servico> {
    const executor = transaction || pool;

    const consultaServico = `
      INSERT INTO servicos (
        id, usuario_id, prestador_id, id_agendamento, id_transacao, titulo, categoria
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const valoresServico = [
      servico.usuario_id,
      servico.prestador_id,
      servico.titulo,
      servico.categoria,
    ];

    const { rows } = await executor.query(consultaServico, valoresServico);
    return rows[0];
  }

  async findAll(): Promise<Servico[]> {
    const { rows } = await pool.query("SELECT * FROM servicos ORDER BY created_at DESC");
    return rows;
  }

  async getStats() {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM servicos WHERE ativo = true)::int                          AS ativos,
        (SELECT COUNT(*) FROM agendamentos WHERE created_at >= NOW() - INTERVAL '7 days')::int AS agendamentos_semana,
        (SELECT COALESCE(SUM(valor::numeric), 0) FROM transacoes
          WHERE created_at >= DATE_TRUNC('month', NOW()))::numeric(10,2)                 AS receita_mensal,
        (SELECT ROUND(AVG(nota), 1) FROM servicos WHERE nota IS NOT NULL)::numeric(3,1)  AS avaliacao_media
    `);
    return rows[0];
  }

  async updateStatus(servico: AtualizarStatusServicoDto): Promise<void> {
    await pool.query("UPDATE servicos SET status = $1 WHERE id = $2", [
      servico.status,
      servico.id,
    ]);
  }

  async findById(id: string): Promise<Servico | null> {
    const { rows } = await pool.query("SELECT * FROM servicos WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  }

  async findByUserId(usuario_id: string): Promise<Servico[] | null> {
    const { rows } = await pool.query(
      "SELECT * FROM servicos WHERE usuario_id = $1",
      [usuario_id],
    );
    return rows;
  }

  async findByPrestadorId(prestador_id: string): Promise<Servico[] | null> {
    const { rows } = await pool.query(
      "SELECT * FROM servicos WHERE prestador_id = $1",
      [prestador_id],
    );
    return rows;
  }

  async updateServico(servico: AtualizarServicoDto): Promise<void> {
    await pool.query(
      "UPDATE servicos SET titulo = $1, categoria = $2 WHERE id = $3",
      [servico.titulo, servico.categoria, servico.id]
    );
  }
}
