-- Limpar dados existentes (opcional, cuidado em produção)
-- TRUNCATE users, usuarios, prestadores, categorias, servicos, avaliacoes, carteiras, transacoes, agendamentos, enderecos RESTART IDENTITY CASCADE;

-- 1. Popular Categorias
INSERT INTO categorias (id, nome, slug, icon_url) VALUES
(gen_random_uuid()::text, 'Limpeza', 'limpeza', 'https://cdn.icon/limpeza.png'),
(gen_random_uuid()::text, 'Manutenção Elétrica', 'eletrica', 'https://cdn.icon/eletrica.png'),
(gen_random_uuid()::text, 'Encanador', 'encanador', 'https://cdn.icon/encanador.png'),
(gen_random_uuid()::text, 'Aulas Particulares', 'aulas', 'https://cdn.icon/aulas.png'),
(gen_random_uuid()::text, 'Beleza e Estética', 'beleza', 'https://cdn.icon/beleza.png'),
(gen_random_uuid()::text, 'TI e Suporte', 'ti-suporte', 'https://cdn.icon/ti.png');

-- 2. Popular Users
INSERT INTO users (id, email, senha, cpf) VALUES
('u1', 'joao@email.com', 'hash_senha_1', '111.111.111-11'),
('u2', 'maria@email.com', 'hash_senha_2', '222.222.222-22'),
('u3', 'pedro.servicos@email.com', 'hash_senha_3', '333.333.333-33'),
('u4', 'ana.limpeza@email.com', 'hash_senha_4', '444.444.444-44'),
('u5', 'carlos.eletrica@email.com', 'hash_senha_5', '555.555.555-55'),
('u6', 'fernanda@email.com', 'hash_senha_6', '666.666.666-66'),
('u7', 'roberto@email.com', 'hash_senha_7', '777.777.777-77'),
('u8', 'lucas.tech@email.com', 'hash_senha_8', '888.888.888-88'),
('u9', 'juliana@email.com', 'hash_senha_9', '999.999.999-99'),
('u10', 'admin@sistema.com', 'hash_senha_10', '000.000.000-00');

-- 3. Popular Usuarios (Perfis de Clientes)
INSERT INTO usuarios (user_id, nome, score, foto_url) VALUES
('u1', 'João Silva', 95, 'https://ui-avatars.com/api/?name=Joao+Silva'),
('u2', 'Maria Oliveira', 100, 'https://ui-avatars.com/api/?name=Maria+Oliveira'),
('u6', 'Fernanda Souza', 88, 'https://ui-avatars.com/api/?name=Fernanda+Souza'),
('u7', 'Roberto Carlos', 92, 'https://ui-avatars.com/api/?name=Roberto+Carlos'),
('u9', 'Juliana Lima', 98, 'https://ui-avatars.com/api/?name=Juliana+Lima');

-- 4. Popular Prestadores
INSERT INTO prestadores (user_id, nome, bio, score, foto_url, status_verificacao) VALUES
('u3', 'Pedro Reparos', 'Especialista em encanamentos e vazamentos com 10 anos de experiência.', 48, 'https://ui-avatars.com/api/?name=Pedro+Reparos', 'aprovado'),
('u4', 'Ana Limpezas', 'Limpeza residencial e comercial pós-obra. Detalhista e ágil.', 50, 'https://ui-avatars.com/api/?name=Ana+Limpezas', 'aprovado'),
('u5', 'Carlos Elétrica', 'Eletricista certificado. Instalações residenciais e manutenção de ar-condicionado.', 45, 'https://ui-avatars.com/api/?name=Carlos+Eletrica', 'aprovado'),
('u8', 'Lucas Tech', 'Suporte técnico, formatação de computadores e configuração de redes.', 49, 'https://ui-avatars.com/api/?name=Lucas+Tech', 'pendente');

