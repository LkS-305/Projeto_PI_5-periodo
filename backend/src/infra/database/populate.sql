-- 1. Categorias
INSERT INTO categorias (id, nome, slug, icon_url) VALUES
('cat1', 'Limpeza',              'limpeza',    'https://placehold.co/100x100?text=Limpeza'),
('cat2', 'Manutenção Elétrica',  'eletrica',   'https://placehold.co/100x100?text=Eletrica'),
('cat3', 'Encanador',            'encanador',  'https://placehold.co/100x100?text=Encanador'),
('cat4', 'Aulas Particulares',   'aulas',      'https://placehold.co/100x100?text=Aulas'),
('cat5', 'Beleza e Estética',    'beleza',     'https://placehold.co/100x100?text=Beleza'),
('cat6', 'TI e Suporte',         'ti-suporte', 'https://placehold.co/100x100?text=TI');

-- 2. Users (autenticação)
INSERT INTO users (id, email, senha, cpf) VALUES
('u1',  'joao@email.com',           'hash_senha_1',  '11111111111'),
('u2',  'maria@email.com',          'hash_senha_2',  '22222222222'),
('u3',  'pedro.encanador@email.com','hash_senha_3',  '33333333333'),
('u4',  'ana.limpeza@email.com',    'hash_senha_4',  '44444444444'),
('u5',  'carlos.eletrica@email.com','hash_senha_5',  '55555555555'),
('u6',  'fernanda@email.com',       'hash_senha_6',  '66666666666'),
('u7',  'roberto@email.com',        'hash_senha_7',  '77777777777'),
('u8',  'lucas.tech@email.com',     'hash_senha_8',  '88888888888'),
('u9',  'juliana@email.com',        'hash_senha_9',  '99999999999'),
('u10', 'admin@sistema.com',        'hash_senha_10', '00000000000');

-- 3. Usuarios (perfis — clientes + prestadores precisam estar aqui para ter endereço)
INSERT INTO usuarios (user_id, nome, telefone, score, foto_url) VALUES
('u1',  'João Silva',      '(11) 91111-1111', 95,  'https://ui-avatars.com/api/?name=Joao+Silva'),
('u2',  'Maria Oliveira',  '(41) 92222-2222', 100, 'https://ui-avatars.com/api/?name=Maria+Oliveira'),
('u3',  'Pedro Encanador', '(11) 93333-3333', 5,  'https://ui-avatars.com/api/?name=Pedro+Encanador'),
('u4',  'Ana Limpezas',    '(11) 94444-4444', 4,  'https://ui-avatars.com/api/?name=Ana+Limpezas'),
('u5',  'Carlos Elétrica', '(19) 95555-5555', 4,  'https://ui-avatars.com/api/?name=Carlos+Eletrica'),
('u6',  'Fernanda Souza',  '(31) 96666-6666', 88,  'https://ui-avatars.com/api/?name=Fernanda+Souza'),
('u7',  'Roberto Carlos',  '(21) 97777-7777', 92,  'https://ui-avatars.com/api/?name=Roberto+Carlos'),
('u8',  'Lucas Tech',      '(16) 98888-8888', 4,  'https://ui-avatars.com/api/?name=Lucas+Tech'),
('u9',  'Juliana Lima',    '(71) 99999-9999', 98,  'https://ui-avatars.com/api/?name=Juliana+Lima');

-- 4. Prestadores
INSERT INTO prestadores (user_id, nome, bio, score, foto_url, status_verificacao) VALUES
('u3', 'Pedro Encanador', 'Especialista em encanamentos e vazamentos com 10 anos de experiência.', 4, 'https://ui-avatars.com/api/?name=Pedro+Encanador', 'aprovado'),
('u4', 'Ana Limpezas',    'Limpeza residencial e comercial pós-obra. Detalhista e ágil.',          5, 'https://ui-avatars.com/api/?name=Ana+Limpezas',    'aprovado'),
('u5', 'Carlos Elétrica', 'Eletricista certificado. Instalações e manutenção de ar-condicionado.', 4, 'https://ui-avatars.com/api/?name=Carlos+Eletrica',  'aprovado'),
('u8', 'Lucas Tech',      'Suporte técnico, formatação de computadores e configuração de redes.',  4, 'https://ui-avatars.com/api/?name=Lucas+Tech',       'pendente');

