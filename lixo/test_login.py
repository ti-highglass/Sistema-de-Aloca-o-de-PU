import psycopg2
import psycopg2.extras
from werkzeug.security import check_password_hash, generate_password_hash
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
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Verificar usuários existentes
    cur.execute("SELECT * FROM public.users_pu")
    users = cur.fetchall()
    
    print("Usuários na tabela:")
    for user in users:
        print(f"ID: {user['id']}, Usuário: {user['usuario']}, Função: {user['funcao']}")
    
    # Testar login do admin
    cur.execute("SELECT * FROM public.users_pu WHERE usuario = %s", ('admin',))
    admin_user = cur.fetchone()
    
    if admin_user:
        print(f"\nUsuário admin encontrado: {admin_user['usuario']}")
        print(f"Hash da senha: {admin_user['senha'][:50]}...")
        
        # Testar verificação da senha
        test_password = 'admin123'
        is_valid = check_password_hash(admin_user['senha'], test_password)
        print(f"Senha 'admin123' é válida: {is_valid}")
        
        if not is_valid:
            # Recriar hash da senha
            new_hash = generate_password_hash('admin123')
            cur.execute("UPDATE public.users_pu SET senha = %s WHERE usuario = %s", (new_hash, 'admin'))
            conn.commit()
            print("Senha do admin atualizada!")
    else:
        print("Usuário admin não encontrado!")
        
except Exception as e:
    print(f"Erro: {e}")
finally:
    if conn:
        conn.close()