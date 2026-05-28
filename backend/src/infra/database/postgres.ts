import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuração baseada no seu Docker
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Log para confirmar que o banco está vivo
pool.on('connect', () => {
  console.log('Postgres: Conexão estabelecida com sucesso!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do Postgres:', err);
});

// O evento 'acquire' dispara sempre que o pool entrega um cliente para uso
pool.on('acquire', (client) => {
    // Verificamos se o ouvinte já não foi adicionado para não duplicar logs
    if (!client.listeners('notice').length) {
        client.on('notice', (msg) => {
            const message = msg.message;
            let color = '\x1b[94m'; // Azul claro (padrão)

            if (message){
              if (message.includes('INSERT')) {
                color = '\x1b[32m'; // Verde
              } else if (message.includes('DELETE')) {
                color = '\x1b[31m'; // Vermelho
              } else if (message.includes('UPDATE')) {
                color = '\x1b[33m'; // Amarelo
              }
            }

  console.log(`${color}Postgres ${message}\x1b[0m`);
        });
    }
});
