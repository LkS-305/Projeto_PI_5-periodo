-- =============================================================================
-- IDs UUID fixos (seed): user uK → 11111111-1111-4111-8111-00000000000K | cat → 2222… | servico sN → 3333…+NN12 | txN → 4444… | rN → 5555… | tx pendente → …9998999999998
-- u11–u54: prestadores extras só para enriquecer /explore (mesma senha senha123)
-- Dados de desenvolvimento (executado por `npm run db:seed` após TRUNCATE).
-- Senha de todos os users de seed: senha123
--
-- Convenções alinhadas ao código atual:
--   • servicos.status → ServicoStatus (criado, aceito, finalizado, …)
--   • transacoes.tipo / status → enviar|receber + pendente|aprovada|…
--   • transacoes.metodo_pagamento → Pix | Credito | Boleto
-- =============================================================================

-- 1. Categorias (idempotente se correr só este bloco numa base já migrada)
INSERT INTO categorias (id, nome, slug, icon_url) VALUES
('22222222-2222-4222-8222-000000000001', 'Limpeza',              'limpeza',    'https://placehold.co/100x100?text=Limpeza'),
('22222222-2222-4222-8222-000000000002', 'Manutenção Elétrica',  'eletrica',   'https://placehold.co/100x100?text=Eletrica'),
('22222222-2222-4222-8222-000000000003', 'Encanador',            'encanador',  'https://placehold.co/100x100?text=Encanador'),
('22222222-2222-4222-8222-000000000004', 'Aulas Particulares',   'aulas',      'https://placehold.co/100x100?text=Aulas'),
('22222222-2222-4222-8222-000000000005', 'Beleza e Estética',    'beleza',     'https://placehold.co/100x100?text=Beleza'),
('22222222-2222-4222-8222-000000000006', 'TI e Suporte',         'ti-suporte', 'https://placehold.co/100x100?text=TI')
ON CONFLICT (id) DO NOTHING;

-- 2. Users (autenticação)
INSERT INTO users (id, email, senha, cpf) VALUES
('11111111-1111-4111-8111-000000000001',  'joao@email.com',           '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS',  '11111111111'),
('11111111-1111-4111-8111-000000000002',  'maria@email.com',          '$2b$10$3WfI.7NAWaaTfbiRAcDpDeI4odyP/44wIKeVHHwVZ0jPXtau.juhe',  '22222222222'),
('11111111-1111-4111-8111-000000000003',  'pedro.encanador@email.com','$2b$10$jwDggQy8L4KnKMnhwqtcg.UEGofv3gJLiw8xJD/Vyl9c.w1S3qlXS',  '33333333333'),
('11111111-1111-4111-8111-000000000004',  'ana.limpeza@email.com',    '$2b$10$Uqj5xRhkMimToFExmW7Lj.JE0GHlDaDfrKIgVmDj3PQgcgJhu5.n.',  '44444444444'),
('11111111-1111-4111-8111-000000000005',  'carlos.eletrica@email.com','$2b$10$jdLnTi12KBTwpMdHDlRpruqHI2mRl4TpWtv1EtQUEuVGACvYMcdVK',  '55555555555'),
('11111111-1111-4111-8111-000000000006',  'fernanda@email.com',       '$2b$10$1XjuwOKPdAeLMkyjTa.G4Of8q8Niok/7f.cluhdXsfhzy3UApwvVW',  '66666666666'),
('11111111-1111-4111-8111-000000000007',  'roberto@email.com',        '$2b$10$unJwRekY.ILFFIF/2ncine9Sq1H5WavzdkPVQr7nPHbRXpGnrrp0C',  '77777777777'),
('11111111-1111-4111-8111-000000000008',  'lucas.tech@email.com',     '$2b$10$7A.ckMGrCYBepMB9eH2dIe0sZG2hPOIDTa6dTSpsEyJJNu/15qQJK',  '88888888888'),
('11111111-1111-4111-8111-000000000009',  'juliana@email.com',        '$2b$10$QgS3/gutSH1olvxEOwQ.LOB8JLYcgk.xzhZhMijbPu6tisD9kQrha',  '99999999999'),
('11111111-1111-4111-8111-000000000010', 'admin@sistema.com',        '$2b$10$S4Ltm3B59oXLOVWNNoBJDOldd1CUgiu806Ura./Qvc.7WUVXnWOf.',  '00000000000');

-- 2b–5b / 11b: prestadores extras para /explore (~8 por categoria; senha: senha123)
INSERT INTO users (id, email, senha, cpf) VALUES
('11111111-1111-4111-8111-000000000011', 'seed.explore.11@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000011'),
('11111111-1111-4111-8111-000000000012', 'seed.explore.12@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000012'),
('11111111-1111-4111-8111-000000000013', 'seed.explore.13@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000013'),
('11111111-1111-4111-8111-000000000014', 'seed.explore.14@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000014'),
('11111111-1111-4111-8111-000000000015', 'seed.explore.15@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000015'),
('11111111-1111-4111-8111-000000000016', 'seed.explore.16@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000016'),
('11111111-1111-4111-8111-000000000017', 'seed.explore.17@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000017'),
('11111111-1111-4111-8111-000000000018', 'seed.explore.18@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000018'),
('11111111-1111-4111-8111-000000000019', 'seed.explore.19@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000019'),
('11111111-1111-4111-8111-000000000020', 'seed.explore.20@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000020'),
('11111111-1111-4111-8111-000000000021', 'seed.explore.21@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000021'),
('11111111-1111-4111-8111-000000000022', 'seed.explore.22@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000022'),
('11111111-1111-4111-8111-000000000023', 'seed.explore.23@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000023'),
('11111111-1111-4111-8111-000000000024', 'seed.explore.24@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000024'),
('11111111-1111-4111-8111-000000000025', 'seed.explore.25@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000025'),
('11111111-1111-4111-8111-000000000026', 'seed.explore.26@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000026'),
('11111111-1111-4111-8111-000000000027', 'seed.explore.27@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000027'),
('11111111-1111-4111-8111-000000000028', 'seed.explore.28@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000028'),
('11111111-1111-4111-8111-000000000029', 'seed.explore.29@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000029'),
('11111111-1111-4111-8111-000000000030', 'seed.explore.30@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000030'),
('11111111-1111-4111-8111-000000000031', 'seed.explore.31@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000031'),
('11111111-1111-4111-8111-000000000032', 'seed.explore.32@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000032'),
('11111111-1111-4111-8111-000000000033', 'seed.explore.33@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000033'),
('11111111-1111-4111-8111-000000000034', 'seed.explore.34@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000034'),
('11111111-1111-4111-8111-000000000035', 'seed.explore.35@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000035'),
('11111111-1111-4111-8111-000000000036', 'seed.explore.36@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000036'),
('11111111-1111-4111-8111-000000000037', 'seed.explore.37@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000037'),
('11111111-1111-4111-8111-000000000038', 'seed.explore.38@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000038'),
('11111111-1111-4111-8111-000000000039', 'seed.explore.39@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000039'),
('11111111-1111-4111-8111-000000000040', 'seed.explore.40@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000040'),
('11111111-1111-4111-8111-000000000041', 'seed.explore.41@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000041'),
('11111111-1111-4111-8111-000000000042', 'seed.explore.42@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000042'),
('11111111-1111-4111-8111-000000000043', 'seed.explore.43@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000043'),
('11111111-1111-4111-8111-000000000044', 'seed.explore.44@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000044'),
('11111111-1111-4111-8111-000000000045', 'seed.explore.45@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000045'),
('11111111-1111-4111-8111-000000000046', 'seed.explore.46@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000046'),
('11111111-1111-4111-8111-000000000047', 'seed.explore.47@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000047'),
('11111111-1111-4111-8111-000000000048', 'seed.explore.48@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000048'),
('11111111-1111-4111-8111-000000000049', 'seed.explore.49@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000049'),
('11111111-1111-4111-8111-000000000050', 'seed.explore.50@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000050'),
('11111111-1111-4111-8111-000000000051', 'seed.explore.51@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000051'),
('11111111-1111-4111-8111-000000000052', 'seed.explore.52@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000052'),
('11111111-1111-4111-8111-000000000053', 'seed.explore.53@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000053'),
('11111111-1111-4111-8111-000000000054', 'seed.explore.54@dev.local', '$2b$10$S0UQcAzXnGHZaaAgtHRmqunq1X6azVUIPFTXkXc.chiLeJ0BaTfmS', '10000000054');

-- 3. Usuarios (perfis — inclui u10 para manter FK consistente com users)
INSERT INTO usuarios (user_id, nome, telefone, score, foto_url) VALUES
('11111111-1111-4111-8111-000000000001',  'João Silva',      '(11) 91111-1111', 95,  'https://ui-avatars.com/api/?name=Joao+Silva'),
('11111111-1111-4111-8111-000000000002',  'Maria Oliveira',  '(41) 92222-2222', 100, 'https://ui-avatars.com/api/?name=Maria+Oliveira'),
('11111111-1111-4111-8111-000000000003',  'Pedro Encanador', '(11) 93333-3333', 5,  'https://ui-avatars.com/api/?name=Pedro+Encanador'),
('11111111-1111-4111-8111-000000000004',  'Ana Limpezas',    '(11) 94444-4444', 4,  'https://ui-avatars.com/api/?name=Ana+Limpezas'),
('11111111-1111-4111-8111-000000000005',  'Carlos Elétrica', '(19) 95555-5555', 4,  'https://ui-avatars.com/api/?name=Carlos+Eletrica'),
('11111111-1111-4111-8111-000000000006',  'Fernanda Souza',  '(31) 96666-6666', 88,  'https://ui-avatars.com/api/?name=Fernanda+Souza'),
('11111111-1111-4111-8111-000000000007',  'Roberto Carlos',  '(21) 97777-7777', 92,  'https://ui-avatars.com/api/?name=Roberto+Carlos'),
('11111111-1111-4111-8111-000000000008',  'Lucas Tech',      '(16) 98888-8888', 4,  'https://ui-avatars.com/api/?name=Lucas+Tech'),
('11111111-1111-4111-8111-000000000009',  'Juliana Lima',    '(71) 99999-9999', 98,  'https://ui-avatars.com/api/?name=Juliana+Lima'),
('11111111-1111-4111-8111-000000000010', 'Admin Sistema',   NULL,              0,   NULL);


