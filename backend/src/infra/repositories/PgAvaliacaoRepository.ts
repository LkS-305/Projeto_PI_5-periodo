import { IAvaliacaoRepository } from '../../core/repositories/IAvaliacaoRepository';
import { Avaliacao } from '../../core/entities/Avaliacao';
import { pool } from '../database/postgres';

import { CriarAvaliacaoDto } from '../../core/dtos/avaliacao';

export class PgAvaliacaoRepository implements IAvaliacaoRepository {
  async create(avaliacao: CriarAvaliacaoDto): Promise<Avaliacao | null>{

    const { servico_id, usuario_id, prestador_id, nota, comentario, media, destinatario} = avaliacao;
    
    if (destinatario == 'usuario') {
      const { rows } = await pool.query('INSERT INTO avaliacoes (id, usuario_id, prestador_id, nota, comentario, media, destinatario) VALUES (uuid, $1, $2, $3, $4, $5, 6$)', [usuario_id, prestador_id, nota, comentario, media, destinatario]);
    return rows[0];
    }

    else if (destinatario == 'prestador') {
     const{ rows } = await pool.query('INSERT INTO avaliacoes (id, prestador_id, usuario_id, nota, comentario, media, destinatario) VALUES (uuid, $1, $2, $3, $4, $5, $6)', [prestador_id, usuario_id, nota, media, comentario, destinatario]);
      
    return rows[0];

    }
    else if (destinatario == 'servico') {
      const { rows } = await pool.query('INSERT INTO avaliacoes (id, servico_id, usuario_id, prestador_id, nota, comentario, media, destinatario) VALUES (uuid, $1, $2, $3, $4, $5, $6, $7)', [servico_id, prestador_id, usuario_id, nota, media, comentario, destinatario]);
    
      return rows[0];

    }

    return null;
  }


  async delete(id: string): Promise<void> {
    await pool.query('DELETE * FROM avaliacoes WHERE id = $1', [id]);
  }

  async update(id: string, dados: Partial<CriarAvaliacaoDto>): Promise<Avaliacao | null> {
    const {nota, comentario, media} = dados;
    const { rows } = await pool.query('UPDATE avaliacoes SET nota = $1, comentario = $2, media = $3 WHERE id = $4 RETURNING *', [nota, comentario, media, id]);
    return rows[0] || null;
  }

  async listBy(id: string, listBy: string): Promise<Avaliacao[] | null>{

    if(listBy == "usuario" ) {
      const { rows } = await pool.query('SELECT nota, avaliacoes FROM  servicos WHERE usuario_id = $1', [id]);
      return rows ?? null;
    }
    else if (listBy == "prestador") {
      const { rows } = await pool.query('SELECT nota, avaliacoes FROM  servicos WHERE prestador_id = $1', [id]);
      return rows ?? null;
    }
    else if (listBy == "servico" ) {

      const { rows } = await pool.query('SELECT nota, avaliacoes FROM  servicos WHERE servico_id = $1', [id]);
      return rows ?? null;
    }
    else if (listBy == 'avaliacao') {
      const { rows } = await pool.query('SELECT nota, avaliacoes FROM  servicos WHERE id = $1', [id]);
      return rows ?? null; 
    }

    return null;

  }
}

