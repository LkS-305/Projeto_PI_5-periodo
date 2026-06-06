-- =============================================================================
-- DOMI — populate.sql
-- Conta de teste: teste@gmail.com / teste123
-- Prestadores:    <email> / prestador123
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CATEGORIAS (9 — uma por prestador)
-- -----------------------------------------------------------------------------
INSERT INTO categorias (id, nome, slug, icon_url) VALUES
('cat1', 'Limpeza',             'limpeza',     NULL),
('cat2', 'Manutenção Elétrica', 'eletrica',    NULL),
('cat3', 'Encanamento',         'encanamento', NULL),
('cat4', 'Aulas Particulares',  'aulas',       NULL),
('cat5', 'Beleza e Estética',   'beleza',      NULL),
('cat6', 'TI e Suporte',        'ti-suporte',  NULL),
('cat7', 'Pintura',             'pintura',     NULL),
('cat8', 'Jardinagem',          'jardinagem',  NULL),
('cat9', 'Carpintaria',         'carpintaria', NULL);

-- -----------------------------------------------------------------------------
-- 2. USERS — autenticação (10 usuários)
--    Senhas geradas com pgcrypto (bf = bcrypt); compatível com bcrypt.compare()
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, senha, cpf) VALUES
('u_teste', 'teste@gmail.com',          crypt('teste123',     gen_salt('bf', 10)), '00000000000'),
('p1',      'ana.souza@email.com',      crypt('prestador123', gen_salt('bf', 10)), '11111111101'),
('p2',      'carlos.lima@email.com',    crypt('prestador123', gen_salt('bf', 10)), '22222222202'),
('p3',      'pedro.alves@email.com',    crypt('prestador123', gen_salt('bf', 10)), '33333333303'),
('p4',      'mariana.costa@email.com',  crypt('prestador123', gen_salt('bf', 10)), '44444444404'),
('p5',      'fernanda.rocha@email.com', crypt('prestador123', gen_salt('bf', 10)), '55555555505'),
('p6',      'lucas.mendes@email.com',   crypt('prestador123', gen_salt('bf', 10)), '66666666606'),
('p7',      'roberto.pinto@email.com',  crypt('prestador123', gen_salt('bf', 10)), '77777777707'),
('p8',      'juliana.neves@email.com',  crypt('prestador123', gen_salt('bf', 10)), '88888888808'),
('p9',      'thiago.santos@email.com',  crypt('prestador123', gen_salt('bf', 10)), '99999999909');

-- -----------------------------------------------------------------------------
-- 3. USUARIOS — perfis (todos os 10 precisam de perfil)
-- -----------------------------------------------------------------------------
INSERT INTO usuarios (user_id, nome, score, foto_url) VALUES
('u_teste', 'Teste',          0, NULL),
('p1', 'Ana Souza',           5, 'https://ui-avatars.com/api/?name=Ana+Souza&background=E0C271&color=272727'),
('p2', 'Carlos Lima',         4, 'https://ui-avatars.com/api/?name=Carlos+Lima&background=E0C271&color=272727'),
('p3', 'Pedro Alves',         5, 'https://ui-avatars.com/api/?name=Pedro+Alves&background=E0C271&color=272727'),
('p4', 'Mariana Costa',       5, 'https://ui-avatars.com/api/?name=Mariana+Costa&background=E0C271&color=272727'),
('p5', 'Fernanda Rocha',      5, 'https://ui-avatars.com/api/?name=Fernanda+Rocha&background=E0C271&color=272727'),
('p6', 'Lucas Mendes',        4, 'https://ui-avatars.com/api/?name=Lucas+Mendes&background=E0C271&color=272727'),
('p7', 'Roberto Pinto',       4, 'https://ui-avatars.com/api/?name=Roberto+Pinto&background=E0C271&color=272727'),
('p8', 'Juliana Neves',       4, 'https://ui-avatars.com/api/?name=Juliana+Neves&background=E0C271&color=272727'),
('p9', 'Thiago Santos',       4, 'https://ui-avatars.com/api/?name=Thiago+Santos&background=E0C271&color=272727');

-- -----------------------------------------------------------------------------
-- 4. PRESTADORES (9 — cada um em uma área diferente)
-- -----------------------------------------------------------------------------
INSERT INTO prestadores (user_id, nome, bio, score, foto_url, status_verificacao) VALUES
('p1', 'Ana Souza',
 'Especialista em limpeza residencial e comercial com produtos ecológicos. Atendo São Paulo e Grande SP.',
 5, 'https://ui-avatars.com/api/?name=Ana+Souza&background=E0C271&color=272727', 'aprovado'),

('p2', 'Carlos Lima',
 'Eletricista certificado NR-10. Instalações, manutenção preventiva e laudos para imóveis comerciais e residenciais.',
 4, 'https://ui-avatars.com/api/?name=Carlos+Lima&background=E0C271&color=272727', 'aprovado'),

