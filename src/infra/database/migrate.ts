import { pool } from './postgres';
import fs from 'fs';
import path from 'path';

export async function runMigrations() {
  try {
    const sqlPath = path.join(__dirname, './init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    console.log("🚀 Tabelas criadas/verificadas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao rodar migrações:", err);
  }
}

// Se quiser rodar direto via terminal: npx ts-node src/infra/database/migrate.ts
if (require.main === module) {
  runMigrations().then(() => process.exit());
}
