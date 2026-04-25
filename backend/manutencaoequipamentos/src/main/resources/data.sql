TRUNCATE TABLE solicitacoes, funcionarios, clientes, categorias RESTART IDENTITY CASCADE;

-- FUNCIONARIOS 
INSERT INTO funcionarios (id, nome, cpf, email, senha, data_nascimento, cargo, ativo) VALUES
(1, 'Maria Silva Pereira', '123.456.789-00', 'maria@empresa.com', '123456', '1998-11-12', 'Técnica de Suporte', true),
(2, 'Mário da Rocha Bastos', '987.654.321-00', 'mario@empresa.com', '123456', '1980-05-20', 'Analista de Sistemas', true);

-- CLIENTES 
INSERT INTO clientes (id, nome, email, senha, telefone, cpf, ativo, data_cadastro) VALUES
(10, 'João', 'joao@gmail.com', '1111', '4199999999', '123.456.789-00', true, '2024-01-01'),
(20, 'José', 'jose@gmail.com', '2222', '4199999998', '111.222.333-44', false, '2024-02-15'),
(30, 'Joana', 'joana@gmail.com', '3333', '4199999997', '123.456.789-10', true, '2024-03-10'),
(40, 'Joaquina', 'joaquina@gmail.com', '4444', '4199999996', '123.456.789-11', false, '2024-04-20');

-- CATEGORIAS
INSERT INTO categorias (id, nome, ativo) VALUES
(1, 'Notebook', true),
(2, 'Desktop', true),
(3, 'Monitor', true),
(4, 'Mouse', true),
(5, 'Impressora', true);

-- SOLICITACOES 
INSERT INTO solicitacoes 
(id, descricao_equipamento, descricao_defeito, estado_atual, valor_orcado, ativo, cliente_id, categoria_id, funcionario_responsavel_id)
VALUES

-- ABERTA
(1001, 'Mouse Logitech', 'Não funciona', 'ABERTA', NULL, true, 10, 4, NULL),

-- ORCADA
(1002, 'Notebook Dell', 'Tela queimada', 'ORCADA', 350, true, 10, 1, 1),

-- APROVADA
(1003, 'Tablet Lenovo', 'Tela trincada', 'APROVADA', 200, true, 30, 2, 2),

-- ARRUMADA
(1004, 'Monitor LG', 'Imagem piscando', 'ARRUMADA', 150, true, 10, 3, 1),

-- PAGA
(1005, 'Impressora HP', 'Não imprime', 'PAGA', 120, true, 40, 5, 1),

-- FINALIZADA
(1006, 'PlayStation 4', 'Superaquecendo', 'FINALIZADA', 220, true, 40, 2, 2),

-- MAIS VARIAÇÕES
(1007, 'Teclado Redragon', 'Teclas falhando', 'ORCADA', 140, true, 30, 4, 1),
(1008, 'Notebook Acer', 'Bateria ruim', 'APROVADA', 300, true, 20, 1, 2),
(1009, 'Mouse Gamer', 'Clique falha', 'PAGA', 80, true, 20, 4, 2),
(1010, 'Notebook HP', 'HD queimado', 'ARRUMADA', 400, true, 20, 1, 1),
(1011, 'Câmera Canon', 'Não foca', 'APROVADA', 500, true, 10, 3, 2),
(1012, 'Headset HyperX', 'Microfone não funciona', 'ABERTA', NULL, true, 30, 5, NULL);