INSERT INTO usuarios (user_id, nome, telefone, score, foto_url) VALUES
('11111111-1111-4111-8111-000000000011', 'Rita Faxinas Pro', '(11) 91011-0011', 71, 'https://ui-avatars.com/api/?name=Rita%2BFaxinas%2BPro'),
('11111111-1111-4111-8111-000000000012', 'Bruno Limpeza Express', '(11) 91012-0012', 72, 'https://ui-avatars.com/api/?name=Bruno%2BLimpeza%2BExpress'),
('11111111-1111-4111-8111-000000000013', 'Camila Pós-Obra SP', '(11) 91013-0013', 73, 'https://ui-avatars.com/api/?name=Camila%2BP%C3%B3s-Obra%2BSP'),
('11111111-1111-4111-8111-000000000014', 'Diego Higienização', '(21) 91014-0014', 74, 'https://ui-avatars.com/api/?name=Diego%2BHigieniza%C3%A7%C3%A3o'),
('11111111-1111-4111-8111-000000000015', 'Elisangela Comercial', '(31) 91015-0015', 75, 'https://ui-avatars.com/api/?name=Elisangela%2BComercial'),
('11111111-1111-4111-8111-000000000016', 'Felipe Vidraçaria Limpa', '(41) 91016-0016', 76, 'https://ui-avatars.com/api/?name=Felipe%2BVidra%C3%A7aria%2BLimpa'),
('11111111-1111-4111-8111-000000000017', 'Gisele Residencial', '(51) 91017-0017', 77, 'https://ui-avatars.com/api/?name=Gisele%2BResidencial'),
('11111111-1111-4111-8111-000000000018', 'Henrique Instalações', '(19) 91018-0018', 78, 'https://ui-avatars.com/api/?name=Henrique%2BInstala%C3%A7%C3%B5es'),
('11111111-1111-4111-8111-000000000019', 'Igor Quadros Elétricos', '(19) 91019-0019', 79, 'https://ui-avatars.com/api/?name=Igor%2BQuadros%2BEl%C3%A9tricos'),
('11111111-1111-4111-8111-000000000020', 'Juliana Luminotécnica', '(11) 91020-0020', 80, 'https://ui-avatars.com/api/?name=Juliana%2BLuminot%C3%A9cnica'),
('11111111-1111-4111-8111-000000000021', 'Kleber Ar Condicionado', '(11) 91021-0021', 81, 'https://ui-avatars.com/api/?name=Kleber%2BAr%2BCondicionado'),
('11111111-1111-4111-8111-000000000022', 'Larissa Tomadas e DR', '(16) 91022-0022', 82, 'https://ui-avatars.com/api/?name=Larissa%2BTomadas%2Be%2BDR'),
('11111111-1111-4111-8111-000000000023', 'Marcos Gerador', '(11) 91023-0023', 83, 'https://ui-avatars.com/api/?name=Marcos%2BGerador'),
('11111111-1111-4111-8111-000000000024', 'Nadia Automação Residencial', '(48) 91024-0024', 84, 'https://ui-avatars.com/api/?name=Nadia%2BAutoma%C3%A7%C3%A3o%2BResidencial'),
('11111111-1111-4111-8111-000000000025', 'Otávio Desentupidor', '(11) 91025-0025', 85, 'https://ui-avatars.com/api/?name=Ot%C3%A1vio%2BDesentupidor'),
('11111111-1111-4111-8111-000000000026', 'Patrícia Hidráulica', '(11) 91026-0026', 86, 'https://ui-avatars.com/api/?name=Patr%C3%ADcia%2BHidr%C3%A1ulica'),
('11111111-1111-4111-8111-000000000027', 'Rafael Caixa d Água', '(19) 91027-0027', 87, 'https://ui-avatars.com/api/?name=Rafael%2BCaixa%2Bd%2B%C3%81gua'),
('11111111-1111-4111-8111-000000000028', 'Sandra Bombas', '(21) 91028-0028', 88, 'https://ui-avatars.com/api/?name=Sandra%2BBombas'),
('11111111-1111-4111-8111-000000000029', 'Thiago Aquecedor', '(11) 91029-0029', 89, 'https://ui-avatars.com/api/?name=Thiago%2BAquecedor'),
('11111111-1111-4111-8111-000000000030', 'Úrsula Gás e Água', '(31) 91030-0030', 90, 'https://ui-avatars.com/api/?name=%C3%9Arsula%2BG%C3%A1s%2Be%2B%C3%81gua'),
('11111111-1111-4111-8111-000000000031', 'Vitor Tubulações', '(85) 91031-0031', 91, 'https://ui-avatars.com/api/?name=Vitor%2BTubula%C3%A7%C3%B5es'),
('11111111-1111-4111-8111-000000000032', 'Wagner Matemática ENEM', '(11) 91032-0032', 92, 'https://ui-avatars.com/api/?name=Wagner%2BMatem%C3%A1tica%2BENEM'),
('11111111-1111-4111-8111-000000000033', 'Yara Inglês Online', '(11) 91033-0033', 93, 'https://ui-avatars.com/api/?name=Yara%2BIngl%C3%AAs%2BOnline'),
('11111111-1111-4111-8111-000000000034', 'Zeca Física Domiciliar', '(21) 91034-0034', 94, 'https://ui-avatars.com/api/?name=Zeca%2BF%C3%ADsica%2BDomiciliar'),
('11111111-1111-4111-8111-000000000035', 'Amanda Violão', '(31) 91035-0035', 95, 'https://ui-avatars.com/api/?name=Amanda%2BViol%C3%A3o'),
('11111111-1111-4111-8111-000000000036', 'Bernardo Programação', '(48) 91036-0036', 96, 'https://ui-avatars.com/api/?name=Bernardo%2BPrograma%C3%A7%C3%A3o'),
('11111111-1111-4111-8111-000000000037', 'Carla Redação', '(71) 91037-0037', 97, 'https://ui-avatars.com/api/?name=Carla%2BReda%C3%A7%C3%A3o'),
('11111111-1111-4111-8111-000000000038', 'Daniel Química', '(85) 91038-0038', 98, 'https://ui-avatars.com/api/?name=Daniel%2BQu%C3%ADmica'),
('11111111-1111-4111-8111-000000000039', 'Eduarda Espanhol', '(92) 91039-0039', 99, 'https://ui-avatars.com/api/?name=Eduarda%2BEspanhol'),
('11111111-1111-4111-8111-000000000040', 'Fabiana Manicure', '(11) 91040-0040', 60, 'https://ui-avatars.com/api/?name=Fabiana%2BManicure'),
('11111111-1111-4111-8111-000000000041', 'Gabriela Estética Facial', '(21) 91041-0041', 61, 'https://ui-avatars.com/api/?name=Gabriela%2BEst%C3%A9tica%2BFacial'),
('11111111-1111-4111-8111-000000000042', 'Helena Cabelo e Cor', '(31) 91042-0042', 62, 'https://ui-avatars.com/api/?name=Helena%2BCabelo%2Be%2BCor'),
('11111111-1111-4111-8111-000000000043', 'Isabela Depilação', '(41) 91043-0043', 63, 'https://ui-avatars.com/api/?name=Isabela%2BDepila%C3%A7%C3%A3o'),
('11111111-1111-4111-8111-000000000044', 'Júlia Maquiagem', '(51) 91044-0044', 64, 'https://ui-avatars.com/api/?name=J%C3%BAlia%2BMaquiagem'),
('11111111-1111-4111-8111-000000000045', 'Karina Massoterapia', '(61) 91045-0045', 65, 'https://ui-avatars.com/api/?name=Karina%2BMassoterapia'),
('11111111-1111-4111-8111-000000000046', 'Letícia Sobrancelhas', '(71) 91046-0046', 66, 'https://ui-avatars.com/api/?name=Let%C3%ADcia%2BSobrancelhas'),
('11111111-1111-4111-8111-000000000047', 'Marina Spa Day', '(81) 91047-0047', 67, 'https://ui-avatars.com/api/?name=Marina%2BSpa%2BDay'),
('11111111-1111-4111-8111-000000000048', 'Nicolas Help Desk', '(16) 91048-0048', 68, 'https://ui-avatars.com/api/?name=Nicolas%2BHelp%2BDesk'),
('11111111-1111-4111-8111-000000000049', 'Olivia Cloud AWS', '(11) 91049-0049', 69, 'https://ui-avatars.com/api/?name=Olivia%2BCloud%2BAWS'),
('11111111-1111-4111-8111-000000000050', 'Paulo Infraestrutura', '(21) 91050-0050', 70, 'https://ui-avatars.com/api/?name=Paulo%2BInfraestrutura'),
('11111111-1111-4111-8111-000000000051', 'Queila DevOps', '(31) 91051-0051', 71, 'https://ui-avatars.com/api/?name=Queila%2BDevOps'),
('11111111-1111-4111-8111-000000000052', 'Ricardo Segurança TI', '(48) 91052-0052', 72, 'https://ui-avatars.com/api/?name=Ricardo%2BSeguran%C3%A7a%2BTI'),
('11111111-1111-4111-8111-000000000053', 'Sabrina Dados', '(85) 91053-0053', 73, 'https://ui-avatars.com/api/?name=Sabrina%2BDados'),
('11111111-1111-4111-8111-000000000054', 'Tatiana Suporte Apple', '(11) 91054-0054', 74, 'https://ui-avatars.com/api/?name=Tatiana%2BSuporte%2BApple');

-- 4. Prestadores
INSERT INTO prestadores (user_id, nome, bio, score, foto_url, status_verificacao) VALUES
('11111111-1111-4111-8111-000000000003', 'Pedro Encanador', 'Especialista em encanamentos e vazamentos com 10 anos de experiência.', 4, 'https://ui-avatars.com/api/?name=Pedro+Encanador', 'aprovado'),
('11111111-1111-4111-8111-000000000004', 'Ana Limpezas',    'Limpeza residencial e comercial pós-obra. Detalhista e ágil.',          5, 'https://ui-avatars.com/api/?name=Ana+Limpezas',    'aprovado'),
('11111111-1111-4111-8111-000000000005', 'Carlos Elétrica', 'Eletricista certificado. Instalações e manutenção de ar-condicionado.', 4, 'https://ui-avatars.com/api/?name=Carlos+Eletrica',  'aprovado'),
('11111111-1111-4111-8111-000000000008', 'Lucas Tech',      'Suporte técnico, formatação de computadores e configuração de redes.',  4, 'https://ui-avatars.com/api/?name=Lucas+Tech',       'pendente');


