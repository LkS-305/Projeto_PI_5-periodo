-- Correção pontual: populate antigo tinha bcrypt que não correspondia a "senha123".
-- Executa uma vez (psql, PgAdmin ou npm run db:setup não aplica este ficheiro automaticamente).
UPDATE users
SET senha = '$2b$10$iemptuB.Mwgk30cRKQgaAeS0A.U93Us/0Ez59SBXC21XGRq4ZM24O'
WHERE id IN ('u1', 'u3');
