# Sistema de Alocação de PU

## Descrição

Sistema web desenvolvido em Flask para gerenciamento completo de alocação de peças de PU (Poliuretano) automotivas. O sistema oferece controle total do fluxo desde a coleta de dados até o armazenamento final no estoque, com funcionalidades avançadas de otimização, rastreamento e relatórios.

## Funcionalidades Principais

### 🔐 Sistema de Autenticação
- ✅ Login seguro com hash de senhas
- ✅ Controle de acesso por setor (Produção, Administrativo, T.I)
- ✅ Gerenciamento de usuários (apenas T.I)
- ✅ Diferentes níveis de permissão

### 📊 Coleta e Otimização de Dados
- ✅ Coleta automática de dados do banco apontamento_pplug_jarinu
- ✅ Filtros por data/hora para coleta específica
- ✅ Algoritmo inteligente de sugestão de locais de armazenamento
- ✅ Workflow de otimização com validação de espaços
- ✅ Prevenção de duplicatas no sistema

### 🏭 Gestão de Estoque
- ✅ Controle completo de inventário
- ✅ Rastreamento de movimentações
- ✅ Histórico de saídas com auditoria
- ✅ Status dinâmico de locais (Ativo/Utilizando)
- ✅ Operações em lote (seleção múltipla)

### 📍 Gerenciamento de Locais
- ✅ Cadastro de locais COLMEIA e GAVETEIRO
- ✅ Algoritmo de sequenciamento automático
- ✅ Monitoramento de ocupação em tempo real
- ✅ Validação de disponibilidade

### 📈 Relatórios e Exportação
- ✅ Geração de arquivos XML para otimização
- ✅ Exportação Excel de todos os módulos
- ✅ Relatórios de estoque, saídas e logs
- ✅ Filtros e busca avançada

### 🔍 Sistema de Logs e Auditoria
- ✅ Rastreamento completo de ações dos usuários
- ✅ Logs detalhados com timestamp
- ✅ Busca e filtros nos logs (apenas T.I)
- ✅ Exportação de relatórios de auditoria

### 🎨 Interface e Experiência
- ✅ Design responsivo e moderno
- ✅ Tabelas com ordenação por colunas
- ✅ Paginação inteligente
- ✅ Modais para operações críticas
- ✅ Proteção contra inspeção de código
- ✅ Animações e transições suaves

## Tecnologias Utilizadas

- **Backend**: Python 3.x + Flask + Flask-Login
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Banco de Dados**: PostgreSQL (Supabase)
- **Autenticação**: Werkzeug Security
- **Exportação**: Pandas + OpenPyXL
- **Ícones**: Font Awesome 6.0
- **Estilo**: CSS customizado com design system próprio

## Instalação e Execução

### 1. Configurar ambiente
```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente (.env)
DB_HOST=seu_host_postgresql
DB_USER=seu_usuario
DB_PSW=sua_senha
DB_PORT=5432
DB_NAME=nome_do_banco
```

### 2. Executar a aplicação
```bash
# Método manual
python app.py

# Ou usar o arquivo de inicialização
iniciar_sistema.bat
```

### 3. Acessar no navegador
```
http://localhost:9990
```

### 4. Login inicial
- Usuário padrão deve ser criado via T.I
- Setores disponíveis: Produção, Administrativo, T.I
- Funções: user, admin

## Estrutura do Projeto

```
Sistema Alocação de PU/
│
├── app.py                    # Aplicação Flask principal
├── requirements.txt          # Dependências Python
├── README.md                # Documentação
├── .env                     # Variáveis de ambiente (não versionado)
├── iniciar_sistema.bat      # Script de inicialização
├── README_INSTALACAO.txt    # Guia de instalação
│
├── templates/
│   ├── navbar.html          # Navegação centralizada
│   ├── login.html           # Tela de login
│   ├── index.html           # Otimização de peças
│   ├── estoque.html         # Gestão de estoque
│   ├── locais.html          # Gerenciamento de locais
│   ├── otimizadas.html      # Peças em processo
│   ├── saidas.html          # Histórico de saídas
│   ├── register.html        # Gestão de usuários
│   └── logs.html            # Sistema de logs
│
└── static/
    ├── css/
    │   ├── style.css        # Estilos principais
    │   └── login.css        # Estilos do login
    ├── js/
    │   ├── protection.js    # Proteção de código
    │   ├── index.js         # Lógica da otimização
    │   ├── estoque.js       # Lógica do estoque
    │   ├── locais.js        # Lógica dos locais
    │   ├── otimizadas.js    # Lógica das otimizadas
    │   ├── saidas.js        # Lógica das saídas
    │   ├── register.js      # Lógica dos usuários
    │   └── logs.js          # Lógica dos logs
    └── img/
        └── opera.jpg        # Logo da empresa
```

## Estrutura do Banco de Dados

### Tabelas Principais

