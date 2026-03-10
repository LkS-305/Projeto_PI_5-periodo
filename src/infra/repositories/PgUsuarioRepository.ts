import { IUserRepository } from '../../core/repositories/IUserRepository';
import { User } from '../../core/entities/User';
import { pool } from '../database/postgres';

export class PgUsuarioRepository implements IUserRepository {
  async create(usuario: User): Promise<User> {
    const consulta = `
      INSERT INTO usuarios (id, nome, email, senha, tipo_usuario)
      VALUES (gen_random_uuid(), $1, $2, $3, $4)
      RETURNING *;
    `;
    const valores = [usuario.nome, usuario.email, usuario.senha, usuario.tipo_usuario];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
  }
   
  async login(email: string, password: string): Promise<User | null> {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND password = $2', [email, password]);
  return rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async delete(id: string){
    const { rows } = await pool.query(' DELETE * FROM usuarios WHERE id = $1', [id]);
    return rows[0];
  }
  
}
