import { pool } from '../database/postgres';
import { IAgendamentosRepository } from '../../core/repositories/IAgendamentosRepository';
import { Agendamento } from '../../core/entities/Agendamento';

export class PgAgendamentosRepository implements IAgendamentosRepository {
  
  async create(agendamento: Agendamento, transaction?: any): Promise<Agendamento> {
    const executor = transaction || pool;

    const consulta = `
      INSERT INTO agendamentos (
        id, user_id, prestador_id, dia_semana, hora_inicio, hora_fim
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
      RETURNING *;
    `;   

    const valores = [
      agendamento.user_id,
      agendamento.prestador_id,
      agendamento.dia_semana,
      agendamento.hora_inicio,
      agendamento.hora_fim,
    ]

    const { rows } = await executor.query(consulta, valores);
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query(' DELETE * FROM agendamentos WHERE id = $1 RETURNING *', [id]);
  }
  
  async update(id: string, agendamento: Partial<Agendamento>): Promise<Agendamento | null> {
    const query = `
        UPDATE agendamentos
        SET 
            dia_semana = $1, 
            hora_inicio = $2, 
            hora_fim = $3, 
        WHERE id = $4
        RETURNING *
    `;

    const values = [
      agendamento.dia_semana,
      agendamento.hora_inicio,
      agendamento.hora_fim,
      id
    ];

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async findById(id: string): Promise<Agendamento | null> {
    const { rows } = await pool.query('SELECT * FROM agendamentos WHERE id = $1', [id]);
    return rows[0] || null;
  }
  
  async findByUserId(user_id: string): Promise<Agendamento[] | null> {
    const { rows } = await pool.query('SELECT * FROM agendamentos WHERE id = $1', [user_id]);
    return rows || null;
  }
  
  async findByPrestadorId(prestador_id: string): Promise<Agendamento[] | null> {
    const { rows } = await pool.query('SELECT * FROM agendamentos WHERE id = $1', [prestador_id]);
    return rows || null;
  }
}
