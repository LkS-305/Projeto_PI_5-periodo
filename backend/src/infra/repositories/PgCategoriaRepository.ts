import { ICategoriaRepository } from '../../core/repositories/ICategoriaRepository';
import { Categoria } from '../../core/entities/Categoria';
import { pool } from '../database/postgres';
import { AppError } from '../../core/errors/AppError';

export class PgCategoriaRepository implements ICategoriaRepository {
  
  async create(categoria: Categoria): Promise<void> {
    const consulta = `INSERT INTO categorias (id, nome, slug, icon_url) VALUES ($1, $2, $3, $4) RETURNING *`;

    const valores = [categoria.id, categoria.nome, categoria.slug, categoria.icon_url]
    
    try {
      await pool.query(consulta, valores);
    } catch (error: any) {

      // Erro de violação de restrição única (Ex: Email ou CPF já existem)
      if (error.code === '23505') {

        const detail = error.detail; // O Postgres costuma dizer qual campo falhou
        if (detail.includes('id')) {
          throw new AppError('Este id ja esta em uso.', 400);
        }
      }

    // Erro genérico de banco (Conexão, sintaxe, etc)
    console.error('Database Error:', error);
    throw new AppError('Erro interno ao processar o cadastro no banco de dados.', 500);
   }

  }

  async delete(id: string): Promise<void> {
    const { rows } = await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    return rows[0];
  }

  async update(categoria: Categoria): Promise<void> {
    const { rows } = await pool.query(
      'UPDATE categorias SET nome = $1, slug = $2, icon_url = $3 WHERE id = $4 RETURNING *',
      [categoria.nome, categoria.slug, categoria.icon_url, categoria.id]
    );
    return rows[0];
  }

  async findById(id: string): Promise<Categoria | null> {
    const { rows } = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async findAll(): Promise<Categoria[] | null> {
    const { rows } = await pool.query('SELECT * FROM categorias ORDER BY nome ASC');
    return rows;
  }
  async findByName(nome: string): Promise<Categoria | null>{
    const { rows } = await pool.query('SELECT * FROM categorias WHERE nome = $1', [nome]);
    return rows[0];
  }
}
