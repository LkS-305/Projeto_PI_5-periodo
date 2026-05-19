-- Habilita a extensão para UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\i functions/gerarLogsAuditoria.sql
\i triggers/audit.sql
-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Tabela de Users (autenticação)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    recovery_token TEXT,
    recovery_token_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Usuarios (perfis)
CREATE TABLE IF NOT EXISTS usuarios (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Prestadores
CREATE TABLE IF NOT EXISTS prestadores (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    bio TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    foto_url TEXT,
    status_verificacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Servicos
CREATE TABLE IF NOT EXISTS servicos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES usuarios(user_id),
    prestador_id TEXT NOT NULL REFERENCES prestadores(user_id),
    titulo TEXT NOT NULL,
    descricao TEXT,
    preco_acordado DECIMAL(10, 2) NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    duracao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    status TEXT,
    url_imagem TEXT,
    nota_usuario NUMERIC(3, 1),
    nota_prestador NUMERIC(3, 1),
    nota NUMERIC(3, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 6. Tabela de Avaliacoes
CREATE TABLE IF NOT EXISTS avaliacoes (
    id TEXT PRIMARY KEY,
    servico_id TEXT REFERENCES servicos(id),
    user_id TEXT REFERENCES usuarios(user_id),
    prestador_id TEXT REFERENCES prestadores(user_id),
    listBy TEXT,
    avaliarBy TEXT,
    nota TEXT NOT NULL,
    comentario TEXT,
    media TEXT,
    destinatario TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Carteiras
CREATE TABLE IF NOT EXISTS carteiras (
    id TEXT PRIMARY KEY,
    usuario_id TEXT REFERENCES usuarios(user_id),
    prestador_id TEXT REFERENCES prestadores(user_id),
    saldo TEXT NOT NULL,
    saldo_bloqueado TEXT,
    ultima_transacao_id TEXT,
    metodos_de_pagamento TEXT,
    status TEXT NOT NULL CHECK (status IN ('ativa', 'bloqueada', 'em_verificacao')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de Transacoes
CREATE TABLE IF NOT EXISTS transacoes (
    id TEXT PRIMARY KEY,
    servico_id TEXT NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    status TEXT NOT NULL,
    valor TEXT NOT NULL,
    descricao TEXT,
    metodo_pagamento TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES usuarios(user_id) ON DELETE CASCADE,
    prestador_id TEXT NOT NULL REFERENCES prestadores(user_id) ON DELETE CASCADE,
    dia_semana TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fim TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabela de Mensagens
CREATE TABLE IF NOT EXISTS mensagens (
    id TEXT PRIMARY KEY,
    servico_id TEXT NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    remetente_id TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    tipo_midia TEXT NOT NULL CHECK (tipo_midia IN ('texto', 'imagem', 'audio')),
    lida_em TIMESTAMP WITH TIME ZONE
);

-- 11. Tabela de Notificacoes
CREATE TABLE IF NOT EXISTS notificacoes (
    id TEXT PRIMARY KEY,
    usuario_id TEXT NOT NULL REFERENCES usuarios(user_id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('info', 'sucesso', 'alerta')),
    action_url TEXT,
    data_leitura TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Tabela de Recibos
CREATE TABLE IF NOT EXISTS recibos (
    id TEXT PRIMARY KEY,
    transacao_id TEXT NOT NULL REFERENCES transacoes(id) ON DELETE CASCADE,
    servico_id TEXT NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    codigo_verificacao TEXT NOT NULL,
    dados_fiscais_cliente TEXT NOT NULL,
    hash_integridade TEXT NOT NULL
);

-- 13. Tabela de Enderecos
CREATE TABLE IF NOT EXISTS enderecos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES usuarios(user_id) ON DELETE CASCADE,
    rotulo TEXT NOT NULL,
    logradouro TEXT NOT NULL,
    numero TEXT NOT NULL,
    complemento TEXT,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    cep TEXT NOT NULL,
    is_principal BOOLEAN DEFAULT FALSE
);

-- 14. Tabela de Documentos
CREATE TABLE IF NOT EXISTS documentos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES usuarios(user_id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('RG', 'CNH', 'Antecedentes')),
    numero_documento TEXT NOT NULL,
    arquivo_url TEXT NOT NULL,
    selfie_url TEXT NOT NULL,
    data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pendente', 'aprovado', 'rejeitado'))
);

-- 15. Tabela de AuditLogs
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    acao TEXT NOT NULL,
    recurso TEXT NOT NULL,
    recurso_id TEXT NOT NULL,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_origem TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gatilhos para Updated_at
CREATE OR REPLACE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_usuarios_modtime BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_prestadores_modtime BEFORE UPDATE ON prestadores FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_servicos_modtime BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_categorias_modtime BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_avaliacoes_modtime BEFORE UPDATE ON avaliacoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_carteiras_modtime BEFORE UPDATE ON carteiras FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_transacoes_modtime BEFORE UPDATE ON transacoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_agendamentos_modtime BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