('p3', 'Pedro Alves',
 'Encanador com 12 anos de experiência. Detecção de vazamentos por termografia, instalações e desentupimentos.',
 5, 'https://ui-avatars.com/api/?name=Pedro+Alves&background=E0C271&color=272727', 'aprovado'),

('p4', 'Mariana Costa',
 'Professora de matemática e física. Especialista em preparação para ENEM e vestibulares. Aprovação garantida.',
 5, 'https://ui-avatars.com/api/?name=Mariana+Costa&background=E0C271&color=272727', 'aprovado'),

('p5', 'Fernanda Rocha',
 'Cabeleireira e esteticista especializada em colorimetria, mechas e tratamentos capilares premium.',
 5, 'https://ui-avatars.com/api/?name=Fernanda+Rocha&background=E0C271&color=272727', 'aprovado'),

('p6', 'Lucas Mendes',
 'Técnico em TI com 7 anos de experiência. Formatação, redes domésticas, suporte remoto e presencial.',
 4, 'https://ui-avatars.com/api/?name=Lucas+Mendes&background=E0C271&color=272727', 'aprovado'),

('p7', 'Roberto Pinto',
 'Pintor profissional com 15 anos de experiência. Acabamento premium em interiores, fachadas e texturas.',
 4, 'https://ui-avatars.com/api/?name=Roberto+Pinto&background=E0C271&color=272727', 'aprovado'),

('p8', 'Juliana Neves',
 'Paisagista e jardineira. Projetos de jardins verticais e horizontais, poda especializada e sistemas de irrigação.',
 4, 'https://ui-avatars.com/api/?name=Juliana+Neves&background=E0C271&color=272727', 'aprovado'),

('p9', 'Thiago Santos',
 'Carpinteiro especializado em decks, móveis planejados e estruturas de madeira sob medida com acabamento fino.',
 4, 'https://ui-avatars.com/api/?name=Thiago+Santos&background=E0C271&color=272727', 'aprovado');

-- -----------------------------------------------------------------------------
-- 5. PRESTADOR_CATEGORIAS — vínculo prestador ↔ categoria
-- -----------------------------------------------------------------------------
INSERT INTO prestador_categorias (prestador_id, categoria_id) VALUES
('p1', 'cat1'),
('p2', 'cat2'),
('p3', 'cat3'),
('p4', 'cat4'),
('p5', 'cat5'),
('p6', 'cat6'),
('p7', 'cat7'),
('p8', 'cat8'),
('p9', 'cat9');

-- -----------------------------------------------------------------------------
-- 6. ENDEREÇOS
-- -----------------------------------------------------------------------------
INSERT INTO enderecos (id, user_id, rotulo, logradouro, numero, bairro, cidade, estado, cep, is_principal) VALUES
(gen_random_uuid()::text, 'u_teste', 'Casa',       'Rua das Palmeiras',    '42',  'Jardim Paulista',     'São Paulo',             'SP', '01310200', TRUE),
(gen_random_uuid()::text, 'p1',      'Escritório', 'Av. Rebouças',         '800', 'Pinheiros',           'São Paulo',             'SP', '05401300', TRUE),
(gen_random_uuid()::text, 'p2',      'Escritório', 'Rua Augusta',          '500', 'Consolação',          'São Paulo',             'SP', '01305100', TRUE),
(gen_random_uuid()::text, 'p3',      'Escritório', 'Av. Paulista',         '200', 'Bela Vista',          'São Paulo',             'SP', '01310100', TRUE),
(gen_random_uuid()::text, 'p4',      'Casa',       'Rua XV de Novembro',   '33',  'Centro',              'Campinas',              'SP', '13013001', TRUE),
(gen_random_uuid()::text, 'p5',      'Salão',      'Av. Ibirapuera',       '150', 'Moema',               'São Paulo',             'SP', '04029000', TRUE),
(gen_random_uuid()::text, 'p6',      'Home Office','Rua Vergueiro',        '600', 'Liberdade',           'São Paulo',             'SP', '01504000', TRUE),
(gen_random_uuid()::text, 'p7',      'Escritório', 'Rua Teodoro Sampaio',  '300', 'Pinheiros',           'São Paulo',             'SP', '05406000', TRUE),
(gen_random_uuid()::text, 'p8',      'Escritório', 'Av. Brasil',           '220', 'Lapa',                'São Paulo',             'SP', '05036000', TRUE),
(gen_random_uuid()::text, 'p9',      'Oficina',    'Rua das Indústrias',   '88',  'Vila Industrial',     'São Bernardo do Campo', 'SP', '09750000', TRUE);