#### pu_inventory (Estoque Final)
| Campo     | Tipo      | Descrição                 |
|-----------|-----------|---------------------------|
| id        | SERIAL    | Chave primária           |
| op_pai    | TEXT      | OP pai                   |
| op        | TEXT      | Ordem de Produção        |
| peca      | TEXT      | Código da peça           |
| projeto   | TEXT      | Projeto da peça          |
| veiculo   | TEXT      | Modelo do veículo        |
| local     | TEXT      | Local de armazenamento   |
| rack      | TEXT      | Tipo de rack             |

#### pu_otimizadas (Processo Intermediário)
| Campo           | Tipo      | Descrição                 |
|-----------------|-----------|---------------------------|
| id              | SERIAL    | Chave primária           |
| op_pai          | TEXT      | OP pai                   |
| op              | TEXT      | Ordem de Produção        |
| peca            | TEXT      | Código da peça           |
| projeto         | TEXT      | Projeto da peça          |
| veiculo         | TEXT      | Modelo do veículo        |
| local           | TEXT      | Local sugerido           |
| rack            | TEXT      | Tipo de rack             |
| cortada         | BOOLEAN   | Status de corte          |
| user_otimizacao | TEXT      | Usuário responsável      |
| data_otimizacao | TIMESTAMP | Data da otimização       |

#### pu_locais (Gestão de Locais)
| Campo  | Tipo   | Descrição              |
|--------|--------|------------------------|
| id     | SERIAL | Chave primária        |
| local  | TEXT   | Código do local       |
| rack   | TEXT   | COLMEIA ou GAVETEIRO  |
| status | TEXT   | Ativo ou Utilizando   |

#### pu_exit (Histórico de Saídas)
| Campo   | Tipo      | Descrição              |
|---------|-----------|------------------------|
| id      | SERIAL    | Chave primária        |
| op_pai  | TEXT      | OP pai                |
| op      | TEXT      | Ordem de Produção     |
| peca    | TEXT      | Código da peça        |
| projeto | TEXT      | Projeto da peça       |
| veiculo | TEXT      | Modelo do veículo     |
| local   | TEXT      | Local de origem       |
| rack    | TEXT      | Tipo de rack          |
| usuario | TEXT      | Usuário responsável   |
| data    | TIMESTAMP | Data da saída         |

#### users_pu (Controle de Usuários)
| Campo   | Tipo   | Descrição                    |
|---------|--------|------------------------------|
| id      | SERIAL | Chave primária              |
| usuario | TEXT   | Nome do usuário             |
| senha   | TEXT   | Hash da senha               |
| funcao  | TEXT   | user ou admin               |
| setor   | TEXT   | Produção/Administrativo/T.I |

#### pu_logs (Sistema de Auditoria)
| Campo     | Tipo      | Descrição              |
|-----------|-----------|------------------------|
| id        | SERIAL    | Chave primária        |
| usuario   | TEXT      | Usuário da ação       |
| acao      | TEXT      | Tipo de ação          |
| detalhes  | TEXT      | Detalhes da ação      |
| data_acao | TIMESTAMP | Timestamp da ação     |

### Tabela de Origem (Somente Leitura)

#### apontamento_pplug_jarinu
| Campo   | Tipo | Descrição                    |
|---------|------|------------------------------|
| op      | TEXT | Ordem de Produção           |
| item    | TEXT | Código da peça              |
| projeto | TEXT | Projeto                     |
| veiculo | TEXT | Modelo do veículo           |
| data    | DATE | Data do apontamento         |
| etapa   | TEXT | Etapa (filtro: EMPOLVADO)   |

## API Endpoints

### Autenticação
- `GET /` - Página de login
- `POST /login` - Autenticação de usuário
- `GET /logout` - Logout do sistema

### Páginas Principais
- `GET /index` - Tela de otimização (redireciona Produção para /otimizadas)
- `GET /estoque` - Gestão de estoque
- `GET /locais` - Gerenciamento de locais
- `GET /otimizadas` - Peças em processo
- `GET /saidas` - Histórico de saídas
- `GET /register` - Gestão de usuários (apenas T.I)
- `GET /logs` - Sistema de logs (apenas T.I admin)

### APIs de Dados
- `GET /api/dados` - Coleta dados com filtros de data
- `GET /api/estoque` - Lista itens do estoque
- `GET /api/otimizadas` - Lista peças otimizadas
- `GET /api/locais` - Lista locais com status
- `GET /api/saidas` - Histórico paginado de saídas
- `GET /api/logs` - Logs paginados (apenas T.I)
- `GET /api/usuarios` - Lista usuários (apenas T.I)

### APIs de Operação
- `POST /api/otimizar-pecas` - Envia peças para otimização
- `POST /api/enviar-estoque` - Move peças otimizadas para estoque
- `POST /api/remover-estoque` - Remove peças do estoque
- `POST /api/adicionar-local` - Cadastra novo local

