import { pool } from "../database/postgres";
import { IMensagemRepository } from "../../core/repositories/IMensagemRepository";
import { Mensagem } from "../../core/entities/Mensagem";

export class PgMensagemRepository implements IMensagemRepository {
  async save(mensagem: Mensagem): Promise<Mensagem> {
    const consulta = `
      INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia)
      VALUES (gen_random_uuid(), $1, $2, $3, $4)
      RETURNING *;
    `;
    const valores = [
      mensagem.servico_id,
      mensagem.remetente_id,
      mensagem.conteudo,
      mensagem.tipo_midia ?? "texto",
    ];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
  }

  async findByServicoId(servico_id: string): Promise<Mensagem[]> {
    const { rows } = await pool.query(
      "SELECT * FROM mensagens WHERE servico_id = $1 ORDER BY created_at ASC, id ASC",
      [servico_id],
    );
    return rows;
  }

  async findByUserId(user_id: string): Promise<Mensagem[]> {
    // Busca todas as mensagens de serviços onde o usuário é o contratante
    const { rows } = await pool.query(
      `SELECT m.* FROM mensagens m
       JOIN servicos s ON s.id = m.servico_id
       WHERE s.user_id = $1
       ORDER BY m.created_at ASC, m.id ASC`,
      [user_id],
    );
    return rows;
  }

  async findByPrestadorId(prestador_id: string): Promise<Mensagem[]> {
    const { rows } = await pool.query(
      `SELECT m.* FROM mensagens m
       JOIN servicos s ON s.id = m.servico_id
       WHERE s.prestador_id = $1
       ORDER BY m.created_at ASC, m.id ASC`,
      [prestador_id],
    );
    return rows;
  }

  async marcarComoLida(
    mensagem_id: string,
    remetente_id: string,
  ): Promise<void> {
    // Só marca como lida se quem está lendo NÃO é o remetente
    await pool.query(
      `UPDATE mensagens
       SET lida_em = NOW()
       WHERE id = $1
         AND remetente_id != $2
         AND lida_em IS NULL`,
      [mensagem_id, remetente_id],
    );
  }
}