-- -----------------------------------------------------------------------------
-- 7. SERVIÇOS (9 — todos contratados pela conta teste)
--    Concluídos: s1–s5  |  Em aberto com estados diferentes: s6–s9
-- -----------------------------------------------------------------------------
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao,
                      preco_acordado, data_inicio, duracao, status,
                      nota_usuario, nota_prestador, nota) VALUES

-- ── CONCLUÍDOS ──────────────────────────────────────────────────────────────
('s1', 'u_teste', 'p1', 'cat1',
 'Limpeza Residencial Completa',
 'Limpeza de apartamento de 80 m²: sala, 2 quartos, cozinha e banheiro. Produtos ecológicos inclusos.',
 280.00, NOW() - INTERVAL '30 days', '5h', 'concluido', 4.5, 5.0, 4.75),

('s2', 'u_teste', 'p2', 'cat2',
 'Instalação de Painel Elétrico',
 'Substituição e modernização do quadro de disjuntores com 12 circuitos identificados e aterramento.',
 450.00, NOW() - INTERVAL '25 days', '4h', 'concluido', 5.0, 4.5, 4.75),

('s3', 'u_teste', 'p3', 'cat3',
 'Detecção e Reparo de Vazamento',
 'Localização de vazamento oculto por termografia e troca do trecho de tubulação na cozinha.',
 320.00, NOW() - INTERVAL '20 days', '3h', 'concluido', 5.0, 5.0, 5.0),

('s4', 'u_teste', 'p4', 'cat4',
 'Aulas de Matemática — Pacote 10h',
 'Revisão de álgebra, geometria analítica e trigonometria para o ENEM em 5 sessões de 2h.',
 500.00, NOW() - INTERVAL '15 days', '10h', 'concluido', 4.5, 5.0, 4.75),

('s5', 'u_teste', 'p5', 'cat5',
 'Coloração e Corte Profissional',
 'Mechas californianas + corte em camadas + hidratação no fio. Resultado natural e durável.',
 350.00, NOW() - INTERVAL '10 days', '3h', 'concluido', 5.0, 4.5, 4.75),

-- ── EM ABERTO (estados distintos) ───────────────────────────────────────────
('s6', 'u_teste', 'p6', 'cat6',
 'Formatação e Configuração de Notebook',
 'Reinstalação do sistema operacional Windows 11, drivers, programas essenciais e configuração Wi-Fi.',
 150.00, NOW() + INTERVAL '3 days', '2h', 'aberto', NULL, NULL, NULL),

('s7', 'u_teste', 'p7', 'cat7',
 'Pintura da Sala e Cozinha',
 'Pintura com tinta lavável premium em 2 demãos: sala (25 m²) em branco gelo e cozinha (12 m²) em cinza claro.',
 780.00, NOW() + INTERVAL '5 days', '8h', 'aceito', NULL, NULL, NULL),

('s8', 'u_teste', 'p8', 'cat8',
 'Jardim Vertical na Varanda',
 'Estrutura metálica + plantio de 15 espécies resistentes ao sol + sistema de irrigação automática.',
 620.00, NOW() - INTERVAL '2 days', '6h', 'em_andamento', NULL, NULL, NULL),

('s9', 'u_teste', 'p9', 'cat9',
 'Deck de Madeira Maçaranduba 3×4 m',
 'Construção de deck em maçaranduba com estrutura, fixação oculta e acabamento em óleo de proteção UV.',
 1200.00, NOW() + INTERVAL '10 days', '12h', 'pendente', NULL, NULL, NULL);

-- -----------------------------------------------------------------------------
-- 8. AVALIAÇÕES — somente para serviços concluídos (s1–s5)
--    Duas por serviço: usuário → prestador e prestador → usuário
-- -----------------------------------------------------------------------------
INSERT INTO avaliacoes (id, servico_id, user_id, prestador_id, listBy, avaliarBy, nota, comentario, destinatario) VALUES

-- s1 — Limpeza
('av1a', 's1', 'u_teste', 'p1', 'prestador', 'usuario',
 '4.5',
 'Ana fez um serviço impecável! Apartamento ficou perfeito do chão ao teto. Muito pontual e organizada.',
 'prestador'),
('av1b', 's1', 'u_teste', 'p1', 'usuario', 'prestador',
 '5.0',
 'Ótimo contratante! Ambiente organizado, comunicação clara e pagamento imediato.',
 'usuario'),

-- s2 — Elétrica
('av2a', 's2', 'u_teste', 'p2', 'prestador', 'usuario',
 '5.0',
 'Carlos é excelente! Serviço feito com total segurança. Explicou cada etapa do processo.',
 'prestador'),
('av2b', 's2', 'u_teste', 'p2', 'usuario', 'prestador',
 '4.5',
 'Local bem preparado para o serviço. Cliente prestativo e que facilitou muito o acesso ao quadro.',
 'usuario'),

