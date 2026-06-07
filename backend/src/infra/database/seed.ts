import { pool } from "./postgres";
import fs from "fs";
import path from "path";

async function seed() {
  const client = await pool.connect();
  try {
    // Limpa os dados existentes respeitando a ordem das FK
    await client.query(`
      TRUNCATE TABLE
        avaliacoes, mensagens, notificacoes, agendamentos,
        transacoes, carteiras, portfolio_items, documentos,
        servicos, prestador_categorias, enderecos,
        prestadores, usuarios, users, categorias
      RESTART IDENTITY CASCADE;
    `);
    console.log("🗑️  Dados antigos removidos.");

    const sql = fs.readFileSync(
      path.join(__dirname, "populate.sql"),
      "utf8"
    );
    await client.query(sql);
    console.log("✅ Seed concluído! Senha de todos os usuários: senha123");
  } catch (err) {
    console.error("❌ Erro ao executar seed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
