-- ============================================================
--  populate.sql  –  dados de teste
--  Conta de testes: teste@gmail.com / teste123
--  Demais prestadores:  senha123
-- ============================================================

-- 1. Categorias
INSERT INTO categorias (id, nome, slug, icon_url) VALUES
('cat1', 'Limpeza',             'limpeza',    'https://placehold.co/100x100?text=Limpeza'),
('cat2', 'Manutenção Elétrica', 'eletrica',   'https://placehold.co/100x100?text=Eletrica'),
('cat3', 'Encanador',           'encanador',  'https://placehold.co/100x100?text=Encanador'),
('cat4', 'Aulas Particulares',  'aulas',      'https://placehold.co/100x100?text=Aulas'),
('cat5', 'Beleza e Estética',   'beleza',     'https://placehold.co/100x100?text=Beleza'),
('cat6', 'TI e Suporte',        'ti-suporte', 'https://placehold.co/100x100?text=TI');

-- ============================================================
-- 2. Users  (10 no total)
--    ut  = conta de testes  (senha: teste123)
--    u1-u9 = prestadores    (senha: senha123)
-- ============================================================
INSERT INTO users (id, email, senha, cpf) VALUES
('ut', 'teste@gmail.com',          '$2b$10$lqMaxDJrTvOLmMRwXsdAZe7t6VccA6gNl1BXuldEzOgRpgiGL4ZRe', '00000000000'),
('u1', 'pedro@email.com',          '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '11111111111'),
('u2', 'ana@email.com',            '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '22222222222'),
('u3', 'carlos@email.com',         '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '33333333333'),
('u4', 'lucas@email.com',          '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '44444444444'),
('u5', 'fernanda@email.com',       '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '55555555555'),
('u6', 'roberto@email.com',        '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '66666666666'),
('u7', 'mariana@email.com',        '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '77777777777'),
('u8', 'eduardo@email.com',        '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '88888888888'),
('u9', 'juliana@email.com',        '$2b$10$Qx.QRU5RA8saFS1xWkoDeOl6s/xJKj4ybwm2qKJTncOvoCaawfBU6', '99999999999');

-- ============================================================
-- 3. Usuarios (todos os 10 têm perfil de usuário)
-- ============================================================
INSERT INTO usuarios (user_id, nome, telefone, score, foto_url) VALUES
('ut', 'Teste',           '(11) 90000-0000', 0,   'https://ui-avatars.com/api/?name=Teste'),
('u1', 'Pedro Encanador', '(11) 91111-1111', 92,  'https://ui-avatars.com/api/?name=Pedro+Encanador'),
('u2', 'Ana Limpezas',    '(11) 92222-2222', 98,  'https://ui-avatars.com/api/?name=Ana+Limpezas'),
('u3', 'Carlos Elétrica', '(19) 93333-3333', 87,  'https://ui-avatars.com/api/?name=Carlos+Eletrica'),
('u4', 'Lucas Tech',      '(16) 94444-4444', 94,  'https://ui-avatars.com/api/?name=Lucas+Tech'),
('u5', 'Fernanda Estética','(31) 95555-5555', 100, 'https://ui-avatars.com/api/?name=Fernanda+Estetica'),
('u6', 'Roberto Professor','(21) 96666-6666', 96,  'https://ui-avatars.com/api/?name=Roberto+Professor'),
('u7', 'Mariana Limpeza', '(41) 97777-7777', 88,  'https://ui-avatars.com/api/?name=Mariana+Limpeza'),
('u8', 'Eduardo Elétrica','(11) 98888-8888', 83,  'https://ui-avatars.com/api/?name=Eduardo+Eletrica'),
('u9', 'Juliana Beleza',  '(71) 99999-9999', 91,  'https://ui-avatars.com/api/?name=Juliana+Beleza');

-- ============================================================
-- 4. Prestadores  (u1–u9, cada um com categoria distinta ou complementar)
-- ============================================================
INSERT INTO prestadores (user_id, nome, bio, score, foto_url, status_verificacao) VALUES
('u1', 'Pedro Encanador',  'Especialista em encanamentos, vazamentos e instalações hidráulicas. 10 anos de experiência.',       92, 'https://ui-avatars.com/api/?name=Pedro+Encanador',  'aprovado'),
('u2', 'Ana Limpezas',     'Limpeza residencial e comercial, pós-obra e manutenção. Detalhista e pontual.',                    98, 'https://ui-avatars.com/api/?name=Ana+Limpezas',     'aprovado'),
('u3', 'Carlos Elétrica',  'Eletricista certificado. Instalações, quadros de distribuição e manutenção de ar-condicionado.',   87, 'https://ui-avatars.com/api/?name=Carlos+Eletrica',  'aprovado'),
('u4', 'Lucas Tech',       'Suporte técnico, formatação, configuração de redes e TI para empresas.',                           94, 'https://ui-avatars.com/api/?name=Lucas+Tech',       'aprovado'),
('u5', 'Fernanda Estética','Cabeleireira e esteticista com 8 anos de experiência. Atendimento a domicílio.',                  100, 'https://ui-avatars.com/api/?name=Fernanda+Estetica','aprovado'),
('u6', 'Roberto Professor','Professor particular de Matemática, Física e Química para Ensino Médio e vestibular.',             96, 'https://ui-avatars.com/api/?name=Roberto+Professor','aprovado'),
('u7', 'Mariana Limpeza',  'Limpeza profunda, organização de ambientes e produtos ecológicos. Excelente avaliação.',           88, 'https://ui-avatars.com/api/?name=Mariana+Limpeza',  'aprovado'),
('u8', 'Eduardo Elétrica', 'Eletricista residencial e industrial. Laudos técnicos e instalações fotovoltaicas.',               83, 'https://ui-avatars.com/api/?name=Eduardo+Eletrica', 'pendente'),
('u9', 'Juliana Beleza',   'Especialista em manicure, pedicure e design de sobrancelhas. Agenda flexível.',                   91, 'https://ui-avatars.com/api/?name=Juliana+Beleza',   'aprovado');

-- ============================================================
-- 5. Endereços
-- ============================================================
INSERT INTO enderecos (id, user_id, rotulo, logradouro, numero, bairro, cidade, estado, cep, is_principal) VALUES
(gen_random_uuid()::text, 'ut', 'Casa',       'Rua do Teste',        '1',   'Centro',        'São Paulo',      'SP', '01310100', TRUE),
(gen_random_uuid()::text, 'u1', 'Escritório', 'Rua Augusta',         '900', 'Consolação',    'São Paulo',      'SP', '01305100', TRUE),
(gen_random_uuid()::text, 'u2', 'Escritório', 'Av. Rebouças',        '600', 'Pinheiros',     'São Paulo',      'SP', '05401300', TRUE),
(gen_random_uuid()::text, 'u3', 'Escritório', 'Rua Marechal Deodoro','300', 'Centro',        'Campinas',       'SP', '13013001', TRUE),
(gen_random_uuid()::text, 'u4', 'Escritório', 'Rua José Bonifácio',  '77',  'Centro',        'São Carlos',     'SP', '13560047', TRUE),
(gen_random_uuid()::text, 'u5', 'Ateliê',     'Rua Bahia',           '45',  'Funcionários',  'Belo Horizonte', 'MG', '30130110', TRUE),
(gen_random_uuid()::text, 'u6', 'Escritório', 'Av. Atlântica',       '200', 'Copacabana',    'Rio de Janeiro', 'RJ', '22010010', TRUE),
(gen_random_uuid()::text, 'u7', 'Escritório', 'Rua XV de Novembro',  '50',  'Centro',        'Curitiba',       'PR', '80020310', TRUE),
(gen_random_uuid()::text, 'u8', 'Escritório', 'Rua Sete de Setembro','120', 'Centro',        'Santo André',    'SP', '09010100', TRUE),
(gen_random_uuid()::text, 'u9', 'Ateliê',     'Rua da Palma',        '10',  'Centro',        'Salvador',       'BA', '40020010', TRUE);

-- ============================================================
-- 6. Prestador_Categorias
-- ============================================================
INSERT INTO prestador_categorias (prestador_id, categoria_id) VALUES
('u1', 'cat3'),  -- Pedro       → Encanador
('u2', 'cat1'),  -- Ana         → Limpeza
('u3', 'cat2'),  -- Carlos      → Manutenção Elétrica
('u4', 'cat6'),  -- Lucas       → TI e Suporte
('u5', 'cat5'),  -- Fernanda    → Beleza e Estética
('u6', 'cat4'),  -- Roberto     → Aulas Particulares
('u7', 'cat1'),  -- Mariana     → Limpeza
('u8', 'cat2'),  -- Eduardo     → Manutenção Elétrica
('u9', 'cat5');  -- Juliana     → Beleza e Estética

-- ============================================================
-- 7. Portfólio
-- ============================================================
INSERT INTO portfolio_items (id, prestador_id, url, tipo, descricao, ordem) VALUES
(gen_random_uuid()::text, 'u1', 'https://picsum.photos/seed/pedro1/600/400', 'imagem', 'Troca de tubulação hidráulica', 0),
(gen_random_uuid()::text, 'u1', 'https://picsum.photos/seed/pedro2/600/400', 'imagem', 'Reparo de vazamento sob pia',   1),
(gen_random_uuid()::text, 'u2', 'https://picsum.photos/seed/ana1/600/400',   'imagem', 'Limpeza pós-obra completa',     0),
(gen_random_uuid()::text, 'u2', 'https://picsum.photos/seed/ana2/600/400',   'imagem', 'Cozinha higienizada',            1),
(gen_random_uuid()::text, 'u3', 'https://picsum.photos/seed/carlos1/600/400','imagem', 'Quadro elétrico novo',           0),
(gen_random_uuid()::text, 'u3', 'https://picsum.photos/seed/carlos2/600/400','imagem', 'Instalação de tomadas',          1),
(gen_random_uuid()::text, 'u4', 'https://picsum.photos/seed/lucas1/600/400', 'imagem', 'Setup configurado',              0),
(gen_random_uuid()::text, 'u4', 'https://picsum.photos/seed/lucas2/600/400', 'imagem', 'Rede cabeada instalada',         1),
(gen_random_uuid()::text, 'u5', 'https://picsum.photos/seed/fern1/600/400',  'imagem', 'Coloração profissional',         0),
(gen_random_uuid()::text, 'u5', 'https://picsum.photos/seed/fern2/600/400',  'imagem', 'Escova modeladora',              1),
(gen_random_uuid()::text, 'u6', 'https://picsum.photos/seed/rob1/600/400',   'imagem', 'Aula de Matemática',             0),
(gen_random_uuid()::text, 'u7', 'https://picsum.photos/seed/mar1/600/400',   'imagem', 'Limpeza de sofá a vapor',        0),
(gen_random_uuid()::text, 'u8', 'https://picsum.photos/seed/edu1/600/400',   'imagem', 'Instalação de painel solar',     0),
(gen_random_uuid()::text, 'u9', 'https://picsum.photos/seed/jul1/600/400',   'imagem', 'Design de sobrancelha',          0);

-- ============================================================
-- 8. Serviços
--    5 finalizados (s1–s5)  |  4 abertos com estados variados (s6–s9)
-- ============================================================
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao, preco_acordado, data_inicio, duracao, status, nota_usuario, nota_prestador, nota) VALUES
-- CONCLUÍDOS
('s1', 'ut', 'u1', 'cat3', 'Conserto de Vazamento na Cozinha',
 'Reparo em cano com vazamento atrás da pia da cozinha.',
 150.00, NOW() - INTERVAL '30 days', '2h', 'finalizado', 4.5, 5.0, 4.8),

('s2', 'ut', 'u2', 'cat1', 'Limpeza Residencial Completa',
 'Limpeza de 4 cômodos com produtos premium inclusos.',
 220.00, NOW() - INTERVAL '25 days', '5h', 'finalizado', 5.0, 5.0, 5.0),

('s3', 'ut', 'u3', 'cat2', 'Instalação de Tomadas e Interruptores',
 'Instalação de 6 tomadas com aterramento adequado.',
 180.00, NOW() - INTERVAL '20 days', '3h', 'finalizado', 4.0, 4.5, 4.3),

('s4', 'ut', 'u4', 'cat6', 'Formatação e Configuração de Notebook',
 'Formatação completa com instalação de programas e configuração de backup.',
  90.00, NOW() - INTERVAL '15 days', '2h', 'finalizado', 4.8, 5.0, 4.9),

('s5', 'ut', 'u5', 'cat5', 'Corte, Escova e Hidratação',
 'Corte feminino com escova modeladora e hidratação capilar profunda.',
 160.00, NOW() - INTERVAL '10 days', '2h30', 'finalizado', 5.0, 5.0, 5.0),

-- ABERTOS (estados diferentes)
('s6', 'ut', 'u6', 'cat4', 'Aulas de Matemática para Vestibular',
 'Pacote de 10 aulas de Matemática para preparação ao vestibular.',
 500.00, NOW() + INTERVAL '3 days', '10h', 'criado', NULL, NULL, NULL),

('s7', 'ut', 'u7', 'cat1', 'Limpeza Pós-Reforma',
 'Limpeza pesada após reforma no banheiro e quarto.',
 380.00, NOW() - INTERVAL '2 days', '6h', 'emAndamento', NULL, NULL, NULL),

('s8', 'ut', 'u8', 'cat2', 'Revisão Elétrica Geral do Apartamento',
 'Inspeção e revisão do sistema elétrico completo do apartamento.',
 250.00, NOW() + INTERVAL '5 days', '4h', 'pendente', NULL, NULL, NULL),

('s9', 'ut', 'u9', 'cat5', 'Manicure, Pedicure e Design de Sobrancelha',
 'Pacote completo de manicure, pedicure e design de sobrancelha.',
  80.00, NOW() + INTERVAL '1 day', '2h', 'aceito', NULL, NULL, NULL);

-- ============================================================
-- 9. Mensagens  (5–7 por serviço, alternando remetente)
-- ============================================================

-- s1 – Vazamento na Cozinha (finalizado) – 6 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's1', 'ut', 'Olá Pedro, tem disponibilidade para consertar um vazamento na minha cozinha?', 'texto', NOW() - INTERVAL '32 days'),
(gen_random_uuid()::text, 's1', 'u1', 'Oi! Tenho sim. Pode me mandar uma foto para eu avaliar?', 'texto', NOW() - INTERVAL '32 days' + INTERVAL '10 minutes'),
(gen_random_uuid()::text, 's1', 'ut', 'Acabei de enviar. É um cano atrás da pia, gotejando bastante.', 'texto', NOW() - INTERVAL '32 days' + INTERVAL '25 minutes'),
(gen_random_uuid()::text, 's1', 'u1', 'Entendi. Consigo ir na segunda às 9h. O serviço deve levar umas 2 horas.', 'texto', NOW() - INTERVAL '31 days'),
(gen_random_uuid()::text, 's1', 'ut', 'Perfeito, segunda às 9h está ótimo!', 'texto', NOW() - INTERVAL '31 days' + INTERVAL '5 minutes'),
(gen_random_uuid()::text, 's1', 'u1', 'Serviço concluído! Qualquer problema é só me chamar.', 'texto', NOW() - INTERVAL '30 days');

-- s2 – Limpeza Residencial (finalizado) – 7 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's2', 'ut', 'Ana, preciso de uma limpeza completa, 4 cômodos. Você teria agenda essa semana?', 'texto', NOW() - INTERVAL '27 days'),
(gen_random_uuid()::text, 's2', 'u2', 'Olá! Tenho disponível na quarta-feira. Quantos m² aproximadamente?', 'texto', NOW() - INTERVAL '27 days' + INTERVAL '15 minutes'),
(gen_random_uuid()::text, 's2', 'ut', 'Em torno de 80m². Cozinha, dois quartos, sala e banheiro.', 'texto', NOW() - INTERVAL '27 days' + INTERVAL '30 minutes'),
(gen_random_uuid()::text, 's2', 'u2', 'Ótimo! Meu valor para esse tamanho é R$220 com materiais inclusos. Aceita?', 'texto', NOW() - INTERVAL '27 days' + INTERVAL '45 minutes'),
(gen_random_uuid()::text, 's2', 'ut', 'Aceito! Quarta às 14h está bom?', 'texto', NOW() - INTERVAL '27 days' + INTERVAL '1 hour'),
(gen_random_uuid()::text, 's2', 'u2', 'Combinado! Estarei aí pontualmente.', 'texto', NOW() - INTERVAL '27 days' + INTERVAL '1 hour 10 minutes'),
(gen_random_uuid()::text, 's2', 'ut', 'Ficou impecável Ana, parabéns pelo trabalho! Nota 5 com certeza.', 'texto', NOW() - INTERVAL '25 days');

-- s3 – Instalação de Tomadas (finalizado) – 5 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's3', 'ut', 'Carlos, preciso instalar 6 tomadas com aterramento no meu apartamento.', 'texto', NOW() - INTERVAL '22 days'),
(gen_random_uuid()::text, 's3', 'u3', 'Olá! Sem problema. Você já tem os pontos de elétrica ou precisa abrir paredes?', 'texto', NOW() - INTERVAL '22 days' + INTERVAL '20 minutes'),
(gen_random_uuid()::text, 's3', 'ut', 'Os pontos já existem, é só trocar as tomadas antigas por novas com aterramento.', 'texto', NOW() - INTERVAL '22 days' + INTERVAL '40 minutes'),
(gen_random_uuid()::text, 's3', 'u3', 'Melhor ainda! Consigo ir no sábado de manhã. Fico pronto em umas 3h. R$180 tudo incluído.', 'texto', NOW() - INTERVAL '21 days'),
(gen_random_uuid()::text, 's3', 'ut', 'Ótimo Carlos, ficou tudo perfeito. Obrigado!', 'texto', NOW() - INTERVAL '20 days');

-- s4 – Formatação de Notebook (finalizado) – 6 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's4', 'ut', 'Lucas, meu notebook está muito lento. Você faz formatação com instalação de programas?', 'texto', NOW() - INTERVAL '17 days'),
(gen_random_uuid()::text, 's4', 'u4', 'Faço sim! Qual o sistema operacional e quais programas você precisa?', 'texto', NOW() - INTERVAL '17 days' + INTERVAL '10 minutes'),
(gen_random_uuid()::text, 's4', 'ut', 'Windows 11. Preciso de Office, Chrome, Zoom e antivírus.', 'texto', NOW() - INTERVAL '17 days' + INTERVAL '25 minutes'),
(gen_random_uuid()::text, 's4', 'u4', 'Tranquilo! Posso ir na sexta às 10h. Levo cerca de 2h, R$90 com backup incluso.', 'texto', NOW() - INTERVAL '16 days'),
(gen_random_uuid()::text, 's4', 'ut', 'Pode ser! Vejo você na sexta.', 'texto', NOW() - INTERVAL '16 days' + INTERVAL '5 minutes'),
(gen_random_uuid()::text, 's4', 'u4', 'Tudo instalado e configurado. Fiz backup na nuvem também, fique tranquilo!', 'texto', NOW() - INTERVAL '15 days');

-- s5 – Corte e Hidratação (finalizado) – 5 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's5', 'ut', 'Fernanda, você atende em domicílio? Gostaria de fazer corte e hidratação.', 'texto', NOW() - INTERVAL '12 days'),
(gen_random_uuid()::text, 's5', 'u5', 'Sim, atendo! Que dia seria melhor para você?', 'texto', NOW() - INTERVAL '12 days' + INTERVAL '15 minutes'),
(gen_random_uuid()::text, 's5', 'ut', 'Sábado de manhã, por volta das 10h?', 'texto', NOW() - INTERVAL '12 days' + INTERVAL '30 minutes'),
(gen_random_uuid()::text, 's5', 'u5', 'Sábado às 10h está perfeito. Corte + escova + hidratação por R$160, tudo incluso.', 'texto', NOW() - INTERVAL '11 days'),
(gen_random_uuid()::text, 's5', 'ut', 'Amei o resultado Fernanda! Com certeza vou te chamar de novo!', 'texto', NOW() - INTERVAL '10 days');

-- s6 – Aulas de Matemática (criado) – 5 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's6', 'ut', 'Roberto, estou precisando reforçar Matemática para o vestibular. Você tem disponibilidade?', 'texto', NOW() - INTERVAL '3 days'),
(gen_random_uuid()::text, 's6', 'u6', 'Olá! Tenho sim. Qual o nível atual? Básico, intermediário ou avançado?', 'texto', NOW() - INTERVAL '3 days' + INTERVAL '30 minutes'),
(gen_random_uuid()::text, 's6', 'ut', 'Intermediário. Tenho dificuldade em trigonometria e funções.', 'texto', NOW() - INTERVAL '3 days' + INTERVAL '1 hour'),
(gen_random_uuid()::text, 's6', 'u6', 'Entendido! Posso montar um plano de 10 aulas focado nesses tópicos por R$500. Aceita?', 'texto', NOW() - INTERVAL '2 days'),
(gen_random_uuid()::text, 's6', 'ut', 'Aceito! Podemos começar essa semana?', 'texto', NOW() - INTERVAL '2 days' + INTERVAL '2 hours');

-- s7 – Limpeza Pós-Reforma (emAndamento) – 7 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's7', 'ut', 'Mariana, acabei uma reforma no banheiro e quarto. Preciso de limpeza pesada.', 'texto', NOW() - INTERVAL '5 days'),
(gen_random_uuid()::text, 's7', 'u7', 'Oi! Entendo, limpeza pós-obra é especialidade nossa. Qual o tamanho dos ambientes?', 'texto', NOW() - INTERVAL '5 days' + INTERVAL '20 minutes'),
(gen_random_uuid()::text, 's7', 'ut', 'Banheiro de 8m² e quarto de 15m². Muito pó de reboco e tinta.', 'texto', NOW() - INTERVAL '5 days' + INTERVAL '40 minutes'),
(gen_random_uuid()::text, 's7', 'u7', 'Perfeito, uso produtos específicos para isso. Consigo ir amanhã cedo, R$380 por 6h de serviço.', 'texto', NOW() - INTERVAL '4 days'),
(gen_random_uuid()::text, 's7', 'ut', 'Combinado! Amanhã às 8h?', 'texto', NOW() - INTERVAL '4 days' + INTERVAL '1 hour'),
(gen_random_uuid()::text, 's7', 'u7', 'Confirmado às 8h! Estarei lá.', 'texto', NOW() - INTERVAL '3 days'),
(gen_random_uuid()::text, 's7', 'u7', 'Estou aqui, iniciando o serviço!', 'texto', NOW() - INTERVAL '2 days');