INSERT INTO prestadores (user_id, nome, bio, score, foto_url, status_verificacao) VALUES
('11111111-1111-4111-8111-000000000011', 'Rita Faxinas Pro', 'Limpeza residencial e comercial; materiais inclusos sob consulta.', 5, 'https://ui-avatars.com/api/?name=Rita%2BFaxinas%2BPro', 'aprovado'),
('11111111-1111-4111-8111-000000000012', 'Bruno Limpeza Express', 'Limpeza residencial e comercial; materiais inclusos sob consulta.', 3, 'https://ui-avatars.com/api/?name=Bruno%2BLimpeza%2BExpress', 'aprovado'),
('11111111-1111-4111-8111-000000000013', 'Camila Pós-Obra SP', 'Limpeza residencial e comercial; materiais inclusos sob consulta.', 4, 'https://ui-avatars.com/api/?name=Camila%2BP%C3%B3s-Obra%2BSP', 'aprovado'),
('11111111-1111-4111-8111-000000000014', 'Diego Higienização', 'Limpeza residencial e comercial; materiais inclusos sob consulta.', 5, 'https://ui-avatars.com/api/?name=Diego%2BHigieniza%C3%A7%C3%A3o', 'aprovado'),
('11111111-1111-4111-8111-000000000015', 'Elisangela Comercial', 'Limpeza residencial e comercial; materiais inclusos sob consulta.', 3, 'https://ui-avatars.com/api/?name=Elisangela%2BComercial', 'aprovado'),
('11111111-1111-4111-8111-000000000016', 'Felipe Vidraçaria Limpa', 'Limpeza residencial e comercial; materiais inclusos sob consulta.', 4, 'https://ui-avatars.com/api/?name=Felipe%2BVidra%C3%A7aria%2BLimpa', 'aprovado'),
('11111111-1111-4111-8111-000000000017', 'Gisele Residencial', 'Limpeza residencial e comercial; materiais inclusos sob consulta.', 5, 'https://ui-avatars.com/api/?name=Gisele%2BResidencial', 'aprovado'),
('11111111-1111-4111-8111-000000000018', 'Henrique Instalações', 'Eletricista registrado; NR-10 e instalações conforme norma.', 3, 'https://ui-avatars.com/api/?name=Henrique%2BInstala%C3%A7%C3%B5es', 'aprovado'),
('11111111-1111-4111-8111-000000000019', 'Igor Quadros Elétricos', 'Eletricista registrado; NR-10 e instalações conforme norma.', 4, 'https://ui-avatars.com/api/?name=Igor%2BQuadros%2BEl%C3%A9tricos', 'aprovado'),
('11111111-1111-4111-8111-000000000020', 'Juliana Luminotécnica', 'Eletricista registrado; NR-10 e instalações conforme norma.', 5, 'https://ui-avatars.com/api/?name=Juliana%2BLuminot%C3%A9cnica', 'aprovado'),
('11111111-1111-4111-8111-000000000021', 'Kleber Ar Condicionado', 'Eletricista registrado; NR-10 e instalações conforme norma.', 3, 'https://ui-avatars.com/api/?name=Kleber%2BAr%2BCondicionado', 'aprovado'),
('11111111-1111-4111-8111-000000000022', 'Larissa Tomadas e DR', 'Eletricista registrado; NR-10 e instalações conforme norma.', 4, 'https://ui-avatars.com/api/?name=Larissa%2BTomadas%2Be%2BDR', 'aprovado'),
('11111111-1111-4111-8111-000000000023', 'Marcos Gerador', 'Eletricista registrado; NR-10 e instalações conforme norma.', 5, 'https://ui-avatars.com/api/?name=Marcos%2BGerador', 'aprovado'),
('11111111-1111-4111-8111-000000000024', 'Nadia Automação Residencial', 'Eletricista registrado; NR-10 e instalações conforme norma.', 3, 'https://ui-avatars.com/api/?name=Nadia%2BAutoma%C3%A7%C3%A3o%2BResidencial', 'aprovado'),
('11111111-1111-4111-8111-000000000025', 'Otávio Desentupidor', 'Encanador hidráulico; emergências e manutenção preventiva.', 4, 'https://ui-avatars.com/api/?name=Ot%C3%A1vio%2BDesentupidor', 'aprovado'),
('11111111-1111-4111-8111-000000000026', 'Patrícia Hidráulica', 'Encanador hidráulico; emergências e manutenção preventiva.', 5, 'https://ui-avatars.com/api/?name=Patr%C3%ADcia%2BHidr%C3%A1ulica', 'aprovado'),
('11111111-1111-4111-8111-000000000027', 'Rafael Caixa d Água', 'Encanador hidráulico; emergências e manutenção preventiva.', 3, 'https://ui-avatars.com/api/?name=Rafael%2BCaixa%2Bd%2B%C3%81gua', 'aprovado'),
('11111111-1111-4111-8111-000000000028', 'Sandra Bombas', 'Encanador hidráulico; emergências e manutenção preventiva.', 4, 'https://ui-avatars.com/api/?name=Sandra%2BBombas', 'aprovado'),
('11111111-1111-4111-8111-000000000029', 'Thiago Aquecedor', 'Encanador hidráulico; emergências e manutenção preventiva.', 5, 'https://ui-avatars.com/api/?name=Thiago%2BAquecedor', 'aprovado'),
('11111111-1111-4111-8111-000000000030', 'Úrsula Gás e Água', 'Encanador hidráulico; emergências e manutenção preventiva.', 3, 'https://ui-avatars.com/api/?name=%C3%9Arsula%2BG%C3%A1s%2Be%2B%C3%81gua', 'aprovado'),
('11111111-1111-4111-8111-000000000031', 'Vitor Tubulações', 'Encanador hidráulico; emergências e manutenção preventiva.', 4, 'https://ui-avatars.com/api/?name=Vitor%2BTubula%C3%A7%C3%B5es', 'aprovado'),
('11111111-1111-4111-8111-000000000032', 'Wagner Matemática ENEM', 'Aulas particulares presenciais ou online; material de apoio.', 5, 'https://ui-avatars.com/api/?name=Wagner%2BMatem%C3%A1tica%2BENEM', 'aprovado'),
('11111111-1111-4111-8111-000000000033', 'Yara Inglês Online', 'Aulas particulares presenciais ou online; material de apoio.', 3, 'https://ui-avatars.com/api/?name=Yara%2BIngl%C3%AAs%2BOnline', 'aprovado'),
('11111111-1111-4111-8111-000000000034', 'Zeca Física Domiciliar', 'Aulas particulares presenciais ou online; material de apoio.', 4, 'https://ui-avatars.com/api/?name=Zeca%2BF%C3%ADsica%2BDomiciliar', 'aprovado'),
('11111111-1111-4111-8111-000000000035', 'Amanda Violão', 'Aulas particulares presenciais ou online; material de apoio.', 5, 'https://ui-avatars.com/api/?name=Amanda%2BViol%C3%A3o', 'aprovado'),
('11111111-1111-4111-8111-000000000036', 'Bernardo Programação', 'Aulas particulares presenciais ou online; material de apoio.', 3, 'https://ui-avatars.com/api/?name=Bernardo%2BPrograma%C3%A7%C3%A3o', 'aprovado'),
('11111111-1111-4111-8111-000000000037', 'Carla Redação', 'Aulas particulares presenciais ou online; material de apoio.', 4, 'https://ui-avatars.com/api/?name=Carla%2BReda%C3%A7%C3%A3o', 'aprovado'),
('11111111-1111-4111-8111-000000000038', 'Daniel Química', 'Aulas particulares presenciais ou online; material de apoio.', 5, 'https://ui-avatars.com/api/?name=Daniel%2BQu%C3%ADmica', 'aprovado'),
('11111111-1111-4111-8111-000000000039', 'Eduarda Espanhol', 'Aulas particulares presenciais ou online; material de apoio.', 3, 'https://ui-avatars.com/api/?name=Eduarda%2BEspanhol', 'aprovado'),
('11111111-1111-4111-8111-000000000040', 'Fabiana Manicure', 'Beleza e bem-estar; atendimento com hora marcada.', 4, 'https://ui-avatars.com/api/?name=Fabiana%2BManicure', 'aprovado'),
('11111111-1111-4111-8111-000000000041', 'Gabriela Estética Facial', 'Beleza e bem-estar; atendimento com hora marcada.', 5, 'https://ui-avatars.com/api/?name=Gabriela%2BEst%C3%A9tica%2BFacial', 'aprovado'),
('11111111-1111-4111-8111-000000000042', 'Helena Cabelo e Cor', 'Beleza e bem-estar; atendimento com hora marcada.', 3, 'https://ui-avatars.com/api/?name=Helena%2BCabelo%2Be%2BCor', 'aprovado'),
('11111111-1111-4111-8111-000000000043', 'Isabela Depilação', 'Beleza e bem-estar; atendimento com hora marcada.', 4, 'https://ui-avatars.com/api/?name=Isabela%2BDepila%C3%A7%C3%A3o', 'aprovado'),
('11111111-1111-4111-8111-000000000044', 'Júlia Maquiagem', 'Beleza e bem-estar; atendimento com hora marcada.', 5, 'https://ui-avatars.com/api/?name=J%C3%BAlia%2BMaquiagem', 'aprovado'),
('11111111-1111-4111-8111-000000000045', 'Karina Massoterapia', 'Beleza e bem-estar; atendimento com hora marcada.', 3, 'https://ui-avatars.com/api/?name=Karina%2BMassoterapia', 'aprovado'),
('11111111-1111-4111-8111-000000000046', 'Letícia Sobrancelhas', 'Beleza e bem-estar; atendimento com hora marcada.', 4, 'https://ui-avatars.com/api/?name=Let%C3%ADcia%2BSobrancelhas', 'aprovado'),
('11111111-1111-4111-8111-000000000047', 'Marina Spa Day', 'Beleza e bem-estar; atendimento com hora marcada.', 5, 'https://ui-avatars.com/api/?name=Marina%2BSpa%2BDay', 'aprovado'),
('11111111-1111-4111-8111-000000000048', 'Nicolas Help Desk', 'TI e suporte; diagnóstico remoto e visitas técnicas.', 3, 'https://ui-avatars.com/api/?name=Nicolas%2BHelp%2BDesk', 'aprovado'),
('11111111-1111-4111-8111-000000000049', 'Olivia Cloud AWS', 'TI e suporte; diagnóstico remoto e visitas técnicas.', 4, 'https://ui-avatars.com/api/?name=Olivia%2BCloud%2BAWS', 'aprovado'),
('11111111-1111-4111-8111-000000000050', 'Paulo Infraestrutura', 'TI e suporte; diagnóstico remoto e visitas técnicas.', 5, 'https://ui-avatars.com/api/?name=Paulo%2BInfraestrutura', 'aprovado'),
('11111111-1111-4111-8111-000000000051', 'Queila DevOps', 'TI e suporte; diagnóstico remoto e visitas técnicas.', 3, 'https://ui-avatars.com/api/?name=Queila%2BDevOps', 'aprovado'),
('11111111-1111-4111-8111-000000000052', 'Ricardo Segurança TI', 'TI e suporte; diagnóstico remoto e visitas técnicas.', 4, 'https://ui-avatars.com/api/?name=Ricardo%2BSeguran%C3%A7a%2BTI', 'aprovado'),
('11111111-1111-4111-8111-000000000053', 'Sabrina Dados', 'TI e suporte; diagnóstico remoto e visitas técnicas.', 5, 'https://ui-avatars.com/api/?name=Sabrina%2BDados', 'aprovado'),
('11111111-1111-4111-8111-000000000054', 'Tatiana Suporte Apple', 'TI e suporte; diagnóstico remoto e visitas técnicas.', 3, 'https://ui-avatars.com/api/?name=Tatiana%2BSuporte%2BApple', 'aprovado');

