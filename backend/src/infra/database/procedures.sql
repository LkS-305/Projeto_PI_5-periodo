-- Schemas de organização
CREATE SCHEMA IF NOT EXISTS sp;
CREATE SCHEMA IF NOT EXISTS fn;

-- ============================================================
-- PROCEDURES (sp.*)
-- Chamada: CALL sp.nome_procedure(parametros);
-- ============================================================

-- Cancela um serviço pelo ID
CREATE OR REPLACE PROCEDURE sp.cancelar_servico(p_servico_id TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM servicos WHERE id = p_servico_id) THEN
        RAISE EXCEPTION 'Serviço não encontrado: %', p_servico_id;
    END IF;
    UPDATE servicos SET status = 'cancelado' WHERE id = p_servico_id;
END;
$$;

-- Aprova um documento pelo ID
CREATE OR REPLACE PROCEDURE sp.aprovar_documento(p_documento_id TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM documentos WHERE id = p_documento_id) THEN
        RAISE EXCEPTION 'Documento não encontrado: %', p_documento_id;
    END IF;
    UPDATE documentos SET status = 'aprovado' WHERE id = p_documento_id;
END;
$$;

-- Bloqueia uma carteira pelo ID
CREATE OR REPLACE PROCEDURE sp.bloquear_carteira(p_carteira_id TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM carteiras WHERE id = p_carteira_id) THEN
        RAISE EXCEPTION 'Carteira não encontrada: %', p_carteira_id;
    END IF;
    UPDATE carteiras SET status = 'bloqueada' WHERE id = p_carteira_id;
END;
$$;

-- ============================================================
-- FUNCTIONS (fn.*)
-- Chamada: SELECT fn.nome_function(parametros);
-- ============================================================

-- Retorna a média das avaliações de um prestador
CREATE OR REPLACE FUNCTION fn.media_avaliacao_prestador(p_prestador_id TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_media NUMERIC;
BEGIN
    SELECT AVG(nota::NUMERIC)
    INTO v_media
    FROM avaliacoes
    WHERE prestador_id = p_prestador_id;

    RETURN COALESCE(v_media, 0);
END;
$$;

-- Retorna o total de serviços contratados por um usuário
CREATE OR REPLACE FUNCTION fn.total_servicos_usuario(p_user_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_total INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_total
    FROM servicos
    WHERE user_id = p_user_id;

    RETURN v_total;
END;
$$;

-- Retorna o saldo atual de uma carteira
CREATE OR REPLACE FUNCTION fn.saldo_carteira(p_carteira_id TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_saldo NUMERIC;
BEGIN
    SELECT saldo::NUMERIC
    INTO v_saldo
    FROM carteiras
    WHERE id = p_carteira_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Carteira não encontrada: %', p_carteira_id;
    END IF;

    RETURN v_saldo;
END;
$$;
