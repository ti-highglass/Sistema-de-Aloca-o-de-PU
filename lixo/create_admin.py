import psycopg2
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

# Configuração do banco
DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PSW'),
    'port': os.getenv('DB_PORT'),
    'database': os.getenv('DB_NAME')
}

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # Gerar hash da senha
    password_hash = generate_password_hash('admin123')
    
    # Inserir usuário admin
    cur.execute("""
        INSERT INTO public.users_pu (usuario, senha, funcao) 
        VALUES (%s, %s, %s)
    """, ('admin', password_hash, 'admin'))
    
    conn.commit()
    print("Tabela criada e usuário admin inserido com sucesso!")
    print("Login: admin")
    print("Senha: admin123")
    
except Exception as e:
    print(f"Erro: {e}")
finally:
    if conn:
        conn.close()