-- 5. Endereços (CEPs reais de cidades brasileiras para testar distância)
INSERT INTO enderecos (id, user_id, rotulo, logradouro, numero, bairro, cidade, estado, cep, is_principal) VALUES
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000001', 'Casa',      'Rua das Flores',  '123', 'Jardim América',  'São Paulo',       'SP', '01310100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000002', 'Casa',      'Rua XV de Nov.',  '50',  'Centro',           'Curitiba',        'PR', '80020310', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000006', 'Casa',      'Rua Bahia',       '45',  'Funcionários',     'Belo Horizonte',  'MG', '30130110', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000007', 'Casa',      'Av. Atlântica',   '200', 'Copacabana',       'Rio de Janeiro',  'RJ', '22010010', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000009', 'Casa',      'Rua da Palma',    '10',  'Centro',           'Salvador',        'BA', '40020010', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000003', 'Escritório','Rua Augusta',     '900', 'Consolação',       'São Paulo',       'SP', '01305100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000004', 'Escritório','Av. Rebouças',    '600', 'Pinheiros',        'São Paulo',       'SP', '05401300', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000005', 'Escritório','Rua Marechal',    '300', 'Centro',           'Campinas',        'SP', '13013001', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000008', 'Escritório','Rua José Boni',   '77',  'Centro',           'São Carlos',      'SP', '13560047', TRUE);

INSERT INTO enderecos (id, user_id, rotulo, logradouro, numero, bairro, cidade, estado, cep, is_principal) VALUES
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000011', 'Atendimento', 'Rua Barata Ribeiro', '300', 'Centro', 'Rio de Janeiro', 'RJ', '22041001', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000012', 'Atendimento', 'Av. Afonso Pena', '500', 'Centro', 'Belo Horizonte', 'MG', '30130100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000013', 'Atendimento', 'Rua Marechal Deodoro', '88', 'Centro', 'Curitiba', 'PR', '80010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000014', 'Atendimento', 'Av. Borges de Medeiros', '1500', 'Centro', 'Porto Alegre', 'RS', '90010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000015', 'Atendimento', 'Av. Sete de Setembro', '200', 'Centro', 'Salvador', 'BA', '40026010', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000016', 'Atendimento', 'Rua Oscar Freire', '100', 'Centro', 'São Paulo', 'SP', '01310100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000017', 'Atendimento', 'Rua Harmonia', '250', 'Centro', 'São Paulo', 'SP', '05407002', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000018', 'Atendimento', 'Av. Brasil', '1200', 'Centro', 'Campinas', 'SP', '13024070', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000019', 'Atendimento', 'Rua Barata Ribeiro', '300', 'Centro', 'Rio de Janeiro', 'RJ', '22041001', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000020', 'Atendimento', 'Av. Afonso Pena', '500', 'Centro', 'Belo Horizonte', 'MG', '30130100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000021', 'Atendimento', 'Rua Marechal Deodoro', '88', 'Centro', 'Curitiba', 'PR', '80010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000022', 'Atendimento', 'Av. Borges de Medeiros', '1500', 'Centro', 'Porto Alegre', 'RS', '90010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000023', 'Atendimento', 'Av. Sete de Setembro', '200', 'Centro', 'Salvador', 'BA', '40026010', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000024', 'Atendimento', 'Rua Oscar Freire', '100', 'Centro', 'São Paulo', 'SP', '01310100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000025', 'Atendimento', 'Rua Harmonia', '250', 'Centro', 'São Paulo', 'SP', '05407002', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000026', 'Atendimento', 'Av. Brasil', '1200', 'Centro', 'Campinas', 'SP', '13024070', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000027', 'Atendimento', 'Rua Barata Ribeiro', '300', 'Centro', 'Rio de Janeiro', 'RJ', '22041001', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000028', 'Atendimento', 'Av. Afonso Pena', '500', 'Centro', 'Belo Horizonte', 'MG', '30130100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000029', 'Atendimento', 'Rua Marechal Deodoro', '88', 'Centro', 'Curitiba', 'PR', '80010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000030', 'Atendimento', 'Av. Borges de Medeiros', '1500', 'Centro', 'Porto Alegre', 'RS', '90010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000031', 'Atendimento', 'Av. Sete de Setembro', '200', 'Centro', 'Salvador', 'BA', '40026010', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000032', 'Atendimento', 'Rua Oscar Freire', '100', 'Centro', 'São Paulo', 'SP', '01310100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000033', 'Atendimento', 'Rua Harmonia', '250', 'Centro', 'São Paulo', 'SP', '05407002', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000034', 'Atendimento', 'Av. Brasil', '1200', 'Centro', 'Campinas', 'SP', '13024070', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000035', 'Atendimento', 'Rua Barata Ribeiro', '300', 'Centro', 'Rio de Janeiro', 'RJ', '22041001', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000036', 'Atendimento', 'Av. Afonso Pena', '500', 'Centro', 'Belo Horizonte', 'MG', '30130100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000037', 'Atendimento', 'Rua Marechal Deodoro', '88', 'Centro', 'Curitiba', 'PR', '80010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000038', 'Atendimento', 'Av. Borges de Medeiros', '1500', 'Centro', 'Porto Alegre', 'RS', '90010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000039', 'Atendimento', 'Av. Sete de Setembro', '200', 'Centro', 'Salvador', 'BA', '40026010', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000040', 'Atendimento', 'Rua Oscar Freire', '100', 'Centro', 'São Paulo', 'SP', '01310100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000041', 'Atendimento', 'Rua Harmonia', '250', 'Centro', 'São Paulo', 'SP', '05407002', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000042', 'Atendimento', 'Av. Brasil', '1200', 'Centro', 'Campinas', 'SP', '13024070', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000043', 'Atendimento', 'Rua Barata Ribeiro', '300', 'Centro', 'Rio de Janeiro', 'RJ', '22041001', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000044', 'Atendimento', 'Av. Afonso Pena', '500', 'Centro', 'Belo Horizonte', 'MG', '30130100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000045', 'Atendimento', 'Rua Marechal Deodoro', '88', 'Centro', 'Curitiba', 'PR', '80010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000046', 'Atendimento', 'Av. Borges de Medeiros', '1500', 'Centro', 'Porto Alegre', 'RS', '90010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000047', 'Atendimento', 'Av. Sete de Setembro', '200', 'Centro', 'Salvador', 'BA', '40026010', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000048', 'Atendimento', 'Rua Oscar Freire', '100', 'Centro', 'São Paulo', 'SP', '01310100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000049', 'Atendimento', 'Rua Harmonia', '250', 'Centro', 'São Paulo', 'SP', '05407002', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000050', 'Atendimento', 'Av. Brasil', '1200', 'Centro', 'Campinas', 'SP', '13024070', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000051', 'Atendimento', 'Rua Barata Ribeiro', '300', 'Centro', 'Rio de Janeiro', 'RJ', '22041001', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000052', 'Atendimento', 'Av. Afonso Pena', '500', 'Centro', 'Belo Horizonte', 'MG', '30130100', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000053', 'Atendimento', 'Rua Marechal Deodoro', '88', 'Centro', 'Curitiba', 'PR', '80010000', TRUE),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000054', 'Atendimento', 'Av. Borges de Medeiros', '1500', 'Centro', 'Porto Alegre', 'RS', '90010000', TRUE);


-- 6. Serviços (status: criado = pedidos em aberto; finalizado = histórico pago)
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao, preco_acordado, data_inicio, duracao, status) VALUES
('33333333-3333-4333-8333-000000000001', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003', 'Conserto de Vazamento',         'Reparo em cano com vazamento na cozinha.',            150.00, NOW() + INTERVAL '2 days',  '2h',   'criado'),
('33333333-3333-4333-8333-000000000002', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000001', 'Limpeza Residencial Completa',  'Limpeza de 3 cômodos com produtos inclusos.',         200.00, NOW() + INTERVAL '3 days',  '4h',   'criado'),
('33333333-3333-4333-8333-000000000003', '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000005', '22222222-2222-4222-8222-000000000002', 'Instalação de Tomadas',         'Instalação de 5 tomadas com aterramento.',            120.00, NOW() + INTERVAL '1 day',   '3h',   'criado'),
('33333333-3333-4333-8333-000000000004', '11111111-1111-4111-8111-000000000007', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Formatação e Configuração',     'Formatação de notebook com instalação de programas.',  90.00, NOW() + INTERVAL '5 days',  '2h',   'criado'),
('33333333-3333-4333-8333-000000000005', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000001', 'Limpeza Pós-Obra',              'Limpeza pesada após reforma no banheiro.',            350.00, NOW() + INTERVAL '7 days',  '6h',   'criado'),
('33333333-3333-4333-8333-000000000006', '11111111-1111-4111-8111-000000000009', '11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003', 'Desentupimento',                'Desentupimento de pia e ralo.',                        80.00, NOW() + INTERVAL '1 day',   '1h',   'criado');

-- 7. Carteiras
INSERT INTO carteiras (user_id, prestador_id, saldo, status) VALUES
('11111111-1111-4111-8111-000000000001', NULL,  '500.00',  'ativa'),
('11111111-1111-4111-8111-000000000002', NULL,  '1250.50', 'ativa'),
('11111111-1111-4111-8111-000000000006', NULL,  '300.00',  'ativa'),
('11111111-1111-4111-8111-000000000007', NULL,  '750.00',  'ativa'),
('11111111-1111-4111-8111-000000000009', NULL,  '180.00',  'ativa'),
(NULL, '11111111-1111-4111-8111-000000000003',  '1500.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000004',  '3200.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000005',  '450.00',  'ativa'),
(NULL, '11111111-1111-4111-8111-000000000008',  '920.00',  'ativa');


INSERT INTO carteiras (user_id, prestador_id, saldo, status) VALUES
(NULL, '11111111-1111-4111-8111-000000000011', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000012', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000013', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000014', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000015', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000016', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000017', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000018', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000019', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000020', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000021', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000022', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000023', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000024', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000025', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000026', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000027', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000028', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000029', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000030', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000031', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000032', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000033', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000034', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000035', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000036', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000037', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000038', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000039', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000040', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000041', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000042', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000043', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000044', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000045', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000046', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000047', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000048', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000049', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000050', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000051', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000052', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000053', '100.00', 'ativa'),
(NULL, '11111111-1111-4111-8111-000000000054', '100.00', 'ativa');

-- 8. Agendamentos
INSERT INTO agendamentos (id, user_id, prestador_id, dia_semana, hora_inicio, hora_fim) VALUES
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000003', 'Segunda-feira', '09:00', '11:00'),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000004', 'Quarta-feira',  '14:00', '18:00'),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000005', 'Sábado',        '08:00', '12:00'),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000007', '11111111-1111-4111-8111-000000000008', 'Sexta-feira',   '10:00', '12:00'),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000009', '11111111-1111-4111-8111-000000000003', 'Terça-feira',   '07:00', '09:00');

-- 9. Notificações
INSERT INTO notificacoes (id, usuario_id, titulo, mensagem, tipo) VALUES
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000001', 'Serviço Agendado',   'Conserto de vazamento confirmado para segunda.',    'info'),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000002', 'Limpeza Confirmada', 'Sua limpeza residencial está agendada.',            'sucesso'),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000006', 'Novo Prestador',     'Carlos Elétrica aceitou seu pedido.',               'info'),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000007', 'Serviço Concluído',  'Formatação finalizada com sucesso.',                'sucesso');

