import { pool } from "./postgres";
import { logInfo } from "../../core/utils/httpLogger";

/**
 * Colunas / tabelas que bases antigas (Docker volume, init parcial) podem não ter.
 * Idempotente: IF NOT EXISTS / CREATE IF NOT EXISTS.
 */
export async function applySchemaPatches(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS prestador_categorias (
      prestador_id TEXT NOT NULL REFERENCES prestadores(user_id) ON DELETE CASCADE,
      categoria_id TEXT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (prestador_id, categoria_id)
    );
  `);
  logInfo("db.migrate.patch_ok", { table: "prestador_categorias" });

  await pool.query(`
    ALTER TABLE IF EXISTS audit_logs
    ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id);
  `);
  logInfo("db.migrate.patch_ok", { table: "audit_logs.user_id" });

  await pool.query(`
    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES usuarios(user_id);

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS prestador_id TEXT REFERENCES prestadores(user_id);

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS categoria_id TEXT REFERENCES categorias(id);

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS titulo TEXT;

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS descricao TEXT;

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS preco_acordado DECIMAL(10, 2);

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS data_inicio TIMESTAMP WITH TIME ZONE;

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS duracao TEXT;

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS status TEXT;

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS categoria TEXT;

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS url_imagem TEXT;

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS nota_usuario NUMERIC(3, 1);

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS nota_prestador NUMERIC(3, 1);

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS nota NUMERIC(3, 1);

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    ALTER TABLE IF EXISTS servicos
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  `);

  // Esquema legado: coluna "categoria" (texto) NOT NULL sem categoria_id no INSERT do seed
  await pool.query(`
    DO $patch$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'servicos' AND column_name = 'categoria'
      ) THEN
        ALTER TABLE servicos ALTER COLUMN categoria DROP NOT NULL;
      END IF;
    END
    $patch$;
  `);

  await pool.query(`
    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES usuarios(user_id);

    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS prestador_id TEXT REFERENCES prestadores(user_id);

    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS saldo TEXT;

    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS saldo_bloqueado TEXT;

    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS ultima_transacao_id TEXT;

    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS metodos_de_pagamento TEXT;

    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS status TEXT;

    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    ALTER TABLE IF EXISTS carteiras
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  `);

  // Legado: carteiras.id NOT NULL sem valor no populate (init.sql atual não tem coluna id)
  await pool.query(`
    DO $patch$
    DECLARE
      dt text;
    BEGIN
      SELECT c.data_type INTO dt
      FROM information_schema.columns c
      WHERE c.table_schema = 'public' AND c.table_name = 'carteiras' AND c.column_name = 'id';
      IF dt IS NOT NULL AND dt IN ('text', 'character varying') THEN
        EXECUTE 'ALTER TABLE carteiras ALTER COLUMN id SET DEFAULT gen_random_uuid()::text';
      ELSIF dt = 'uuid' THEN
        EXECUTE 'ALTER TABLE carteiras ALTER COLUMN id SET DEFAULT gen_random_uuid()';
      END IF;
    END
    $patch$;
  `);

  logInfo("db.migrate.patch_ok", { table: "servicos.columns" });
  logInfo("db.migrate.patch_ok", { table: "carteiras.columns" });

  /* Utilizadores de desenvolvimento: JWT/localStorage com id dev-1 ou dev-user (FK servicos). */
  await pool.query(`
    INSERT INTO users (id, email, senha, cpf) VALUES
      ('dev-1', 'dev1@localhost', '$2b$10$iemptuB.Mwgk30cRKQgaAeS0A.U93Us/0Ez59SBXC21XGRq4ZM24O', '10000000001'),
      ('dev-user', 'dev@dev.com', '$2b$10$iemptuB.Mwgk30cRKQgaAeS0A.U93Us/0Ez59SBXC21XGRq4ZM24O', '10000000002')
    ON CONFLICT (id) DO NOTHING;
  `);
  await pool.query(`
    INSERT INTO usuarios (user_id, nome, score, foto_url) VALUES
      ('dev-1', 'Cliente local dev-1', 90, 'https://ui-avatars.com/api/?name=Dev+1'),
      ('dev-user', 'Cliente mock dev', 90, 'https://ui-avatars.com/api/?name=Dev+User')
    ON CONFLICT (user_id) DO NOTHING;
  `);
  await pool.query(`
    INSERT INTO carteiras (user_id, prestador_id, saldo, status)
    SELECT 'dev-1', NULL, '0.00', 'ativa'
    WHERE NOT EXISTS (SELECT 1 FROM carteiras WHERE user_id = 'dev-1' AND prestador_id IS NULL);
  `);
  await pool.query(`
    INSERT INTO carteiras (user_id, prestador_id, saldo, status)
    SELECT 'dev-user', NULL, '0.00', 'ativa'
    WHERE NOT EXISTS (SELECT 1 FROM carteiras WHERE user_id = 'dev-user' AND prestador_id IS NULL);
  `);
  logInfo("db.migrate.patch_ok", { table: "dev_users_seed" });
}
