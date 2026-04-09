-- Habilita a extensão para UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    avaliacao_media DECIMAL(3, 2) DEFAULT 0.00,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    foto_url TEXT,
    tipo_usuario TEXT CHECK (tipo_usuario IN ('cliente', 'prestador', 'admin')) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Tabela de Endereços 
CREATE TABLE IF NOT EXISTS enderecos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rotulo VARCHAR(100),
    cep CHAR(8),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    is_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Prestadores
CREATE TABLE IF NOT EXISTS prestadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    bio VARCHAR(500),
    valor_hora DECIMAL(10, 2),
    area_atuacao VARCHAR(150),
    km_atuacao INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_serviço VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Documentos
CREATE TABLE IF NOT EXISTS documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prestador_id UUID NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(50),
    numero_documento VARCHAR(50),
    foto_documento_url TEXT,
    selfie_url TEXT,
    status_verificacao TEXT DEFAULT 'pendente', -- pendente, aprovado, reprovado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Carteira
CREATE TABLE IF NOT EXISTS carteiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    saldo DECIMAL(10, 2) DEFAULT 0.00,
    status_carteira TEXT DEFAULT 'ativa', -- ativa, bloqueada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Serviços
CREATE TABLE IF NOT EXISTS servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contratante_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    prestador_id UUID NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    endereco_id UUID NOT NULL REFERENCES enderecos(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(500),
    status TEXT DEFAULT 'em negociação', -- negociação, pendente contrato, pendente pagamento, confirmado, concluido, cancelado
    data_agendamento TIMESTAMP WITH TIME ZONE,
    data_inicio DATE,
    data_fim DATE,      -- aqui adicionei a data de fim do serviço (usei DATE ao invés de TIMESTAMP)
    valor_acordado DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de Transações
CREATE TABLE IF NOT EXISTS transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    valor DECIMAL(10, 2) NOT NULL,
    tipo_transacao VARCHAR(50) NOT NULL, -- pagamento, estorno, saque
    status_transacao VARCHAR(50) DEFAULT 'pendente', -- pendente, aprovado, reprovado
    valor DECIMAL(10, 2) NOT NULL,
    descricao VARCHAR(500),
    metodo_pagamento VARCHAR(50), -- cartão, pix, boleto
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabela de Agendamentos (Solicitações)
CREATE TABLE IF NOT EXISTS agendamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    data_agendamento DATE DEFAULT NULL, -- marcados como NULL para permitir que o cliente escolha a data posteriormente
    horario_inicio TIME DEFAULT NULL,   -- marcados como NULL para permitir que o cliente escolha o horário posteriormente
    horario_fim TIME DEFAULT NULL,      -- marcados como NULL para permitir que o cliente escolha o horário posteriormente
    status TEXT DEFAULT 'pendente', -- pendente, confirmado, concluido, cancelado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabela de Avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servico_id UUID REFERENCES servicos(id) ON DELETE CASCADE,
    avaliador_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    avaliado_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabela de Postagens
CREATE TABLE IF NOT EXISTS postagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prestador_id UUID NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    descricao VARCHAR(500),
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

-- 12. Tabela de Mensagens
CREATE TABLE IF NOT EXISTS mensagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_servico UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    remetente_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    conteudo VARCHAR(250),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

-- 13. Tabela de Recibos
CREATE TABLE IF NOT EXISTS recibos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transacao_id UUID NOT NULL REFERENCES transacoes(id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    codigo_recibo VARCHAR(100) UNIQUE NOT NULL,
    hash_integridade VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 14. Tabela de AuditLog
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    acao VARCHAR(100) NOT NULL,
    recurso VARCHAR(100) NOT NULL,
    id_recurso_afetado UUID NOT NULL,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_origem VARCHAR(45),
    user_agent VARCHAR(255),
    tabela_afetada VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gatilhos para Updated_at
CREATE TRIGGER update_usuarios_modtime BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_prestadores_modtime BEFORE UPDATE ON prestadores FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_servicos_modtime BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_carteiras_modtime BEFORE UPDATE ON carteiras FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_documentos_modtime BEFORE UPDATE ON documentos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_enderecos_modtime BEFORE UPDATE ON enderecos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categorias_modtime BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_transacoes_modtime BEFORE UPDATE ON transacoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_agendamentos_modtime BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_avaliacoes_modtime BEFORE UPDATE ON avaliacoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_postagens_modtime BEFORE UPDATE ON postagens FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_mensagens_modtime BEFORE UPDATE ON mensagens FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_recibos_modtime BEFORE UPDATE ON recibos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_audit_log_modtime BEFORE UPDATE ON audit_log FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();