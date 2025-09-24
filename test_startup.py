#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os

print("=== TESTE DE INICIALIZAÇÃO ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")

# Testar imports
try:
    print("Testando imports...")
    from flask import Flask
    print("✓ Flask OK")
    
    import psycopg2
    print("✓ psycopg2 OK")
    
    import pandas as pd
    print("✓ pandas OK")
    
    from dotenv import load_dotenv
    print("✓ python-dotenv OK")
    
except ImportError as e:
    print(f"✗ Erro de import: {e}")
    input("Pressione Enter para sair...")
    exit(1)

# Testar .env
try:
    print("\nTestando .env...")
    if not os.path.exists('.env'):
        print("✗ Arquivo .env não encontrado!")
        input("Pressione Enter para sair...")
        exit(1)
    
    load_dotenv()
    
    db_host = os.getenv('DB_HOST')
    db_user = os.getenv('DB_USER')
    db_psw = os.getenv('DB_PSW')
    
    if not all([db_host, db_user, db_psw]):
        print("✗ Variáveis de ambiente não carregadas!")
        input("Pressione Enter para sair...")
        exit(1)
    
    print("✓ Arquivo .env OK")
    print(f"  Host: {db_host}")
    print(f"  User: {db_user}")
    
except Exception as e:
    print(f"✗ Erro no .env: {e}")
    input("Pressione Enter para sair...")
    exit(1)

# Testar conexão com banco
try:
    print("\nTestando conexão com banco...")
    conn = psycopg2.connect(
        host=db_host,
        user=db_user,
        password=db_psw,
        port=os.getenv('DB_PORT', 5432),
        database=os.getenv('DB_NAME', 'postgres')
    )
    conn.close()
    print("✓ Conexão com banco OK")
    
except Exception as e:
    print(f"✗ Erro de conexão: {e}")
    input("Pressione Enter para sair...")
    exit(1)

print("\n=== TODOS OS TESTES PASSARAM ===")
print("O sistema deveria iniciar normalmente.")
input("Pressione Enter para continuar...")