-- 10. Mensagens
INSERT INTO mensagens (id, servico_id, remetente_id, conteudo, tipo_midia) VALUES
(gen_random_uuid()::text, '33333333-3333-4333-8333-000000000001', '11111111-1111-4111-8111-000000000001', 'Olá, qual horário está disponível?',       'texto'),
(gen_random_uuid()::text, '33333333-3333-4333-8333-000000000001', '11111111-1111-4111-8111-000000000003', 'Posso ir segunda às 9h!',                  'texto'),
(gen_random_uuid()::text, '33333333-3333-4333-8333-000000000002', '11111111-1111-4111-8111-000000000002', 'Preciso de limpeza pesada, tem disponível?','texto'),
(gen_random_uuid()::text, '33333333-3333-4333-8333-000000000002', '11111111-1111-4111-8111-000000000004', 'Sim! Posso ir na quarta às 14h.',           'texto');

-- 11. Prestador <-> Categorias (~8 prestadores por categoria para /explore)
INSERT INTO prestador_categorias (prestador_id, categoria_id) VALUES
('11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000001'),
('11111111-1111-4111-8111-000000000011', '22222222-2222-4222-8222-000000000001'),
('11111111-1111-4111-8111-000000000012', '22222222-2222-4222-8222-000000000001'),
('11111111-1111-4111-8111-000000000013', '22222222-2222-4222-8222-000000000001'),
('11111111-1111-4111-8111-000000000014', '22222222-2222-4222-8222-000000000001'),
('11111111-1111-4111-8111-000000000015', '22222222-2222-4222-8222-000000000001'),
('11111111-1111-4111-8111-000000000016', '22222222-2222-4222-8222-000000000001'),
('11111111-1111-4111-8111-000000000017', '22222222-2222-4222-8222-000000000001'),
('11111111-1111-4111-8111-000000000005', '22222222-2222-4222-8222-000000000002'),
('11111111-1111-4111-8111-000000000018', '22222222-2222-4222-8222-000000000002'),
('11111111-1111-4111-8111-000000000019', '22222222-2222-4222-8222-000000000002'),
('11111111-1111-4111-8111-000000000020', '22222222-2222-4222-8222-000000000002'),
('11111111-1111-4111-8111-000000000021', '22222222-2222-4222-8222-000000000002'),
('11111111-1111-4111-8111-000000000022', '22222222-2222-4222-8222-000000000002'),
('11111111-1111-4111-8111-000000000023', '22222222-2222-4222-8222-000000000002'),
('11111111-1111-4111-8111-000000000024', '22222222-2222-4222-8222-000000000002'),
('11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003'),
('11111111-1111-4111-8111-000000000025', '22222222-2222-4222-8222-000000000003'),
('11111111-1111-4111-8111-000000000026', '22222222-2222-4222-8222-000000000003'),
('11111111-1111-4111-8111-000000000027', '22222222-2222-4222-8222-000000000003'),
('11111111-1111-4111-8111-000000000028', '22222222-2222-4222-8222-000000000003'),
('11111111-1111-4111-8111-000000000029', '22222222-2222-4222-8222-000000000003'),
('11111111-1111-4111-8111-000000000030', '22222222-2222-4222-8222-000000000003'),
('11111111-1111-4111-8111-000000000031', '22222222-2222-4222-8222-000000000003'),
('11111111-1111-4111-8111-000000000032', '22222222-2222-4222-8222-000000000004'),
('11111111-1111-4111-8111-000000000033', '22222222-2222-4222-8222-000000000004'),
('11111111-1111-4111-8111-000000000034', '22222222-2222-4222-8222-000000000004'),
('11111111-1111-4111-8111-000000000035', '22222222-2222-4222-8222-000000000004'),
('11111111-1111-4111-8111-000000000036', '22222222-2222-4222-8222-000000000004'),
('11111111-1111-4111-8111-000000000037', '22222222-2222-4222-8222-000000000004'),
('11111111-1111-4111-8111-000000000038', '22222222-2222-4222-8222-000000000004'),
('11111111-1111-4111-8111-000000000039', '22222222-2222-4222-8222-000000000004'),
('11111111-1111-4111-8111-000000000040', '22222222-2222-4222-8222-000000000005'),
('11111111-1111-4111-8111-000000000041', '22222222-2222-4222-8222-000000000005'),
('11111111-1111-4111-8111-000000000042', '22222222-2222-4222-8222-000000000005'),
('11111111-1111-4111-8111-000000000043', '22222222-2222-4222-8222-000000000005'),
('11111111-1111-4111-8111-000000000044', '22222222-2222-4222-8222-000000000005'),
('11111111-1111-4111-8111-000000000045', '22222222-2222-4222-8222-000000000005'),
('11111111-1111-4111-8111-000000000046', '22222222-2222-4222-8222-000000000005'),
('11111111-1111-4111-8111-000000000047', '22222222-2222-4222-8222-000000000005'),
('11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006'),
('11111111-1111-4111-8111-000000000048', '22222222-2222-4222-8222-000000000006'),
('11111111-1111-4111-8111-000000000049', '22222222-2222-4222-8222-000000000006'),
('11111111-1111-4111-8111-000000000050', '22222222-2222-4222-8222-000000000006'),
('11111111-1111-4111-8111-000000000051', '22222222-2222-4222-8222-000000000006'),
('11111111-1111-4111-8111-000000000052', '22222222-2222-4222-8222-000000000006'),
('11111111-1111-4111-8111-000000000053', '22222222-2222-4222-8222-000000000006'),
('11111111-1111-4111-8111-000000000054', '22222222-2222-4222-8222-000000000006');

-- 12. Itens de portfólio (aparecem nos cards do /explore e em /portifolio)
INSERT INTO portfolio_items (id, prestador_id, url, tipo, descricao, ordem) VALUES
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000003', 'https://picsum.photos/seed/pedro1/600/400', 'imagem', 'Troca de tubulação', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000003', 'https://picsum.photos/seed/pedro2/600/400', 'imagem', 'Reparo de vazamento', 1),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000004', 'https://picsum.photos/seed/ana1/600/400',   'imagem', 'Limpeza pós-obra',    0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000004', 'https://picsum.photos/seed/ana2/600/400',   'imagem', 'Cozinha higienizada', 1),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000005', 'https://picsum.photos/seed/carlos1/600/400','imagem', 'Quadro elétrico novo', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000008', 'https://picsum.photos/seed/lucas1/600/400', 'imagem', 'Setup montado',        0);

INSERT INTO portfolio_items (id, prestador_id, url, tipo, descricao, ordem) VALUES
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000011', 'https://picsum.photos/seed/explore11/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000012', 'https://picsum.photos/seed/explore12/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000013', 'https://picsum.photos/seed/explore13/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000014', 'https://picsum.photos/seed/explore14/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000015', 'https://picsum.photos/seed/explore15/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000016', 'https://picsum.photos/seed/explore16/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000017', 'https://picsum.photos/seed/explore17/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000018', 'https://picsum.photos/seed/explore18/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000019', 'https://picsum.photos/seed/explore19/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000020', 'https://picsum.photos/seed/explore20/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000021', 'https://picsum.photos/seed/explore21/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000022', 'https://picsum.photos/seed/explore22/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000023', 'https://picsum.photos/seed/explore23/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000024', 'https://picsum.photos/seed/explore24/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000025', 'https://picsum.photos/seed/explore25/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000026', 'https://picsum.photos/seed/explore26/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000027', 'https://picsum.photos/seed/explore27/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000028', 'https://picsum.photos/seed/explore28/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000029', 'https://picsum.photos/seed/explore29/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000030', 'https://picsum.photos/seed/explore30/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000031', 'https://picsum.photos/seed/explore31/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000032', 'https://picsum.photos/seed/explore32/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000033', 'https://picsum.photos/seed/explore33/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000034', 'https://picsum.photos/seed/explore34/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000035', 'https://picsum.photos/seed/explore35/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000036', 'https://picsum.photos/seed/explore36/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000037', 'https://picsum.photos/seed/explore37/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000038', 'https://picsum.photos/seed/explore38/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000039', 'https://picsum.photos/seed/explore39/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000040', 'https://picsum.photos/seed/explore40/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000041', 'https://picsum.photos/seed/explore41/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000042', 'https://picsum.photos/seed/explore42/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000043', 'https://picsum.photos/seed/explore43/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000044', 'https://picsum.photos/seed/explore44/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000045', 'https://picsum.photos/seed/explore45/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000046', 'https://picsum.photos/seed/explore46/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000047', 'https://picsum.photos/seed/explore47/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000048', 'https://picsum.photos/seed/explore48/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000049', 'https://picsum.photos/seed/explore49/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000050', 'https://picsum.photos/seed/explore50/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000051', 'https://picsum.photos/seed/explore51/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000052', 'https://picsum.photos/seed/explore52/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000053', 'https://picsum.photos/seed/explore53/600/400', 'imagem', 'Trabalho recente', 0),
(gen_random_uuid()::text, '11111111-1111-4111-8111-000000000054', 'https://picsum.photos/seed/explore54/600/400', 'imagem', 'Trabalho recente', 0);