-- s8 – Revisão Elétrica (pendente) – 5 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's8', 'ut', 'Eduardo, quero fazer uma revisão completa do sistema elétrico do meu apê. Você faz laudo?', 'texto', NOW() - INTERVAL '2 days'),
(gen_random_uuid()::text, 's8', 'u8', 'Faço sim! Laudo técnico com ART incluso. Quantos cômodos?', 'texto', NOW() - INTERVAL '2 days' + INTERVAL '1 hour'),
(gen_random_uuid()::text, 's8', 'ut', 'São 3 quartos, sala, cozinha e 2 banheiros. Apartamento de 90m².', 'texto', NOW() - INTERVAL '2 days' + INTERVAL '2 hours'),
(gen_random_uuid()::text, 's8', 'u8', 'Para esse tamanho fica R$250 com laudo. Tenho horário na quinta-feira às 14h.', 'texto', NOW() - INTERVAL '1 day'),
(gen_random_uuid()::text, 's8', 'ut', 'Quinta às 14h está ótimo. Aguardo sua confirmação.', 'texto', NOW() - INTERVAL '1 day' + INTERVAL '30 minutes');

-- s9 – Manicure e Pedicure (aceito) – 6 mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at) VALUES
(gen_random_uuid()::text, 's9', 'ut', 'Juliana, você faz manicure, pedicure e sobrancelha em domicílio?', 'texto', NOW() - INTERVAL '1 day'),
(gen_random_uuid()::text, 's9', 'u9', 'Oi! Faço sim, tenho um pacote completo. Qual região você mora?', 'texto', NOW() - INTERVAL '1 day' + INTERVAL '15 minutes'),
(gen_random_uuid()::text, 's9', 'ut', 'Centro de São Paulo. Você atende aqui?', 'texto', NOW() - INTERVAL '1 day' + INTERVAL '30 minutes'),
(gen_random_uuid()::text, 's9', 'u9', 'Atendo sim! Pacote completo (manicure + pedicure + sobrancelha) por R$80. Aceita?', 'texto', NOW() - INTERVAL '1 day' + INTERVAL '1 hour'),
(gen_random_uuid()::text, 's9', 'ut', 'Aceito! Pode ser amanhã de tarde?', 'texto', NOW() - INTERVAL '23 hours'),
(gen_random_uuid()::text, 's9', 'u9', 'Perfeito! Amanhã às 15h estou lá. Serviço aceito e confirmado!', 'texto', NOW() - INTERVAL '22 hours');

