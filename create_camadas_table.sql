-- Criar tabela camadas_pu se não existir
CREATE TABLE IF NOT EXISTS public.camadas_pu (
    id SERIAL PRIMARY KEY,
    peca TEXT NOT NULL,
    camada TEXT NOT NULL,
    qtde INTEGER NOT NULL DEFAULT 1
);

-- Inserir dados de exemplo para PDD34165
INSERT INTO public.camadas_pu (peca, camada, qtde) VALUES 
('PDD34165', 'L1', 2),
('PDD34165', 'L3', 3)
ON CONFLICT DO NOTHING;

-- Outros exemplos de peças com camadas
INSERT INTO public.camadas_pu (peca, camada, qtde) VALUES 
('TSP', 'L1', 1),
('TSP', 'L3', 2),
('VGA', 'L1', 1),
('VGA', 'L2', 1),
('VGA', 'L3', 1)
ON CONFLICT DO NOTHING;