### APIs de Usuários (T.I)
- `POST /api/cadastrar-usuario` - Cria novo usuário
- `PUT /api/editar-usuario/<id>` - Edita usuário
- `PUT /api/resetar-senha/<id>` - Reseta senha
- `DELETE /api/excluir-usuario/<id>` - Exclui usuário

### APIs de Exportação
- `POST /api/gerar-xml` - Gera XMLs de otimização
- `POST /api/gerar-excel-otimizacao` - Excel das peças selecionadas
- `POST /api/gerar-excel-estoque` - Excel do estoque
- `POST /api/gerar-excel-saidas` - Excel das saídas
- `POST /api/gerar-excel-logs` - Excel dos logs (T.I)

## Fluxo de Trabalho

### 1. Coleta e Otimização
1. **Login** no sistema com credenciais apropriadas
2. **Acesse Otimização** (tela principal)
3. **Configure filtros** de data/hora se necessário
4. **Colete dados** do banco de origem
5. **Selecione peças** para otimização
6. **Gere XML** ou **Excel** conforme necessidade
7. **Otimize peças** selecionadas

### 2. Processamento (Tela Otimizadas)
1. **Visualize peças** em processo de otimização
2. **Selecione peças** processadas
3. **Envie para estoque** final

### 3. Gestão de Estoque
1. **Monitore inventário** completo
2. **Remova peças** quando necessário
3. **Exporte relatórios** em Excel
4. **Acompanhe movimentações**

### 4. Administração (T.I)
1. **Gerencie usuários** e permissões
2. **Monitore logs** do sistema
3. **Configure locais** de armazenamento
4. **Exporte relatórios** de auditoria

## Algoritmo de Armazenamento

### COLMEIA (Peças específicas)
**Peças**: PBS, VGA, VGE, VGD, TSP, TSA, TSB, TSC

**Sequência de preenchimento**:
1. E1→E2→E3→E4→E5→E6→E7
2. F1→F2→F3→F4→F5→F6→F7→F8→F9
3. G1→G2→...→G11
4. H1→H2→...→H12
5. I1→I2→...→I14
6. J1→J2→...→J16
7. K1→K2→...→K17
8. L1→L2→...→L17
9. D1→D2→D3→D4→D5→D6
10. C1→C2→C3→C4
11. B1→B2→B3
12. A1

### GAVETEIRO (Demais peças)
**Sequência de preenchimento**:
1. **Linha A**: A7→A8→...→A20, depois A6→A5→...→A1
2. **Linhas B-F**: B7→C7→D7→E7→F7, depois B8→C8→D8→E8→F8, etc.

## Requisitos do Sistema

### Software
- **Python**: 3.7+
- **PostgreSQL**: 12+
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Dependências Python
```
Flask==2.3.3
Flask-Login==0.6.3
psycopg2-binary==2.9.7
pandas==2.0.3
openpyxl==3.1.2
python-dotenv==1.0.0
Werkzeug==2.3.7
```

### Configuração de Rede
- **Porta**: 9990
- **Host**: 0.0.0.0 (acesso em rede local)
- **Protocolo**: HTTP

## Segurança

- ✅ Autenticação com hash de senhas (Werkzeug)
- ✅ Controle de sessão (Flask-Login)
- ✅ Validação de permissões por setor
- ✅ Proteção contra inspeção de código
- ✅ Logs de auditoria completos
- ✅ Validação de entrada de dados

## Performance

- ✅ Consultas otimizadas com índices
- ✅ Paginação em tabelas grandes
- ✅ Cache de locais ocupados
- ✅ Operações em lote
- ✅ Compressão de arquivos ZIP

## Personalização

### Configurar Banco de Dados
Edite o arquivo `.env` com suas credenciais PostgreSQL

### Modificar Algoritmo de Armazenamento
Altere a função `sugerir_local_armazenamento()` em `app.py`

### Customizar Interface
- **Estilos**: Modifique `static/css/style.css`
- **Lógica**: Edite arquivos JavaScript em `static/js/`
- **Layout**: Altere templates HTML em `templates/`

### Adicionar Funcionalidades
1. **Backend**: Crie novas rotas em `app.py`
2. **Frontend**: Adicione JavaScript correspondente
3. **Interface**: Crie/modifique templates HTML

## Manutenção

### Backup Recomendado
- **Banco de dados**: Backup diário automático
- **Logs**: Rotação semanal
- **Arquivos**: Backup dos XMLs gerados

### Monitoramento
- **Logs de sistema**: Tabela `pu_logs`
- **Performance**: Monitorar consultas lentas
- **Espaço**: Verificar crescimento das tabelas

## Suporte e Desenvolvimento

**Desenvolvido por**: Sistema Opera - TI  
**Versão**: 2.0  
**Data**: Janeiro 2025  
**Licença**: Uso interno Opera  

### Contato
- **Suporte técnico**: Setor T.I Opera
- **Melhorias**: Solicitar via sistema interno
- **Bugs**: Reportar ao administrador do sistema

---

*Sistema em produção - Todas as operações são logadas e auditadas*