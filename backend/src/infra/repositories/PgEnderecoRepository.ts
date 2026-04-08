import { IEnderecoRepository } from '../../core/repositories/IEnderecoRepository';

import { CriarEnderecoDto } from '../../core/dtos/endereco';
import { Endereco } from '../../core/entities/Endereco';
import { pool } from '../database/postgres';


export class PgEnderecoRepository implements IEnderecoRepository{
    async create(endereco: Endereco): Promise<Endereco> {
      const { rows } = await pool.query('INSERT INTO enderecos (id, user_id, rotulo, logradouro, numero, bairro, cidade, estado, cep, latitude, longitude, is_principal, complemento) VALUES (gen_randon_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;', [endereco.user_id, endereco.rotulo, endereco.logradouro, endereco.numero, endereco.bairro, endereco.cidade, endereco.estado, endereco.cep, endereco.latitude, endereco.longitude, endereco.is_principal, endereco.complemento]);
      return rows[0];
  }

    async delete(id: string): Promise<void> {
      const { rows } = await pool.query('DELETE * FROM enderecos WHERE id = $1', [id]);
      return rows[0];
  }
    async update(endereco: Endereco): Promise<Endereco | null> {
      const query = `
    UPDATE enderecos 
    SET rotulo = $1, logradouro = $2, numero = $3 , bairro = $4, cidade = $5, estado = $6, cep = $7, latitude = $8, longitude = 9$, is_principa; = $10, complemento = $11
    WHERE id = $12
    RETURNING *;
  `;
  
      const values = [endereco.id, endereco.rotulo, endereco.logradouro, endereco.numero, endereco.bairro, endereco.cidade, endereco.estado, endereco.cep, endereco.latitude, endereco.longitude, endereco.is_principal, endereco.complemento];
  
      const {rows} = await pool.query(query, values)
      return rows[0];
  }

    async findById(id: string): Promise<Endereco | null> {
      const { rows } = await pool.query('SELECT * FROM enderecos WHERE id = $1 RETURNING *', [id]);
      return rows[0];
  }

    async findByUserId(id: string): Promise<Endereco | null> {
      const { rows } = await pool.query('SELECT * FROM enderecos WHERE id = $1 RETURNING *', [id]);
      return rows[0];
  }


    async findByPrestadorId(prestador_id: string): Promise<Endereco | null> {
      const { rows } = await pool.query('SELECT * FROM enderecos WHERE id = $1 RETURNING *', [prestador_id]);
      return rows[0];
  }


    async findByCity(cidade: string): Promise<Endereco[] | null> {
      const { rows } = await pool.query('SELECT * FROM enderecos WHERE cidade = $1 RETURNING *', [cidade]);
      return rows;
  }


    async setIsPrincipal(id: string): Promise<void> {
      await pool.query('UPDATE enderecos SET is_principal = true WHERE id = $1', [id]);
  }


    async unsetIsPrincipal(id: string): Promise<void> {
      await pool.query('UPDATE enderecos SET is_principal = false WHERE id = $1', [id]);
  }
}