-- 5. Popular Endereços
INSERT INTO enderecos (id, user_id, rotulo, logradouro, numero, bairro, cidade, estado, cep, is_principal) VALUES
(gen_random_uuid()::text, 'u1', 'Casa', 'Rua das Flores', '123', 'Jardim Amália', 'Campinas', 'SP', '13000-000', TRUE),
(gen_random_uuid()::text, 'u2', 'Trabalho', 'Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310-100', TRUE),
(gen_random_uuid()::text, 'u6', 'Casa', 'Rua Bahia', '45', 'Centro', 'Sumaré', 'SP', '13170-000', TRUE);

-- 6. Popular Serviços de Beleza (exemplos do catálogo services/page.tsx)
INSERT INTO servicos (id, user_id, prestador_id, titulo, descricao, imagem, preco_acordado, data_inicio, duracao, categoria, ativo, nota, total_avaliacoes) VALUES
('s4', 'u1', 'u4', 'Corte de Cabelo Masculino Completo', 'Corte moderno com acabamento profissional, lavagem e finalização.',   '✂️',  45.00,  NOW() + INTERVAL '3 days', '60min',  'Cabelo', TRUE,  4.8, 24),
('s5', 'u2', 'u4', 'Manicure e Pedicure Spa',            'Tratamento completo para unhas com esmaltação e massagem relaxante.', '💅',  80.00,  NOW() + INTERVAL '5 days', '90min',  'Unhas',  TRUE,  4.9, 18),
('s6', 'u6', 'u4', 'Barba Completa com Design',          'Aparação, modelagem e finalização da barba com produtos premium.',    '🪒',  35.00,  NOW() + INTERVAL '1 day',  '45min',  'Barba',  FALSE, 4.7, 31),
('s7', 'u7', 'u4', 'Coloração Capilar Profissional',     'Coloração completa ou mechas com produtos de alta qualidade.',       '🎨', 120.00, NOW() + INTERVAL '7 days', '180min', 'Cabelo', TRUE,  4.6, 12);

-- 7. Popular Carteiras
INSERT INTO carteiras (id, usuario_id, prestador_id, saldo, status) VALUES
(gen_random_uuid()::text, 'u1', NULL, '500.00', 'ativa'),
(gen_random_uuid()::text, 'u2', NULL, '1250.50', 'ativa'),
(gen_random_uuid()::text, NULL, 'u3', '1500.00', 'ativa'),
(gen_random_uuid()::text, NULL, 'u4', '3200.00', 'ativa'),
(gen_random_uuid()::text, NULL, 'u5', '450.00', 'ativa');

-- 8. Popular Transações
INSERT INTO transacoes (id, servico_id, tipo, status, valor, metodo_pagamento) VALUES
(gen_random_uuid()::text, 's4', 'pagamento', 'concluido', '45.00',  'pix'),
(gen_random_uuid()::text, 's5', 'pagamento', 'concluido', '80.00',  'cartao_credito'),
(gen_random_uuid()::text, 's7', 'pagamento', 'pendente',  '120.00', 'saldo_carteira');

-- 9. Popular Agendamentos
INSERT INTO agendamentos (id, user_id, prestador_id, dia_semana, hora_inicio, hora_fim) VALUES
(gen_random_uuid()::text, 'u1', 'u3', 'Segunda-feira', '09:00', '11:00'),
(gen_random_uuid()::text, 'u2', 'u4', 'Quarta-feira', '14:00', '18:00'),
(gen_random_uuid()::text, 'u6', 'u5', 'Sábado', '08:00', '12:00');

-- 10. Popular Notificações
INSERT INTO notificacoes (id, usuario_id, titulo, mensagem, tipo) VALUES
(gen_random_uuid()::text, 'u1', 'Serviço Concluído', 'Corte de cabelo finalizado com sucesso.', 'sucesso'),
(gen_random_uuid()::text, 'u2', 'Novo Agendamento', 'Manicure confirmada para esta semana.', 'info');

-- 11. Popular Mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia) VALUES
(gen_random_uuid()::text, 's4', 'u1', 'Olá, qual horário está disponível?', 'texto'),
(gen_random_uuid()::text, 's4', 'u4', 'Temos horário amanhã às 10h!', 'texto');
