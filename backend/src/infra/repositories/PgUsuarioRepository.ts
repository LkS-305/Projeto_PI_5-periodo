import { IUserRepository } from '../../core/repositories/IUserRepository';
import { User } from '../../core/entities/User';
import { pool } from '../database/postgres';
import { CriarUsuarioDto } from '../../core/dtos/usuario';

export class PgUsuarioRepository implements IUserRepository {
  async create(usuario: CriarUsuarioDto): Promise<Partial<User>> {
    const consulta = `
      INSERT INTO usuarios (id, email, senha)
      VALUES (gen_random_uuid(), $1, $2)
      RETURNING *;
    `;
    const valores = [usuario.email, usuario.senha];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
  }

  async delete(id: string){
    const { rows } = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }

async update(id: string, dados: User): Promise<User | null> {
    const query = `
        UPDATE usuarios 
        SET 
            nome = $1, 
            email = $2, 
            senha = $3, 
            endereco = $4,
            cpf = $5, 
            score = $6,
            foto_url = $7, 
            tipo_usuario = $8
        WHERE id = $9
        RETURNING *
    `;

    const values = [
        dados.nome,
        dados.email,
        dados.senha,
        dados.endereco,
        dados.cpf,
        dados.score,
        dados.foto_url,
        dados.tipo_usuario,
        id 
    ];

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
}

  async login(email: string, password: string): Promise<User | null> {
  const { rows } = await pool.query('select * from usuarios where email = $1 and password = $2', [email, password]);
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

  
}
