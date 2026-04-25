CREATE OR REPLACE FUNCTION func_gerar_log_auditoria()
RETURNS TRIGGER AS $$
DECLARE
    v_recurso_id TEXT;
BEGIN

    RAISE NOTICE 'Auditoria: % realizado na tabela %', TG_OP, TG_TABLE_NAME; 
    
    -- Extrai o ID de forma segura: tenta 'id', se não tiver, tenta 'user_id'
    -- Isso evita o erro de "record has no field"
    v_recurso_id := COALESCE(
        (to_jsonb(NEW) ->> 'id'), 
        (to_jsonb(OLD) ->> 'id'),
        (to_jsonb(NEW) ->> 'user_id'),
        (to_jsonb(OLD) ->> 'user_id')
    );

    INSERT INTO audit_logs (
        id,
        user_id,
        acao,
        recurso,
        recurso_id,
        dados_anteriores,
        dados_novos
    )
    VALUES (
        gen_random_uuid(),
        NULLIF(current_setting('app.current_user_id', true), ''),
        TG_OP,
        TG_TABLE_NAME,
        v_recurso_id,
        to_jsonb(OLD),
        to_jsonb(NEW)
    );
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
