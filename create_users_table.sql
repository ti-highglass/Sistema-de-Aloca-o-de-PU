-- Script para criar a tabela users_pu no PostgreSQL
-- Execute este script no seu banco de dados PostgreSQL

CREATE TABLE IF NOT EXISTS public.users_pu (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_pu_username ON public.users_pu(username);
CREATE INDEX IF NOT EXISTS idx_users_pu_email ON public.users_pu(email);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO public.users_pu (username, email, password, role) 
VALUES ('admin', 'admin@opera.com', 'pbkdf2:sha256:600000$XyZ123$a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Comentários nas colunas
COMMENT ON TABLE public.users_pu IS 'Tabela de usuários do Sistema de Alocação de PU';
COMMENT ON COLUMN public.users_pu.id IS 'ID único do usuário';
COMMENT ON COLUMN public.users_pu.username IS 'Nome de usuário único';
COMMENT ON COLUMN public.users_pu.email IS 'Email único do usuário';
COMMENT ON COLUMN public.users_pu.password IS 'Senha criptografada';
COMMENT ON COLUMN public.users_pu.role IS 'Função do usuário (user ou admin)';
COMMENT ON COLUMN public.users_pu.created_at IS 'Data de criação do usuário';
COMMENT ON COLUMN public.users_pu.updated_at IS 'Data da última atualização';