-- s3 — Encanamento
('av3a', 's3', 'u_teste', 'p3', 'prestador', 'usuario',
 '5.0',
 'Pedro resolveu um problema que outros três encanadores não conseguiram detectar. Profissional exemplar!',
 'prestador'),
('av3b', 's3', 'u_teste', 'p3', 'usuario', 'prestador',
 '5.0',
 'Contratante excelente. Facilitou o acesso e pagou imediatamente após a conclusão.',
 'usuario'),

-- s4 — Aulas
('av4a', 's4', 'u_teste', 'p4', 'prestador', 'usuario',
 '4.5',
 'Mariana é uma professora brilhante! Didática incrível e paciência ilimitada. Já sinto muito mais confiança.',
 'prestador'),
('av4b', 's4', 'u_teste', 'p4', 'usuario', 'prestador',
 '5.0',
 'Aluno dedicado e esforçado. Presente em todas as sessões com exercícios feitos. Ótima evolução.',
 'usuario'),

-- s5 — Beleza
('av5a', 's5', 'u_teste', 'p5', 'prestador', 'usuario',
 '5.0',
 'Fernanda transformou meu cabelo! Técnica profissional de verdade. Resultado ficou lindo e natural.',
 'prestador'),
('av5b', 's5', 'u_teste', 'p5', 'usuario', 'prestador',
 '4.5',
 'Cliente pontual e simpática. Ficou muito satisfeita com o resultado. Voltaria a atender sem hesitar!',
 'usuario');

-- -----------------------------------------------------------------------------
-- 9. CARTEIRAS
-- -----------------------------------------------------------------------------
INSERT INTO carteiras (user_id, prestador_id, saldo, saldo_bloqueado, status) VALUES
('u_teste', NULL,  '1850.00', '0.00',   'ativa'),
(NULL,      'p1',  '2800.00', '0.00',   'ativa'),
(NULL,      'p2',  '3600.00', '0.00',   'ativa'),
(NULL,      'p3',  '2560.00', '0.00',   'ativa'),
(NULL,      'p4',  '4000.00', '0.00',   'ativa'),
(NULL,      'p5',  '2800.00', '0.00',   'ativa'),
(NULL,      'p6',  '0.00',    '150.00', 'ativa'),
(NULL,      'p7',  '0.00',    '780.00', 'ativa'),
(NULL,      'p8',  '0.00',    '0.00',   'ativa'),
(NULL,      'p9',  '0.00',    '0.00',   'ativa');

