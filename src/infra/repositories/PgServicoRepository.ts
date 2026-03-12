import { IServicoRepository } from '../../core/repositories/IServicoRepository';
import { Servico } from '../../core/entities/Servico';
import { CriarServicoDto } from '../../core/dtos/servico';
import { pool } from '../database/postgres';

export class PgServicoRepository implements IServicoRepository {
  async create(servico: CriarServicoDto): Promise<Servico> {
    const consulta = `
      INSERT INTO servicos (
        id, user_id, prestador_id, titulo, preco_acordado, 
        data_acordada, duracao, categoria
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const valores = [
      servico.user_id, 
      servico.prestador_id, 
      servico.titulo, 
      servico.preco_acordado, 
      servico.data_acordada, 
      servico.duracao, 
      servico.categoria
    ];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await pool.query('UPDATE servicos SET status = $1 WHERE id = $2', [status, id]);
  }

  async findById(id: string): Promise<Servico | null> {
    const { rows } = await pool.query('SELECT * FROM servicos WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async findByUserId(usuario_id: string): Promise<Servico[] | null> {
    const { rows } = await pool.query('SELECT * FROM servicos WHERE user_id = $1', [usuario_id]);
    return rows;
  }

  async findByPrestadorId(prestador_id: string): Promise<Servico[] | null> {

    const { rows } = await pool.query('SELECT * FROM servicos WHERE prestador_id = $1', [prestador_id]);
    return rows;
 
  }
}