-- 5. Endereços (CEPs reais de cidades brasileiras para testar distância)
INSERT INTO enderecos (id, user_id, rotulo, logradouro, numero, bairro, cidade, estado, cep, is_principal) VALUES
-- Clientes
(gen_random_uuid()::text, 'u1', 'Casa',      'Rua das Flores',  '123', 'Jardim América',  'São Paulo',       'SP', '01310100', TRUE),  -- Av. Paulista, SP
(gen_random_uuid()::text, 'u2', 'Casa',      'Rua XV de Nov.',  '50',  'Centro',           'Curitiba',        'PR', '80020310', TRUE),  -- Centro Curitiba
(gen_random_uuid()::text, 'u6', 'Casa',      'Rua Bahia',       '45',  'Funcionários',     'Belo Horizonte',  'MG', '30130110', TRUE),  -- BH
(gen_random_uuid()::text, 'u7', 'Casa',      'Av. Atlântica',   '200', 'Copacabana',       'Rio de Janeiro',  'RJ', '22010010', TRUE),  -- RJ
(gen_random_uuid()::text, 'u9', 'Casa',      'Rua da Palma',    '10',  'Centro',           'Salvador',        'BA', '40020010', TRUE),  -- Salvador
-- Prestadores
(gen_random_uuid()::text, 'u3', 'Escritório','Rua Augusta',     '900', 'Consolação',       'São Paulo',       'SP', '01305100', TRUE),  -- SP (perto de u1)
(gen_random_uuid()::text, 'u4', 'Escritório','Av. Rebouças',    '600', 'Pinheiros',        'São Paulo',       'SP', '05401300', TRUE),  -- SP
(gen_random_uuid()::text, 'u5', 'Escritório','Rua Marechal',    '300', 'Centro',           'Campinas',        'SP', '13013001', TRUE),  -- Campinas
(gen_random_uuid()::text, 'u8', 'Escritório','Rua José Boni',   '77',  'Centro',           'São Carlos',      'SP', '13560047', TRUE);  -- São Carlos

-- 6. Serviços
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao, preco_acordado, data_inicio, duracao, status) VALUES
('s1', 'u1', 'u3', 'cat3', 'Conserto de Vazamento',         'Reparo em cano com vazamento na cozinha.',            150.00, NOW() + INTERVAL '2 days',  '2h',   'aberto'),
('s2', 'u2', 'u4', 'cat1', 'Limpeza Residencial Completa',  'Limpeza de 3 cômodos com produtos inclusos.',         200.00, NOW() + INTERVAL '3 days',  '4h',   'aberto'),
('s3', 'u6', 'u5', 'cat2', 'Instalação de Tomadas',         'Instalação de 5 tomadas com aterramento.',            120.00, NOW() + INTERVAL '1 day',   '3h',   'aberto'),
('s4', 'u7', 'u8', 'cat6', 'Formatação e Configuração',     'Formatação de notebook com instalação de programas.',  90.00, NOW() + INTERVAL '5 days',  '2h',   'aberto'),
('s5', 'u1', 'u4', 'cat1', 'Limpeza Pós-Obra',              'Limpeza pesada após reforma no banheiro.',            350.00, NOW() + INTERVAL '7 days',  '6h',   'aberto'),
('s6', 'u9', 'u3', 'cat3', 'Desentupimento',                'Desentupimento de pia e ralo.',                        80.00, NOW() + INTERVAL '1 day',   '1h',   'aberto');