-- ============================================================
-- 13. Serviços concluídos (Lucas u8) — base das transações tx1–tx5
-- ============================================================
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao, preco_acordado, data_inicio, duracao, status, nota_prestador) VALUES
('33333333-3333-4333-8333-000000000007',  '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Suporte em Notebook',        'Diagnóstico e reparo de notebook com superaquecimento.',     120.00, NOW() - INTERVAL '30 days', '2h', 'finalizado', 5.0),
('33333333-3333-4333-8333-000000000008',  '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Configuração de Rede Wi-Fi', 'Configuração de roteador e extensores para cobertura total.', 200.00, NOW() - INTERVAL '22 days', '3h', 'finalizado', 4.5),
('33333333-3333-4333-8333-000000000009',  '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Limpeza e Manutenção de PC', 'Limpeza interna, troca de pasta térmica e otimização.',       150.00, NOW() - INTERVAL '15 days', '2h', 'finalizado', 5.0),
('33333333-3333-4333-8333-000000000010', '11111111-1111-4111-8111-000000000009', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Recuperação de Dados',       'Recuperação de arquivos de HD com falha mecânica.',           350.00, NOW() - INTERVAL '8 days',  '4h', 'finalizado', 4.8),
('33333333-3333-4333-8333-000000000011', '11111111-1111-4111-8111-000000000007', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Formatação de PC',           'Formatação completa com instalação de Windows e drivers.',     90.00, NOW() - INTERVAL '3 days',  '2h', 'finalizado', 5.0);

-- ============================================================
-- 13b. Mais serviços finalizados (Lucas u8) — uma transação por serviço
-- ============================================================
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao, preco_acordado, data_inicio, duracao, status, nota_prestador) VALUES
('33333333-3333-4333-8333-000000000012', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Upgrade SSD e RAM',              'Instalação de SSD NVMe e expansão de memória.',           280.00, NOW() - INTERVAL '55 days', '3h', 'finalizado', 4.7),
('33333333-3333-4333-8333-000000000013', '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Remoção de malware',             'Limpeza profunda e proteção em notebook corporativo.',    160.00, NOW() - INTERVAL '52 days', '2h', 'finalizado', 4.9),
('33333333-3333-4333-8333-000000000014', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Consultoria domiciliar TI',      'Visita para organização de cabeamento e painel.',         220.00, NOW() - INTERVAL '48 days', '4h', 'finalizado', 5.0),
('33333333-3333-4333-8333-000000000015', '11111111-1111-4111-8111-000000000009', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Backup em nuvem',                'Configuração de backup automático Google Drive + OneDrive.', 95.00, NOW() - INTERVAL '45 days', '1h', 'finalizado', 4.6),
('33333333-3333-4333-8333-000000000016', '11111111-1111-4111-8111-000000000007', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Montagem de PC gamer',           'Montagem completa com teste de stress e BIOS.',           890.00, NOW() - INTERVAL '41 days', '6h', 'finalizado', 5.0),
('33333333-3333-4333-8333-000000000017', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Suporte remoto mensal',          'Pacote de 4 horas de suporte remoto empresarial.',         320.00, NOW() - INTERVAL '38 days', '4h', 'finalizado', 4.4),
('33333333-3333-4333-8333-000000000018', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Instalação de impressora rede',  'MFP corporativa com fila e permissões por setor.',      140.00, NOW() - INTERVAL '35 days', '2h', 'finalizado', 4.8),
('33333333-3333-4333-8333-000000000019', '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Dual boot Linux/Windows',        'Particionamento seguro e drivers proprietários.',         175.00, NOW() - INTERVAL '33 days', '3h', 'finalizado', 4.9),
('33333333-3333-4333-8333-000000000020', '11111111-1111-4111-8111-000000000009', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Auditoria de Wi-Fi',             'Site survey e relatório de interferências.',              310.00, NOW() - INTERVAL '28 days', '3h', 'finalizado', 4.7),
('33333333-3333-4333-8333-000000000021', '11111111-1111-4111-8111-000000000007', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Troca de fonte ATX',             'Substituição e teste de carga com wattímetro.',           130.00, NOW() - INTERVAL '26 days', '2h', 'finalizado', 4.5),
('33333333-3333-4333-8333-000000000022', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Cabeamento CAT6',                '25m de passagem em eletroduto e certificação básica.',     450.00, NOW() - INTERVAL '24 days', '5h', 'finalizado', 5.0),
('33333333-3333-4333-8333-000000000023', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Office 365 Business',            'Criação de contas, MX e migração IMAP.',                   190.00, NOW() - INTERVAL '20 days', '2h', 'finalizado', 4.6),
('33333333-3333-4333-8333-000000000024', '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Restauração de SO',              'Windows corrompido — reparo in-place + updates.',         110.00, NOW() - INTERVAL '18 days', '2h', 'finalizado', 4.8),
('33333333-3333-4333-8333-000000000025', '11111111-1111-4111-8111-000000000009', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'VPN site-to-site',               'Túnel IPsec entre matriz e filial.',                        520.00, NOW() - INTERVAL '12 days', '4h', 'finalizado', 4.9),
('33333333-3333-4333-8333-000000000026', '11111111-1111-4111-8111-000000000007', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Limpeza de torre e troca de pasta', 'Manutenção preventiva desktop antigo.',               85.00, NOW() - INTERVAL '5 days',  '1h', 'finalizado', 4.3),
('33333333-3333-4333-8333-000000000027', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Monitoramento Zabbix',           'Agente + dashboard básico 30 dias.',                       680.00, NOW() - INTERVAL '2 days',  '6h', 'finalizado', NULL);

-- Serviço com pagamento pendente (carteira prestador — saldo bloqueado)
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao, preco_acordado, data_inicio, duracao, status) VALUES
('33333333-3333-4333-8333-000000000028', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Projeto cabeamento estruturado', 'Levantamento e proposta para edifício comercial.',        2400.00, NOW() + INTERVAL '10 days', '8h', 'aceito');

INSERT INTO transacoes (id, servico_id, tipo, status, valor, descricao, metodo_pagamento, asaas_payment_id, created_at) VALUES
('44444444-4444-4444-8444-999999999998', '33333333-3333-4333-8333-000000000028', 'receber', 'pendente', '2400.00', 'Sinal projeto cabeamento — aguardando liquidação Pix', 'Pix', 'pay_asaas_pend_u8', NOW() - INTERVAL '1 days');

-- ============================================================
-- 13c. Serviços finalizados Pedro (u3), Ana (u4), Carlos (u5)
-- ============================================================
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao, preco_acordado, data_inicio, duracao, status, nota_prestador) VALUES
('33333333-3333-4333-8333-000000000030', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003', 'Troca de registro geral',     'Substituição e vedação completa.',                        180.00, NOW() - INTERVAL '40 days', '2h', 'finalizado', 4.8),
('33333333-3333-4333-8333-000000000031', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003', 'Instalação de chuveiro',      'Derivacão e teste de pressão.',                           220.00, NOW() - INTERVAL '32 days', '3h', 'finalizado', 4.6),
('33333333-3333-4333-8333-000000000032', '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003', 'Caixa inspeção esgoto',       'Abertura, limpeza e tampa nova.',                         140.00, NOW() - INTERVAL '19 days', '2h', 'finalizado', 5.0),
('33333333-3333-4333-8333-000000000033', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000001', 'Limpeza pós-pintura',         'Remoção de respingos e proteção de pisos.',              260.00, NOW() - INTERVAL '36 days', '4h', 'finalizado', 4.9),
('33333333-3333-4333-8333-000000000034', '11111111-1111-4111-8111-000000000007', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000001', 'Higienização sofá',           'Extratora e antialérgico.',                               190.00, NOW() - INTERVAL '27 days', '3h', 'finalizado', 4.5),
('33333333-3333-4333-8333-000000000035', '11111111-1111-4111-8111-000000000009', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000001', 'Limpeza pós-mudança',         'Apartamento 65m² completo.',                              420.00, NOW() - INTERVAL '11 days', '5h', 'finalizado', 4.8),
('33333333-3333-4333-8333-000000000036', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000005', '22222222-2222-4222-8222-000000000002', 'Quadro novo 127/220V',        'Substituição disjuntores e identificação.',               550.00, NOW() - INTERVAL '34 days', '5h', 'finalizado', 4.7),
('33333333-3333-4333-8333-000000000037', '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000005', '22222222-2222-4222-8222-000000000002', 'Instalação ventilador teto',  'Suporte e comando na parede.',                            160.00, NOW() - INTERVAL '16 days', '2h', 'finalizado', 4.9),
('33333333-3333-4333-8333-000000000038', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000005', '22222222-2222-4222-8222-000000000002', 'Iluminação LED embutida',     '6 spots dimmer + driver.',                                380.00, NOW() - INTERVAL '9 days',  '4h', 'finalizado', 5.0);

-- ============================================================
-- 13d. Serviços “pagos pelo cliente” (transação tipo enviar — visão carteira cliente)
-- ============================================================
INSERT INTO servicos (id, user_id, prestador_id, categoria_id, titulo, descricao, preco_acordado, data_inicio, duracao, status) VALUES
('33333333-3333-4333-8333-000000000040', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000001', 'faxina pré-evento',           'Apartamento para visita de família.',                     300.00, NOW() - INTERVAL '14 days', '4h', 'finalizado'),
('33333333-3333-4333-8333-000000000041', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000005', '22222222-2222-4222-8222-000000000002', 'Troca de lâmpadas LED',     'Geral da sala e cozinha.',                                 95.00, NOW() - INTERVAL '10 days', '1h', 'finalizado'),
('33333333-3333-4333-8333-000000000042', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003', 'Ajuste vazamento torneira', 'Troca de vedante e flexível.',                             70.00, NOW() - INTERVAL '8 days',  '1h', 'finalizado'),
('33333333-3333-4333-8333-000000000043', '11111111-1111-4111-8111-000000000006', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000001', 'Limpeza semanal contrato',  'Primeira visita do pacote mensal.',                       180.00, NOW() - INTERVAL '6 days',  '3h', 'finalizado'),
('33333333-3333-4333-8333-000000000044', '11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003', 'Desentupimento ralo',       'Cozinha — máquina rotativa.',                              110.00, NOW() - INTERVAL '4 days',  '1h', 'finalizado'),
('33333333-3333-4333-8333-000000000045', '11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-000000000008', '22222222-2222-4222-8222-000000000006', 'Antivírus corporativo',     'Licença 1 ano + instalação em 3 máquinas.',               240.00, NOW() - INTERVAL '3 days',  '2h', 'finalizado');

-- ============================================================
-- 14. Transações — Lucas (receber), outros prestadores (receber), clientes (enviar)
-- ============================================================
INSERT INTO transacoes (id, servico_id, tipo, status, valor, descricao, metodo_pagamento, asaas_payment_id, created_at) VALUES
('44444444-4444-4444-8444-000000000001', '33333333-3333-4333-8333-000000000007',  'receber', 'aprovada', '120.00', 'Pagamento por suporte em notebook — João Silva',        'Pix',     'pay_asaas_001', NOW() - INTERVAL '29 days'),
('44444444-4444-4444-8444-000000000002', '33333333-3333-4333-8333-000000000008',  'receber', 'aprovada', '200.00', 'Pagamento por configuração de rede — Maria Oliveira',   'Credito', 'pay_asaas_002', NOW() - INTERVAL '21 days'),
('44444444-4444-4444-8444-000000000003', '33333333-3333-4333-8333-000000000009',  'receber', 'aprovada', '150.00', 'Pagamento por manutenção de PC — Fernanda Souza',       'Pix',     'pay_asaas_003', NOW() - INTERVAL '14 days'),
('44444444-4444-4444-8444-000000000004', '33333333-3333-4333-8333-000000000010', 'receber', 'aprovada', '350.00', 'Pagamento por recuperação de dados — Juliana Lima',     'Boleto',  'pay_asaas_004', NOW() - INTERVAL '7 days'),
('44444444-4444-4444-8444-000000000005', '33333333-3333-4333-8333-000000000011', 'receber', 'aprovada', '90.00',  'Pagamento por formatação de PC — Roberto Carlos',       'Pix',     'pay_asaas_005', NOW() - INTERVAL '2 days'),
('44444444-4444-4444-8444-000000000006', '33333333-3333-4333-8333-000000000012', 'receber', 'aprovada', '280.00', 'Pagamento upgrade SSD e RAM — Maria Oliveira',          'Pix',     'pay_asaas_006', NOW() - INTERVAL '54 days'),
('44444444-4444-4444-8444-000000000007', '33333333-3333-4333-8333-000000000013', 'receber', 'aprovada', '160.00', 'Pagamento remoção malware — Fernanda Souza',            'Credito', 'pay_asaas_007', NOW() - INTERVAL '51 days'),
('44444444-4444-4444-8444-000000000008', '33333333-3333-4333-8333-000000000014', 'receber', 'aprovada', '220.00', 'Pagamento consultoria TI domiciliar — João Silva',      'Pix',     'pay_asaas_008', NOW() - INTERVAL '47 days'),
('44444444-4444-4444-8444-000000000009', '33333333-3333-4333-8333-000000000015', 'receber', 'aprovada', '95.00',  'Pagamento backup nuvem — Juliana Lima',                   'Pix',     'pay_asaas_009', NOW() - INTERVAL '44 days'),
('44444444-4444-4444-8444-000000000010', '33333333-3333-4333-8333-000000000016', 'receber', 'aprovada', '890.00', 'Pagamento montagem PC gamer — Roberto Carlos',          'Credito', 'pay_asaas_010', NOW() - INTERVAL '40 days'),
('44444444-4444-4444-8444-000000000011', '33333333-3333-4333-8333-000000000017', 'receber', 'aprovada', '320.00', 'Pagamento suporte remoto mensal — Maria Oliveira',      'Boleto',  'pay_asaas_011', NOW() - INTERVAL '37 days'),
('44444444-4444-4444-8444-000000000012', '33333333-3333-4333-8333-000000000018', 'receber', 'aprovada', '140.00', 'Pagamento impressora rede — João Silva',                'Pix',     'pay_asaas_012', NOW() - INTERVAL '34 days'),
('44444444-4444-4444-8444-000000000013', '33333333-3333-4333-8333-000000000019', 'receber', 'aprovada', '175.00', 'Pagamento dual boot — Fernanda Souza',                    'Pix',     'pay_asaas_013', NOW() - INTERVAL '32 days'),
('44444444-4444-4444-8444-000000000014', '33333333-3333-4333-8333-000000000020', 'receber', 'aprovada', '310.00', 'Pagamento auditoria Wi-Fi — Juliana Lima',                'Credito', 'pay_asaas_014', NOW() - INTERVAL '27 days'),
('44444444-4444-4444-8444-000000000015', '33333333-3333-4333-8333-000000000021', 'receber', 'aprovada', '130.00', 'Pagamento troca fonte ATX — Roberto Carlos',             'Pix',     'pay_asaas_015', NOW() - INTERVAL '25 days'),
('44444444-4444-4444-8444-000000000016', '33333333-3333-4333-8333-000000000022', 'receber', 'aprovada', '450.00', 'Pagamento cabeamento CAT6 — João Silva',                  'Pix',     'pay_asaas_016', NOW() - INTERVAL '23 days'),
('44444444-4444-4444-8444-000000000017', '33333333-3333-4333-8333-000000000023', 'receber', 'aprovada', '190.00', 'Pagamento Office 365 — Maria Oliveira',                   'Boleto',  'pay_asaas_017', NOW() - INTERVAL '19 days'),
('44444444-4444-4444-8444-000000000018', '33333333-3333-4333-8333-000000000024', 'receber', 'aprovada', '110.00', 'Pagamento restauração SO — Fernanda Souza',               'Pix',     'pay_asaas_018', NOW() - INTERVAL '17 days'),
('44444444-4444-4444-8444-000000000019', '33333333-3333-4333-8333-000000000025', 'receber', 'aprovada', '520.00', 'Pagamento VPN site-to-site — Juliana Lima',               'Credito', 'pay_asaas_019', NOW() - INTERVAL '11 days'),
('44444444-4444-4444-8444-000000000020', '33333333-3333-4333-8333-000000000026', 'receber', 'aprovada', '85.00',  'Pagamento limpeza torre — Roberto Carlos',               'Pix',     'pay_asaas_020', NOW() - INTERVAL '4 days'),
('44444444-4444-4444-8444-000000000021', '33333333-3333-4333-8333-000000000027', 'receber', 'aprovada', '680.00', 'Pagamento monitoramento Zabbix — João Silva',             'Pix',     'pay_asaas_021', NOW() - INTERVAL '1 days'),
('44444444-4444-4444-8444-000000000030', '33333333-3333-4333-8333-000000000030', 'receber', 'aprovada', '180.00', 'Pagamento troca registro — João Silva',                   'Pix',     'pay_asaas_030', NOW() - INTERVAL '39 days'),
('44444444-4444-4444-8444-000000000031', '33333333-3333-4333-8333-000000000031', 'receber', 'aprovada', '220.00', 'Pagamento chuveiro — Maria Oliveira',                     'Credito', 'pay_asaas_031', NOW() - INTERVAL '31 days'),
('44444444-4444-4444-8444-000000000032', '33333333-3333-4333-8333-000000000032', 'receber', 'aprovada', '140.00', 'Pagamento caixa esgoto — Fernanda Souza',                 'Pix',     'pay_asaas_032', NOW() - INTERVAL '18 days'),
('44444444-4444-4444-8444-000000000033', '33333333-3333-4333-8333-000000000033', 'receber', 'aprovada', '260.00', 'Pagamento limpeza pós-pintura — João Silva',              'Boleto',  'pay_asaas_033', NOW() - INTERVAL '35 days'),
('44444444-4444-4444-8444-000000000034', '33333333-3333-4333-8333-000000000034', 'receber', 'aprovada', '190.00', 'Pagamento sofá — Roberto Carlos',                         'Pix',     'pay_asaas_034', NOW() - INTERVAL '26 days'),
('44444444-4444-4444-8444-000000000035', '33333333-3333-4333-8333-000000000035', 'receber', 'aprovada', '420.00', 'Pagamento pós-mudança — Juliana Lima',                    'Pix',     'pay_asaas_035', NOW() - INTERVAL '10 days'),
('44444444-4444-4444-8444-000000000036', '33333333-3333-4333-8333-000000000036', 'receber', 'aprovada', '550.00', 'Pagamento quadro 127/220V — Maria Oliveira',              'Credito', 'pay_asaas_036', NOW() - INTERVAL '33 days'),
('44444444-4444-4444-8444-000000000037', '33333333-3333-4333-8333-000000000037', 'receber', 'aprovada', '160.00', 'Pagamento ventilador — Fernanda Souza',                   'Pix',     'pay_asaas_037', NOW() - INTERVAL '15 days'),
('44444444-4444-4444-8444-000000000038', '33333333-3333-4333-8333-000000000038', 'receber', 'aprovada', '380.00', 'Pagamento iluminação LED — João Silva',                   'Pix',     'pay_asaas_038', NOW() - INTERVAL '8 days'),
('44444444-4444-4444-8444-000000000040', '33333333-3333-4333-8333-000000000040', 'enviar', 'aprovada', '300.00', 'Pagamento serviço faxina pré-evento — Ana Limpezas',      'Pix',     'pay_cli_040', NOW() - INTERVAL '13 days'),
('44444444-4444-4444-8444-000000000041', '33333333-3333-4333-8333-000000000041', 'enviar', 'aprovada', '95.00',  'Pagamento troca lâmpadas — Carlos Elétrica',             'Credito', 'pay_cli_041', NOW() - INTERVAL '9 days'),
('44444444-4444-4444-8444-000000000042', '33333333-3333-4333-8333-000000000042', 'enviar', 'aprovada', '70.00',  'Pagamento torneira — Pedro Encanador',                    'Pix',     'pay_cli_042', NOW() - INTERVAL '7 days'),
('44444444-4444-4444-8444-000000000043', '33333333-3333-4333-8333-000000000043', 'enviar', 'aprovada', '180.00', 'Pagamento limpeza semanal — Ana Limpezas',                'Pix',     'pay_cli_043', NOW() - INTERVAL '5 days'),
('44444444-4444-4444-8444-000000000044', '33333333-3333-4333-8333-000000000044', 'enviar', 'aprovada', '110.00', 'Pagamento desentupimento — Pedro Encanador',              'Boleto',  'pay_cli_044', NOW() - INTERVAL '3 days'),
('44444444-4444-4444-8444-000000000045', '33333333-3333-4333-8333-000000000045', 'enviar', 'aprovada', '240.00', 'Pagamento antivírus corporativo — Lucas Tech',            'Pix',     'pay_cli_045', NOW() - INTERVAL '2 days'),
('44444444-4444-4444-8444-000000000046', '33333333-3333-4333-8333-000000000004',  'enviar', 'pendente', '90.00',  'Pagamento pendente — Formatação (aguardando boleto)',     'Boleto',  'pay_cli_pend', NOW() - INTERVAL '1 days');

-- ============================================================
-- 15. Recibos (uma entrada por transação receber aprovada listada acima)
-- ============================================================
INSERT INTO recibos (id, transacao_id, servico_id, codigo_verificacao, dados_fiscais_cliente, hash_integridade) VALUES
('55555555-5555-4555-8555-000000000001', '44444444-4444-4444-8444-000000000001', '33333333-3333-4333-8333-000000000007',  'VER-2025-001', '{"nome":"João Silva","cpf":"11111111111","email":"joao@email.com"}',           'sha256_rec_001'),
('55555555-5555-4555-8555-000000000002', '44444444-4444-4444-8444-000000000002', '33333333-3333-4333-8333-000000000008',  'VER-2025-002', '{"nome":"Maria Oliveira","cpf":"22222222222","email":"maria@email.com"}',      'sha256_rec_002'),
('55555555-5555-4555-8555-000000000003', '44444444-4444-4444-8444-000000000003', '33333333-3333-4333-8333-000000000009',  'VER-2025-003', '{"nome":"Fernanda Souza","cpf":"66666666666","email":"fernanda@email.com"}',   'sha256_rec_003'),
('55555555-5555-4555-8555-000000000004', '44444444-4444-4444-8444-000000000004', '33333333-3333-4333-8333-000000000010', 'VER-2025-004', '{"nome":"Juliana Lima","cpf":"99999999999","email":"juliana@email.com"}',      'sha256_rec_004'),
('55555555-5555-4555-8555-000000000005', '44444444-4444-4444-8444-000000000005', '33333333-3333-4333-8333-000000000011', 'VER-2025-005', '{"nome":"Roberto Carlos","cpf":"77777777777","email":"roberto@email.com"}',    'sha256_rec_005'),
('55555555-5555-4555-8555-000000000006', '44444444-4444-4444-8444-000000000006', '33333333-3333-4333-8333-000000000012', 'VER-2025-006', '{"nome":"Maria Oliveira","cpf":"22222222222","email":"maria@email.com"}',      'sha256_rec_006'),
('55555555-5555-4555-8555-000000000007', '44444444-4444-4444-8444-000000000007', '33333333-3333-4333-8333-000000000013', 'VER-2025-007', '{"nome":"Fernanda Souza","cpf":"66666666666","email":"fernanda@email.com"}',   'sha256_rec_007'),
('55555555-5555-4555-8555-000000000008', '44444444-4444-4444-8444-000000000008', '33333333-3333-4333-8333-000000000014', 'VER-2025-008', '{"nome":"João Silva","cpf":"11111111111","email":"joao@email.com"}',            'sha256_rec_008'),
('55555555-5555-4555-8555-000000000009', '44444444-4444-4444-8444-000000000009', '33333333-3333-4333-8333-000000000015', 'VER-2025-009', '{"nome":"Juliana Lima","cpf":"99999999999","email":"juliana@email.com"}',      'sha256_rec_009'),
('55555555-5555-4555-8555-000000000010', '44444444-4444-4444-8444-000000000010', '33333333-3333-4333-8333-000000000016', 'VER-2025-010', '{"nome":"Roberto Carlos","cpf":"77777777777","email":"roberto@email.com"}',  'sha256_rec_010'),
('55555555-5555-4555-8555-000000000011', '44444444-4444-4444-8444-000000000011', '33333333-3333-4333-8333-000000000017', 'VER-2025-011', '{"nome":"Maria Oliveira","cpf":"22222222222","email":"maria@email.com"}',     'sha256_rec_011'),
('55555555-5555-4555-8555-000000000012', '44444444-4444-4444-8444-000000000012', '33333333-3333-4333-8333-000000000018', 'VER-2025-012', '{"nome":"João Silva","cpf":"11111111111","email":"joao@email.com"}',         'sha256_rec_012'),
('55555555-5555-4555-8555-000000000013', '44444444-4444-4444-8444-000000000013', '33333333-3333-4333-8333-000000000019', 'VER-2025-013', '{"nome":"Fernanda Souza","cpf":"66666666666","email":"fernanda@email.com"}', 'sha256_rec_013'),
('55555555-5555-4555-8555-000000000014', '44444444-4444-4444-8444-000000000014', '33333333-3333-4333-8333-000000000020', 'VER-2025-014', '{"nome":"Juliana Lima","cpf":"99999999999","email":"juliana@email.com"}',    'sha256_rec_014'),
('55555555-5555-4555-8555-000000000015', '44444444-4444-4444-8444-000000000015', '33333333-3333-4333-8333-000000000021', 'VER-2025-015', '{"nome":"Roberto Carlos","cpf":"77777777777","email":"roberto@email.com"}',  'sha256_rec_015'),
('55555555-5555-4555-8555-000000000016', '44444444-4444-4444-8444-000000000016', '33333333-3333-4333-8333-000000000022', 'VER-2025-016', '{"nome":"João Silva","cpf":"11111111111","email":"joao@email.com"}',         'sha256_rec_016'),
('55555555-5555-4555-8555-000000000017', '44444444-4444-4444-8444-000000000017', '33333333-3333-4333-8333-000000000023', 'VER-2025-017', '{"nome":"Maria Oliveira","cpf":"22222222222","email":"maria@email.com"}',     'sha256_rec_017'),
('55555555-5555-4555-8555-000000000018', '44444444-4444-4444-8444-000000000018', '33333333-3333-4333-8333-000000000024', 'VER-2025-018', '{"nome":"Fernanda Souza","cpf":"66666666666","email":"fernanda@email.com"}',  'sha256_rec_018'),
('55555555-5555-4555-8555-000000000019', '44444444-4444-4444-8444-000000000019', '33333333-3333-4333-8333-000000000025', 'VER-2025-019', '{"nome":"Juliana Lima","cpf":"99999999999","email":"juliana@email.com"}',     'sha256_rec_019'),
('55555555-5555-4555-8555-000000000020', '44444444-4444-4444-8444-000000000020', '33333333-3333-4333-8333-000000000026', 'VER-2025-020', '{"nome":"Roberto Carlos","cpf":"77777777777","email":"roberto@email.com"}',   'sha256_rec_020'),
('55555555-5555-4555-8555-000000000021', '44444444-4444-4444-8444-000000000021', '33333333-3333-4333-8333-000000000027', 'VER-2025-021', '{"nome":"João Silva","cpf":"11111111111","email":"joao@email.com"}',         'sha256_rec_021'),
('55555555-5555-4555-8555-000000000030', '44444444-4444-4444-8444-000000000030', '33333333-3333-4333-8333-000000000030', 'VER-2025-030', '{"nome":"João Silva","cpf":"11111111111","email":"joao@email.com"}',        'sha256_rec_030'),
('55555555-5555-4555-8555-000000000031', '44444444-4444-4444-8444-000000000031', '33333333-3333-4333-8333-000000000031', 'VER-2025-031', '{"nome":"Maria Oliveira","cpf":"22222222222","email":"maria@email.com"}',    'sha256_rec_031'),
('55555555-5555-4555-8555-000000000032', '44444444-4444-4444-8444-000000000032', '33333333-3333-4333-8333-000000000032', 'VER-2025-032', '{"nome":"Fernanda Souza","cpf":"66666666666","email":"fernanda@email.com"}',  'sha256_rec_032'),
('55555555-5555-4555-8555-000000000033', '44444444-4444-4444-8444-000000000033', '33333333-3333-4333-8333-000000000033', 'VER-2025-033', '{"nome":"João Silva","cpf":"11111111111","email":"joao@email.com"}',         'sha256_rec_033'),
('55555555-5555-4555-8555-000000000034', '44444444-4444-4444-8444-000000000034', '33333333-3333-4333-8333-000000000034', 'VER-2025-034', '{"nome":"Roberto Carlos","cpf":"77777777777","email":"roberto@email.com"}',  'sha256_rec_034'),
('55555555-5555-4555-8555-000000000035', '44444444-4444-4444-8444-000000000035', '33333333-3333-4333-8333-000000000035', 'VER-2025-035', '{"nome":"Juliana Lima","cpf":"99999999999","email":"juliana@email.com"}',     'sha256_rec_035'),
('55555555-5555-4555-8555-000000000036', '44444444-4444-4444-8444-000000000036', '33333333-3333-4333-8333-000000000036', 'VER-2025-036', '{"nome":"Maria Oliveira","cpf":"22222222222","email":"maria@email.com"}',     'sha256_rec_036'),
('55555555-5555-4555-8555-000000000037', '44444444-4444-4444-8444-000000000037', '33333333-3333-4333-8333-000000000037', 'VER-2025-037', '{"nome":"Fernanda Souza","cpf":"66666666666","email":"fernanda@email.com"}',  'sha256_rec_037'),
('55555555-5555-4555-8555-000000000038', '44444444-4444-4444-8444-000000000038', '33333333-3333-4333-8333-000000000038', 'VER-2025-038', '{"nome":"João Silva","cpf":"11111111111","email":"joao@email.com"}',         'sha256_rec_038');

-- Recibos para pagamentos do cliente (enviar) — comprovante
INSERT INTO recibos (id, transacao_id, servico_id, codigo_verificacao, dados_fiscais_cliente, hash_integridade) VALUES
('55555555-5555-4555-8555-000000000040', '44444444-4444-4444-8444-000000000040', '33333333-3333-4333-8333-000000000040', 'VER-2025-040', '{"pagador":"João Silva","cpf":"11111111111","beneficiario":"Ana Limpezas"}',   'sha256_cli_040'),
('55555555-5555-4555-8555-000000000041', '44444444-4444-4444-8444-000000000041', '33333333-3333-4333-8333-000000000041', 'VER-2025-041', '{"pagador":"João Silva","cpf":"11111111111","beneficiario":"Carlos Elétrica"}','sha256_cli_041'),
('55555555-5555-4555-8555-000000000042', '44444444-4444-4444-8444-000000000042', '33333333-3333-4333-8333-000000000042', 'VER-2025-042', '{"pagador":"Maria Oliveira","cpf":"22222222222","beneficiario":"Pedro Enc."}', 'sha256_cli_042'),
('55555555-5555-4555-8555-000000000043', '44444444-4444-4444-8444-000000000043', '33333333-3333-4333-8333-000000000043', 'VER-2025-043', '{"pagador":"Fernanda Souza","cpf":"66666666666","beneficiario":"Ana Limpezas"}','sha256_cli_043'),
('55555555-5555-4555-8555-000000000044', '44444444-4444-4444-8444-000000000044', '33333333-3333-4333-8333-000000000044', 'VER-2025-044', '{"pagador":"João Silva","cpf":"11111111111","beneficiario":"Pedro Enc."}',    'sha256_cli_044'),
('55555555-5555-4555-8555-000000000045', '44444444-4444-4444-8444-000000000045', '33333333-3333-4333-8333-000000000045', 'VER-2025-045', '{"pagador":"Maria Oliveira","cpf":"22222222222","beneficiario":"Lucas Tech"}','sha256_cli_045');

-- ============================================================
-- 16. Atualiza carteiras (saldos ilustrativos + bloqueio + métodos)
--     Lucas u8: soma tx1–tx21 (receber aprovadas) = 5765,00 + 2400,00 bloqueados (sinal pendente)
-- ============================================================
UPDATE carteiras SET
  saldo                = '8165.00',
  saldo_bloqueado      = '2400.00',
  ultima_transacao_id  = '44444444-4444-4444-8444-000000000021',
  metodos_de_pagamento = '{"pix":"lucas.tech@pix.domni","cartoes":[],"dinheiro":"nao"}',
  updated_at           = NOW()
WHERE prestador_id = '11111111-1111-4111-8111-000000000008';

UPDATE carteiras SET
  saldo                = '2340.00',
  saldo_bloqueado      = '0',
  ultima_transacao_id  = '44444444-4444-4444-8444-000000000032',
  metodos_de_pagamento = '{"pix":"pedro.encanador@pix","cartoes":[],"dinheiro":"sim"}',
  updated_at           = NOW()
WHERE prestador_id = '11111111-1111-4111-8111-000000000003';

UPDATE carteiras SET
  saldo                = '4570.00',
  saldo_bloqueado      = '120.00',
  ultima_transacao_id  = '44444444-4444-4444-8444-000000000035',
  metodos_de_pagamento = '{"pix":"ana.limpezas@pix","cartoes":[],"dinheiro":"sim"}',
  updated_at           = NOW()
WHERE prestador_id = '11111111-1111-4111-8111-000000000004';

UPDATE carteiras SET
  saldo                = '1640.00',
  saldo_bloqueado      = '0',
  ultima_transacao_id  = '44444444-4444-4444-8444-000000000038',
  metodos_de_pagamento = '{"pix":"carlos.eletrica@pix","cartoes":[],"dinheiro":"nao"}',
  updated_at           = NOW()
WHERE prestador_id = '11111111-1111-4111-8111-000000000005';

-- Clientes: saldo após vários pagamentos (valores ilustrativos)
UPDATE carteiras SET
  saldo                = '2840.00',
  saldo_bloqueado      = '90.00',
  ultima_transacao_id  = '44444444-4444-4444-8444-000000000044',
  metodos_de_pagamento = '{"pix":"joao@email.com","cartoes":[],"dinheiro":"nao"}',
  updated_at           = NOW()
WHERE user_id = '11111111-1111-4111-8111-000000000001';

UPDATE carteiras SET
  saldo                = '1985.50',
  saldo_bloqueado      = '0',
  ultima_transacao_id  = '44444444-4444-4444-8444-000000000045',
  metodos_de_pagamento = '{"pix":"maria@email.com","cartoes":[],"dinheiro":"sim"}',
  updated_at           = NOW()
WHERE user_id = '11111111-1111-4111-8111-000000000002';

UPDATE carteiras SET
  saldo                = '4120.00',
  saldo_bloqueado      = '0',
  ultima_transacao_id  = '44444444-4444-4444-8444-000000000043',
  metodos_de_pagamento = '{"pix":"fernanda@email.com","cartoes":[],"dinheiro":"nao"}',
  updated_at           = NOW()
WHERE user_id = '11111111-1111-4111-8111-000000000006';
