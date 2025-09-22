import psycopg2
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

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
    
    # Limpar todos os usuários
    cur.execute("DELETE FROM public.users_pu")
    
    # Criar apenas um usuário admin
    password_hash = generate_password_hash('admin123')
    cur.execute(
        "INSERT INTO public.users_pu (usuario, senha, funcao) VALUES (%s, %s, %s)",
        ('admin', password_hash, 'admin')
    )
    
    conn.commit()
    print("Usuários limpos e admin criado com sucesso!")
    print("Login: admin")
    print("Senha: admin123")
    
except Exception as e:
    print(f"Erro: {e}")
finally:
    if conn:
        conn.close()