-- 7. Carteiras
INSERT INTO carteiras (user_id, prestador_id, saldo, status) VALUES
('u1', NULL,  '500.00',  'ativa'),
('u2', NULL,  '1250.50', 'ativa'),
('u6', NULL,  '300.00',  'ativa'),
('u7', NULL,  '750.00',  'ativa'),
('u9', NULL,  '180.00',  'ativa'),
(NULL, 'u3',  '1500.00', 'ativa'),
(NULL, 'u4',  '3200.00', 'ativa'),
(NULL, 'u5',  '450.00',  'ativa'),
(NULL, 'u8',  '920.00',  'ativa');

-- 8. Agendamentos
INSERT INTO agendamentos (id, user_id, prestador_id, dia_semana, hora_inicio, hora_fim) VALUES
(gen_random_uuid()::text, 'u1', 'u3', 'Segunda-feira', '09:00', '11:00'),
(gen_random_uuid()::text, 'u2', 'u4', 'Quarta-feira',  '14:00', '18:00'),
(gen_random_uuid()::text, 'u6', 'u5', 'Sábado',        '08:00', '12:00'),
(gen_random_uuid()::text, 'u7', 'u8', 'Sexta-feira',   '10:00', '12:00'),
(gen_random_uuid()::text, 'u9', 'u3', 'Terça-feira',   '07:00', '09:00');

-- 9. Notificações
INSERT INTO notificacoes (id, usuario_id, titulo, mensagem, tipo) VALUES
(gen_random_uuid()::text, 'u1', 'Serviço Agendado',   'Conserto de vazamento confirmado para segunda.',    'info'),
(gen_random_uuid()::text, 'u2', 'Limpeza Confirmada', 'Sua limpeza residencial está agendada.',            'sucesso'),
(gen_random_uuid()::text, 'u6', 'Novo Prestador',     'Carlos Elétrica aceitou seu pedido.',               'info'),
(gen_random_uuid()::text, 'u7', 'Serviço Concluído',  'Formatação finalizada com sucesso.',                'sucesso');

-- 10. Mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia) VALUES
(gen_random_uuid()::text, 's1', 'u1', 'Olá, qual horário está disponível?',       'texto'),
(gen_random_uuid()::text, 's1', 'u3', 'Posso ir segunda às 9h!',                  'texto'),
(gen_random_uuid()::text, 's2', 'u2', 'Preciso de limpeza pesada, tem disponível?','texto'),
(gen_random_uuid()::text, 's2', 'u4', 'Sim! Posso ir na quarta às 14h.',           'texto');

-- 11. Prestador <-> Categorias (necessário para a tela /explore)
INSERT INTO prestador_categorias (prestador_id, categoria_id) VALUES
('u3', 'cat3'),  -- Pedro Encanador -> Encanador
('u4', 'cat1'),  -- Ana Limpezas   -> Limpeza
('u5', 'cat2'),  -- Carlos Elétrica -> Manutenção Elétrica
('u8', 'cat6');  -- Lucas Tech      -> TI e Suporte

-- 12. Itens de portfólio (aparecem nos cards do /explore e em /portifolio)
INSERT INTO portfolio_items (id, prestador_id, url, tipo, descricao, ordem) VALUES
(gen_random_uuid()::text, 'u3', 'https://picsum.photos/seed/pedro1/600/400', 'imagem', 'Troca de tubulação', 0),
(gen_random_uuid()::text, 'u3', 'https://picsum.photos/seed/pedro2/600/400', 'imagem', 'Reparo de vazamento', 1),
(gen_random_uuid()::text, 'u4', 'https://picsum.photos/seed/ana1/600/400',   'imagem', 'Limpeza pós-obra',    0),
(gen_random_uuid()::text, 'u4', 'https://picsum.photos/seed/ana2/600/400',   'imagem', 'Cozinha higienizada', 1),
(gen_random_uuid()::text, 'u5', 'https://picsum.photos/seed/carlos1/600/400','imagem', 'Quadro elétrico novo', 0),
(gen_random_uuid()::text, 'u8', 'https://picsum.photos/seed/lucas1/600/400', 'imagem', 'Setup montado',        0);