-- ============================================================
-- 10. Avaliações (apenas para os 5 serviços finalizados)
-- ============================================================
INSERT INTO avaliacoes (id, servico_id, user_id, prestador_id, listBy, avaliarBy, nota, comentario, media, destinatario) VALUES
(gen_random_uuid()::text, 's1', 'ut', 'u1', 'usuario', 'usuario', '4.5', 'Ótimo serviço, muito pontual e eficiente!',         '4.5', 'prestador'),
(gen_random_uuid()::text, 's1', 'ut', 'u1', 'prestador', 'prestador', '5.0', 'Cliente excelente, facilitou muito o acesso.',  '5.0', 'usuario'),
(gen_random_uuid()::text, 's2', 'ut', 'u2', 'usuario', 'usuario', '5.0', 'Perfeito em todos os detalhes, casa brilhando!',    '5.0', 'prestador'),
(gen_random_uuid()::text, 's2', 'ut', 'u2', 'prestador', 'prestador', '5.0', 'Ambiente bem cuidado, cliente super atencioso.','5.0', 'usuario'),
(gen_random_uuid()::text, 's3', 'ut', 'u3', 'usuario', 'usuario', '4.0', 'Bom serviço, tomadas funcionando perfeitamente.',   '4.0', 'prestador'),
(gen_random_uuid()::text, 's3', 'ut', 'u3', 'prestador', 'prestador', '4.5', 'Cliente objetivo e comunicativo.',              '4.5', 'usuario'),
(gen_random_uuid()::text, 's4', 'ut', 'u4', 'usuario', 'usuario', '4.8', 'Laptop voando! Instalou tudo certinho e rápido.',   '4.8', 'prestador'),
(gen_random_uuid()::text, 's4', 'ut', 'u4', 'prestador', 'prestador', '5.0', 'Deixou tudo pronto para mim, sem complicação.', '5.0', 'usuario'),
(gen_random_uuid()::text, 's5', 'ut', 'u5', 'usuario', 'usuario', '5.0', 'Mãos de anjo! Resultado incrível.',                 '5.0', 'prestador'),
(gen_random_uuid()::text, 's5', 'ut', 'u5', 'prestador', 'prestador', '5.0', 'Amei atender essa cliente, super simpática.',   '5.0', 'usuario');

