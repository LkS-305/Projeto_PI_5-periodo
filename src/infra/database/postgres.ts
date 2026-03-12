import { Pool } from 'pg';

// Configuração baseada no seu Docker
export const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'dataset',
  password: 'admin',
  port: 5432,
});

// Log para confirmar que o banco está vivo
pool.on('connect', () => {
  console.log('🐘 Postgres: Conexão estabelecida com sucesso!');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool do Postgres:', err);
});