-- -----------------------------------------------------------------------------
-- 10. PORTFOLIO ITEMS — 2 por prestador (para aparecerem no Explorar)
-- -----------------------------------------------------------------------------
INSERT INTO portfolio_items (id, prestador_id, url, tipo, descricao, ordem) VALUES
('pi1a', 'p1', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'imagem', 'Limpeza pós-mudança — sala e quartos', 0),
('pi1b', 'p1', 'https://images.unsplash.com/photo-1527515637462-cff94aca208b?w=400', 'imagem', 'Limpeza comercial — escritório corporativo', 1),
('pi2a', 'p2', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400', 'imagem', 'Quadro elétrico modernizado com 12 circuitos', 0),
('pi2b', 'p2', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 'imagem', 'Instalação de iluminação LED embutida', 1),
('pi3a', 'p3', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400', 'imagem', 'Reparo de vazamento com termografia', 0),
('pi3b', 'p3', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400', 'imagem', 'Instalação hidráulica completa em banheiro', 1),
('pi4a', 'p4', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', 'imagem', 'Aula de geometria analítica para o ENEM', 0),
('pi4b', 'p4', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', 'imagem', 'Material didático personalizado por aluno', 1),
('pi5a', 'p5', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400', 'imagem', 'Mechas californianas em cabelo castanho', 0),
('pi5b', 'p5', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', 'imagem', 'Coloração + corte + hidratação completa', 1),
('pi6a', 'p6', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400', 'imagem', 'Configuração de rede doméstica mesh', 0),
('pi6b', 'p6', 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400', 'imagem', 'Formatação e setup completo de workstation', 1),
('pi7a', 'p7', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400', 'imagem', 'Pintura de sala com textura premium', 0),
('pi7b', 'p7', 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400', 'imagem', 'Fachada residencial repintada em branco', 1),
('pi8a', 'p8', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 'imagem', 'Jardim vertical com irrigação automática', 0),
('pi8b', 'p8', 'https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=400', 'imagem', 'Paisagismo de área externa — projeto completo', 1),
('pi9a', 'p9', 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400', 'imagem', 'Deck em maçaranduba com fixação oculta', 0),
('pi9b', 'p9', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'imagem', 'Estante embutida em madeira de demolição', 1);

-- -----------------------------------------------------------------------------
-- 11. MENSAGENS (5–8 por serviço)
-- -----------------------------------------------------------------------------

-- s1: Limpeza — CONCLUÍDO (7 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's1', 'u_teste',
 'Olá, Ana! Vi seu perfil e gostei muito. Tenho um apartamento de 80m² para limpar. Você tem disponibilidade esta semana?',
 'texto', NOW() - INTERVAL '32 days', NOW() - INTERVAL '32 days'),
(gen_random_uuid()::text, 's1', 'p1',
 'Olá! Sim, tenho disponibilidade. Qual o número de cômodos e precisa de produtos especiais para algum material?',
 'texto', NOW() - INTERVAL '31 days 23 hours', NOW() - INTERVAL '31 days 22 hours'),
(gen_random_uuid()::text, 's1', 'u_teste',
 'Sala, 2 quartos, cozinha e 1 banheiro. Está bem empoeirado depois da mudança, mas sem nada especial.',
 'texto', NOW() - INTERVAL '31 days 21 hours', NOW() - INTERVAL '31 days 20 hours'),
(gen_random_uuid()::text, 's1', 'p1',
 'Tranquilo! Para esse tamanho leva cerca de 5h. Posso ir segunda-feira às 8h por R$280. Fechamos?',
 'texto', NOW() - INTERVAL '31 days 19 hours', NOW() - INTERVAL '31 days 18 hours'),
(gen_random_uuid()::text, 's1', 'u_teste',
 'Fechado! Segunda às 8h está ótimo. Deixo as chaves com o porteiro. Obrigado!',
 'texto', NOW() - INTERVAL '31 days 17 hours', NOW() - INTERVAL '31 days 16 hours'),
(gen_random_uuid()::text, 's1', 'p1',
 'Confirmado! Estarei lá na segunda. Qualquer dúvida é só chamar.',
 'texto', NOW() - INTERVAL '31 days 15 hours', NOW() - INTERVAL '31 days 14 hours'),
(gen_random_uuid()::text, 's1', 'u_teste',
 'Que serviço incrível! O apartamento ficou perfeito. Muito obrigado, Ana! Com certeza chamo novamente.',
 'texto', NOW() - INTERVAL '30 days 2 hours', NOW() - INTERVAL '30 days 1 hour');

-- s2: Elétrica — CONCLUÍDO (6 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's2', 'u_teste',
 'Carlos, boa tarde! Preciso trocar meu quadro de disjuntores antigo. Você faz esse tipo de serviço?',
 'texto', NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days'),
(gen_random_uuid()::text, 's2', 'p2',
 'Boa tarde! Faço sim. Quantos circuitos você precisa? Tem algum disjuntor que cai com frequência?',
 'texto', NOW() - INTERVAL '26 days 22 hours', NOW() - INTERVAL '26 days 21 hours'),
(gen_random_uuid()::text, 's2', 'u_teste',
 'Umas 12 tomadas. É um apartamento de 90m² e o disjuntor da cozinha cai toda vez que ligo o micro-ondas.',
 'texto', NOW() - INTERVAL '26 days 20 hours', NOW() - INTERVAL '26 days 19 hours'),
(gen_random_uuid()::text, 's2', 'p2',
 'Entendido, provavelmente é subdimensionamento. Orçamento R$450 com material. Posso ir no próximo sábado às 10h?',
 'texto', NOW() - INTERVAL '26 days 18 hours', NOW() - INTERVAL '26 days 17 hours'),
(gen_random_uuid()::text, 's2', 'u_teste',
 'Sábado às 10h perfeito! Fico em casa para acompanhar. Confirmado.',
 'texto', NOW() - INTERVAL '26 days 16 hours', NOW() - INTERVAL '26 days 15 hours'),
(gen_random_uuid()::text, 's2', 'p2',
 'Serviço concluído! Novo quadro instalado com 12 circuitos identificados e aterrado corretamente. Problema resolvido.',
 'texto', NOW() - INTERVAL '25 days 2 hours', NOW() - INTERVAL '25 days 1 hour');

-- s3: Encanamento — CONCLUÍDO (8 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's3', 'u_teste',
 'Pedro, boa tarde! Tenho um vazamento na parede da cozinha mas não sei de onde vem exatamente. Você pode ajudar?',
 'texto', NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
(gen_random_uuid()::text, 's3', 'p3',
 'Boa tarde! Isso é comum. Você notou apenas umidade ou tem manchas escurecendo o reboco?',
 'texto', NOW() - INTERVAL '21 days 23 hours', NOW() - INTERVAL '21 days 22 hours'),
(gen_random_uuid()::text, 's3', 'u_teste',
 'Tem uma mancha no rodapé que foi crescendo há uns 10 dias. Estou preocupado com a estrutura.',
 'texto', NOW() - INTERVAL '21 days 21 hours', NOW() - INTERVAL '21 days 20 hours'),
(gen_random_uuid()::text, 's3', 'p3',
 'Uso termografia para localizar sem abrir a parede toda. Custo R$320 com material. Posso ir amanhã às 8h?',
 'texto', NOW() - INTERVAL '21 days 19 hours', NOW() - INTERVAL '21 days 18 hours'),
(gen_random_uuid()::text, 's3', 'u_teste',
 'Amanhã às 8h ótimo! Ficarei em casa aguardando.',
 'texto', NOW() - INTERVAL '21 days 17 hours', NOW() - INTERVAL '21 days 16 hours'),
(gen_random_uuid()::text, 's3', 'p3',
 'Encontrado! Era um cano de 1/2" com microtrinca atrás da parede. Vou precisar abrir 30 cm para acessar. Autoriza?',
 'texto', NOW() - INTERVAL '20 days 10 hours', NOW() - INTERVAL '20 days 9 hours'),
(gen_random_uuid()::text, 's3', 'u_teste',
 'Autorizado! Pode fazer o que for necessário.',
 'texto', NOW() - INTERVAL '20 days 9 hours', NOW() - INTERVAL '20 days 8 hours'),
(gen_random_uuid()::text, 's3', 'p3',
 'Pronto! Cano trocado e parede fechada com massa corrida. Recomendo monitorar por 48h para confirmar.',
 'texto', NOW() - INTERVAL '20 days 3 hours', NOW() - INTERVAL '20 days 2 hours');

-- s4: Aulas Particulares — CONCLUÍDO (5 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's4', 'u_teste',
 'Boa noite, Mariana! Preciso de aulas de matemática focadas no ENEM. Você tem disponibilidade?',
 'texto', NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),
(gen_random_uuid()::text, 's4', 'p4',
 'Boa noite! Sim! Faço um diagnóstico inicial gratuito para mapear os pontos fracos. Pacotes de 10h por R$500.',
 'texto', NOW() - INTERVAL '16 days 22 hours', NOW() - INTERVAL '16 days 21 hours'),
(gen_random_uuid()::text, 's4', 'u_teste',
 'Me interessa! Tenho mais dificuldade em geometria espacial e probabilidade. Podemos focar nisso?',
 'texto', NOW() - INTERVAL '16 days 20 hours', NOW() - INTERVAL '16 days 19 hours'),
(gen_random_uuid()::text, 's4', 'p4',
 'Perfeito! Montarei um plano personalizado. Aulas às segundas e quintas 19h–21h. Funciona?',
 'texto', NOW() - INTERVAL '16 days 18 hours', NOW() - INTERVAL '16 days 17 hours'),
(gen_random_uuid()::text, 's4', 'u_teste',
 'As aulas foram incríveis! Mariana explica tudo de forma muito clara e com calma. Sinto muito mais confiança agora!',
 'texto', NOW() - INTERVAL '15 days 1 hour', NOW() - INTERVAL '15 days');

-- s5: Beleza — CONCLUÍDO (7 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's5', 'u_teste',
 'Oi, Fernanda! Quero fazer mechas californianas e um bom corte. Você tem agenda disponível?',
 'texto', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
(gen_random_uuid()::text, 's5', 'p5',
 'Oi! Tenho sim. São 3h de serviço. Mechas + corte + hidratação por R$350. Seu cabelo é claro ou escuro?',
 'texto', NOW() - INTERVAL '11 days 23 hours', NOW() - INTERVAL '11 days 22 hours'),
(gen_random_uuid()::text, 's5', 'u_teste',
 'Castanho escuro. Quero clarear um pouco e fazer mechas mais sutis para ficar natural.',
 'texto', NOW() - INTERVAL '11 days 21 hours', NOW() - INTERVAL '11 days 20 hours'),
(gen_random_uuid()::text, 's5', 'p5',
 'Essa combinação fica linda! Pode vir sábado às 9h? O processo pode levar até 3h30.',
 'texto', NOW() - INTERVAL '11 days 19 hours', NOW() - INTERVAL '11 days 18 hours'),
(gen_random_uuid()::text, 's5', 'u_teste',
 'Sábado às 9h está perfeito! Qual o endereço do salão?',
 'texto', NOW() - INTERVAL '11 days 17 hours', NOW() - INTERVAL '11 days 16 hours'),
(gen_random_uuid()::text, 's5', 'p5',
 'Endereço confirmado pelo sistema. Chegue com o cabelo lavado e seco para ganharmos tempo. Até sábado!',
 'texto', NOW() - INTERVAL '11 days 15 hours', NOW() - INTERVAL '11 days 14 hours'),
(gen_random_uuid()::text, 's5', 'u_teste',
 'Ficou INCRÍVEL! Amei o resultado. Fernanda é muito profissional e atenciosa. Voltarei com certeza!',
 'texto', NOW() - INTERVAL '10 days 2 hours', NOW() - INTERVAL '10 days 1 hour');

-- s6: TI — ABERTO (6 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's6', 'u_teste',
 'Lucas, olá! Meu notebook está super lento e travando bastante. Você consegue resolver?',
 'texto', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(gen_random_uuid()::text, 's6', 'p6',
 'Olá! Consigo sim. Qual é a marca e modelo? E qual sistema operacional?',
 'texto', NOW() - INTERVAL '1 day 22 hours', NOW() - INTERVAL '1 day 21 hours'),
(gen_random_uuid()::text, 's6', 'u_teste',
 'Dell Inspiron, Windows 11. Está há 3 anos sem formatar e com uns 500 GB de arquivos.',
 'texto', NOW() - INTERVAL '1 day 20 hours', NOW() - INTERVAL '1 day 19 hours'),
(gen_random_uuid()::text, 's6', 'p6',
 'Formatação completa resolve! Instalo Windows limpo, drivers e programas. Faço backup antes. R$150. Posso ir quarta?',
 'texto', NOW() - INTERVAL '1 day 18 hours', NOW() - INTERVAL '1 day 17 hours'),
(gen_random_uuid()::text, 's6', 'u_teste',
 'Quarta às 14h seria bom. Quanto tempo leva?',
 'texto', NOW() - INTERVAL '1 day 16 hours', NOW() - INTERVAL '1 day 15 hours'),
(gen_random_uuid()::text, 's6', 'p6',
 'Cerca de 2h a 2h30. Pode acompanhar o processo. Até quarta!',
 'texto', NOW() - INTERVAL '1 day 14 hours', NOW() - INTERVAL '1 day 13 hours');

-- s7: Pintura — ACEITO (6 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's7', 'u_teste',
 'Oi, Roberto! Quero pintar sala (25 m²) e cozinha (12 m²). Qual seria o custo?',
 'texto', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(gen_random_uuid()::text, 's7', 'p7',
 'Oi! Com 2 demãos e massa corrida onde necessário fica R$780 com material premium. Que cores você quer?',
 'texto', NOW() - INTERVAL '2 days 22 hours', NOW() - INTERVAL '2 days 21 hours'),
(gen_random_uuid()::text, 's7', 'u_teste',
 'Sala branco gelo e cozinha cinza claro. A parede é texturizada, você tem experiência com isso?',
 'texto', NOW() - INTERVAL '2 days 20 hours', NOW() - INTERVAL '2 days 19 hours'),
(gen_random_uuid()::text, 's7', 'p7',
 'Parede texturizada é minha especialidade! Aceito o serviço. Posso ir sábado às 7h para aproveitar a luz.',
 'texto', NOW() - INTERVAL '2 days 18 hours', NOW() - INTERVAL '2 days 17 hours'),
(gen_random_uuid()::text, 's7', 'u_teste',
 'Ótimo! Sábado às 7h confirmado. Vou tirar os móveis da sala antes.',
 'texto', NOW() - INTERVAL '2 days 16 hours', NOW() - INTERVAL '2 days 15 hours'),
(gen_random_uuid()::text, 's7', 'p7',
 'Perfeito! Coloque plástico no piso também. A tinta seca em 4h, então 2 demãos em um dia. Até sábado!',
 'texto', NOW() - INTERVAL '2 days 14 hours', NOW() - INTERVAL '2 days 13 hours');

-- s8: Jardinagem — EM_ANDAMENTO (8 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's8', 'u_teste',
 'Juliana, tudo bem? Quero criar um jardim vertical na minha varanda de 3 m². Você faz projetos assim?',
 'texto', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(gen_random_uuid()::text, 's8', 'p8',
 'Tudo bem! Amo jardins verticais! Você prefere algo mais verde/tropical ou com flores?',
 'texto', NOW() - INTERVAL '7 days 22 hours', NOW() - INTERVAL '7 days 21 hours'),
(gen_random_uuid()::text, 's8', 'u_teste',
 'Gosto das duas opções, mas preciso de plantas que não exijam muita manutenção pois viajo muito.',
 'texto', NOW() - INTERVAL '7 days 20 hours', NOW() - INTERVAL '7 days 19 hours'),
(gen_random_uuid()::text, 's8', 'p8',
 'Recomendo suculentas e samambaias robustas. Incluo irrigação automática! R$620 tudo incluso. Fecha?',
 'texto', NOW() - INTERVAL '7 days 18 hours', NOW() - INTERVAL '7 days 17 hours'),
(gen_random_uuid()::text, 's8', 'u_teste',
 'A irrigação automática é exatamente o que precisava! Vamos fechar!',
 'texto', NOW() - INTERVAL '7 days 16 hours', NOW() - INTERVAL '7 days 15 hours'),
(gen_random_uuid()::text, 's8', 'p8',
 'Fechado! Começo amanhã com a estrutura metálica. Levo 2 dias para concluir tudo.',
 'texto', NOW() - INTERVAL '7 days 14 hours', NOW() - INTERVAL '7 days 13 hours'),
(gen_random_uuid()::text, 's8', 'p8',
 'Estrutura montada! Ficou muito resistente. Amanhã trago as plantas e instalo a irrigação automática.',
 'texto', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(gen_random_uuid()::text, 's8', 'u_teste',
 'Estou adorando como está ficando! A estrutura ficou linda. Mal posso esperar para ver as plantas!',
 'texto', NOW() - INTERVAL '2 days 22 hours', NOW() - INTERVAL '2 days 21 hours');

-- s9: Carpintaria — PENDENTE (5 mensagens)
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia, created_at, lida_em) VALUES
(gen_random_uuid()::text, 's9', 'u_teste',
 'Thiago, boa tarde! Tenho uma varanda de 3×4 m e gostaria de instalar um deck. Você faz?',
 'texto', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(gen_random_uuid()::text, 's9', 'p9',
 'Boa tarde! Faço sim. Trabalho com ipê, cumaru e maçaranduba. Cada uma tem características diferentes. Qual prefere?',
 'texto', NOW() - INTERVAL '3 days 22 hours', NOW() - INTERVAL '3 days 21 hours'),
(gen_random_uuid()::text, 's9', 'u_teste',
 'Não sei a diferença entre elas. Quero algo durável e que não desbote muito ao sol.',
 'texto', NOW() - INTERVAL '3 days 20 hours', NOW() - INTERVAL '3 days 19 hours'),
(gen_random_uuid()::text, 's9', 'p9',
 'Para sol intenso recomendo maçaranduba: alta dureza e não apodrece. Com óleo UV fica protegida por anos. R$1.200 para 12 m². Posso enviar orçamento detalhado?',
 'texto', NOW() - INTERVAL '3 days 18 hours', NOW() - INTERVAL '3 days 17 hours'),
(gen_random_uuid()::text, 's9', 'u_teste',
 'Sim, manda o orçamento detalhado! Parece ótimo mas quero analisar com calma antes de confirmar.',
 'texto', NOW() - INTERVAL '3 days 16 hours', NOW() - INTERVAL '3 days 15 hours');

-- -----------------------------------------------------------------------------
-- 12. AGENDAMENTOS — para serviços em aberto
-- -----------------------------------------------------------------------------
INSERT INTO agendamentos (id, user_id, prestador_id, dia_semana, hora_inicio, hora_fim) VALUES
(gen_random_uuid()::text, 'u_teste', 'p6', 'Quarta-feira',  '14:00', '16:30'),
(gen_random_uuid()::text, 'u_teste', 'p7', 'Sábado',        '07:00', '15:00'),
(gen_random_uuid()::text, 'u_teste', 'p8', 'Sexta-feira',   '09:00', '15:00'),
(gen_random_uuid()::text, 'u_teste', 'p9', 'Segunda-feira', '08:00', '20:00');

-- -----------------------------------------------------------------------------
-- 13. NOTIFICAÇÕES
-- -----------------------------------------------------------------------------
INSERT INTO notificacoes (id, usuario_id, titulo, mensagem, tipo) VALUES
(gen_random_uuid()::text, 'u_teste', 'Serviço Aceito',
 'Roberto Pinto aceitou seu pedido de pintura. Verifique o agendamento no app.', 'sucesso'),
(gen_random_uuid()::text, 'u_teste', 'Serviço em Andamento',
 'Juliana Neves está trabalhando no seu jardim vertical. Acompanhe pelo chat.', 'info'),
(gen_random_uuid()::text, 'u_teste', 'Nova Mensagem',
 'Lucas Mendes enviou uma mensagem sobre a formatação do notebook.', 'info'),
(gen_random_uuid()::text, 'u_teste', 'Avaliação Recebida',
 'Ana Souza avaliou sua contratação. Confira o que ela disse!', 'info'),
(gen_random_uuid()::text, 'u_teste', 'Avaliação Recebida',
 'Pedro Alves avaliou sua contratação com nota 5.0!', 'sucesso'),
(gen_random_uuid()::text, 'p1', 'Avaliação Recebida',
 'Você recebeu uma avaliação de Teste. Nota: 4.5. Confira os comentários!', 'sucesso'),
(gen_random_uuid()::text, 'p3', 'Avaliação Recebida',
 'Você recebeu uma avaliação de Teste. Nota: 5.0. Parabéns!', 'sucesso');