-- ============================================================
-- 11. Carteiras
-- ============================================================
INSERT INTO carteiras (user_id, prestador_id, saldo, status) VALUES
('ut', NULL,  '1200.00', 'ativa'),
('u1', NULL,  '350.00',  'ativa'),
('u2', NULL,  '500.00',  'ativa'),
('u3', NULL,  '275.00',  'ativa'),
('u4', NULL,  '410.00',  'ativa'),
('u5', NULL,  '620.00',  'ativa'),
('u6', NULL,  '480.00',  'ativa'),
('u7', NULL,  '290.00',  'ativa'),
('u8', NULL,  '155.00',  'ativa'),
('u9', NULL,  '340.00',  'ativa'),
(NULL, 'u1',  '1800.00', 'ativa'),
(NULL, 'u2',  '3400.00', 'ativa'),
(NULL, 'u3',  '920.00',  'ativa'),
(NULL, 'u4',  '1100.00', 'ativa'),
(NULL, 'u5',  '2200.00', 'ativa'),
(NULL, 'u6',  '1650.00', 'ativa'),
(NULL, 'u7',  '760.00',  'ativa'),
(NULL, 'u8',  '430.00',  'ativa'),
(NULL, 'u9',  '580.00',  'ativa');

-- ============================================================
-- 12. Agendamentos (exemplo para os serviços em aberto)
-- ============================================================
INSERT INTO agendamentos (id, user_id, prestador_id, dia_semana, hora_inicio, hora_fim) VALUES
(gen_random_uuid()::text, 'ut', 'u6', 'Segunda-feira', '18:00', '20:00'),
(gen_random_uuid()::text, 'ut', 'u7', 'Sábado',        '08:00', '14:00'),
(gen_random_uuid()::text, 'ut', 'u8', 'Quinta-feira',  '14:00', '18:00'),
(gen_random_uuid()::text, 'ut', 'u9', 'Domingo',       '15:00', '17:00');

-- ============================================================
-- 13. Notificações para a conta teste
-- ============================================================
INSERT INTO notificacoes (id, usuario_id, titulo, mensagem, tipo) VALUES
(gen_random_uuid()::text, 'ut', 'Serviço Concluído',   'Seu conserto de vazamento foi finalizado com sucesso!',  'sucesso'),
(gen_random_uuid()::text, 'ut', 'Limpeza Concluída',   'Limpeza residencial concluída. Avalie o prestador!',     'sucesso'),
(gen_random_uuid()::text, 'ut', 'Serviço em Andamento','Mariana está realizando a limpeza pós-reforma agora.',   'info'),
(gen_random_uuid()::text, 'ut', 'Novo Agendamento',    'Juliana confirmou o atendimento para amanhã às 15h.',    'info'),
(gen_random_uuid()::text, 'ut', 'Aguardando Resposta', 'Eduardo ainda não confirmou a revisão elétrica.',        'alerta');
