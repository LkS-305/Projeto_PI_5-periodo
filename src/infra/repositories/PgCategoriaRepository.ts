import { ICategoriaRepository } from '../../core/repositories/ICategoriaRepository';
import { Categoria } from '../../core/entities/Categoria';
import { pool } from '../database/postgres';

export class PgCategoriaRepository implements ICategoriaRepository {
  
  async create(categoria: Categoria): Promise<Categoria> {
    const { rows } = await pool.query(
      'INSERT INTO categorias (id, nome) VALUES (gen_random_uuid(), $1) RETURNING *',
      [categoria.nome]
    );
    return rows[0];
  }

  async update(categoria: Categoria): Promise<Categoria> {
    const { rows } = await pool.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [categoria.nome, categoria.id]
    );
    return rows[0];
  }

  async findById(id: string): Promise<Categoria | null> {
    const { rows } = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async findAll(): Promise<Categoria[]> {
    const { rows } = await pool.query('SELECT * FROM categorias ORDER BY nome ASC');
    return rows;
  }
  async findByName(nome: string): Promise<Categoria | null>{
    const { rows } = await pool.query('SELECT * FROM categorias WHERE nome = $1', [nome]);
    return rows[0];
  }
}
