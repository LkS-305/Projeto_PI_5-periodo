-- Executar uma vez em bases já criadas antes desta tabela existir no init.sql
CREATE TABLE IF NOT EXISTS verificacao_email_cadastro (
    email TEXT PRIMARY KEY,
    codigo TEXT NOT NULL,
    expira_em TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
