# DOMI — Plataforma de Serviços e Agendamentos

DOMI é uma plataforma web que conecta **clientes** a **prestadores de serviços** (diaristas, eletricistas, pedreiros, etc.). O usuário pode buscar profissionais, agendar serviços, trocar mensagens, avaliar atendimentos e gerenciar pagamentos — tudo em um só lugar.

---

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Execução](#configuração-e-execução)
  - [Banco de Dados](#1-banco-de-dados)
  - [Backend](#2-backend)
  - [Frontend](#3-frontend)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Navegação das Páginas](#navegação-das-páginas)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Licença](#licença)

---

## Visão Geral

```
Cliente / Prestador
       │
       ▼
  Next.js (Frontend) :3001
       │  REST API
       ▼
  Express (Backend) :3002
       │
       ▼
  PostgreSQL :5432  +  Redis :6379
```

- **Frontend** — interface web construída com Next.js 16 e Tailwind CSS  
- **Backend** — API REST em Express com autenticação JWT  
- **Banco de dados** — PostgreSQL 15 (dados) + Redis 7 (cache / sessões)

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript, JWT, Bcrypt, Multer, Nodemailer |
| Banco | PostgreSQL 15, Redis 7 |
| Infra | Docker, Docker Compose, pgAdmin 4 |
| Testes | Jest |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 20
- [Docker](https://www.docker.com/) + Docker Compose
- [Git](https://git-scm.com/)

---

## Configuração e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/LkS-305/Projeto_PI_5-periodo.git
cd Projeto_PI_5-periodo
```

---

### 2. Banco de Dados

O banco sobe via Docker Compose. **Execute dentro da pasta `backend/`:**

```bash
cd backend
docker compose up -d
```

Isso sobe três containers:

| Container | O que é | Porta |
|-----------|---------|-------|
| `pi_postgres` | PostgreSQL 15 | `5432` |
| `pi_redis` | Redis 7 | `6379` |
| `pi_pgadmin` | Interface visual do banco | `8080` |

O banco é criado e populado automaticamente pelo `init.sql` e `populate.sql`.

Para parar os containers:

```bash
docker compose down
```

#### Se `/health` ou o backend der `28P01` (falha de autenticação)

1. **Confirma que o Postgres do projeto está a correr** — abre o Docker Desktop e, na pasta `backend`, executa `docker compose ps`. O container `pi_postgres` deve estar **Up** e a mapear `5432:5432`.
2. **Outro PostgreSQL na mesma porta** — se tiveres Postgres instalado no Windows a ouvir na **5432**, o Node liga a esse (com outra senha para `postgres`). Soluções: para o serviço local, ou muda a porta no `docker-compose.yml` (ex. `5433:5432`) e no `.env` usa `DB_PORT=5433`.
3. **Volume antigo do Docker** — a password `POSTGRES_PASSWORD` só se aplica na **primeira** criação do volume. Se já criaste o volume com outra senha, altera a password dentro do container ou recria o volume (`docker compose down -v` apaga dados; só em desenvolvimento).

Credenciais do **compose** deste repo: utilizador `postgres`, password `postgre123` (atenção ao “postgre”), base `projeto_pi`.

#### Se aparecer `database "projeto_pi" does not exist` (código Postgres `3D000`)

Isto acontece quando ligas a um **Postgres local** (ex. porta 5433) onde **ainda não criaste** a base `projeto_pi`.

- **Opção A — Criar a base** (ligado ao mesmo servidor que o `.env`):

  ```sql
  CREATE DATABASE projeto_pi;
  ```

  Depois importa o schema: na pasta `backend`, com Postgres acessível, corre `npm run db:setup` (usa `migrate.ts` e os SQL em `src/infra/database/`) ou executa manualmente `init.sql` e `populate.sql` no pgAdmin/psql.

- **Opção B — Usar o Postgres do Docker** do projeto (`docker compose up -d` na pasta `backend`): a base `projeto_pi` é criada na primeira subida e os scripts em `docker-entrypoint-initdb.d` correm sozinhos.

- **Opção C — Teste rápido só do `/health`**: no `.env` podes temporariamente usar `DB_DATABASE=postgres` (a base `postgres` existe por defeito), mas a API do projeto espera tabelas do `init.sql` em `projeto_pi`.

---

### 3. Backend

```bash
# dentro de backend/
npm install
npm run dev
```

API disponível em **`http://localhost:3002`**

Verifique se está no ar:

```bash
curl http://localhost:3002/health
```

---

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse em **`http://localhost:3001`**

---

## Variáveis de Ambiente

### Backend — `backend/.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=projeto_pi
DB_USER=postgres
DB_PASSWORD=postgre123
```

#### Logs e métricas (observabilidade)

| Variável | Efeito |
|----------|--------|
| `LOG_REQUEST_BODY` | Se `0` ou `false`, não inclui corpo da requisição nos logs (default: ligado, com sanitização de senhas/tokens). |
| `LOG_COLORS` | Se `0` ou `false`, desativa cores no log legível do middleware. |
| `METRICS_SECRET` | Se definido, os endpoints abaixo exigem o header **`X-Metrics-Secret`** com o mesmo valor. |
| `LOG_SLOW_QUERY_MS` | Se > `0`, regista em nível **info** consultas `pool.query` que demoram ≥ esse valor (ms). |
| `LOG_DB_NOTICE` | Se `1` ou `true`, avisos do Postgres (`NOTICE`) vão para JSON (`db.client.notice`); senão mantêm saída colorida no console. |
| `LOG_DEBUG` | Se `1` ou `true`, ativa eventos `debug` no logger (poucos por defeito). |

Todas as falhas de **`pool.query`** (repositórios, `/health`, migrações) geram JSON: `db.pool.query` (erro) ou `db.pool.query.unique_violation` (código Postgres `23505`).

Endpoints internos (montados em `/internal`, fora do rate limit global):

- **`GET /internal/metrics`** — JSON com contadores (`success`, erros 4xx/5xx, `noResponse`, etc.) e amostras recentes.
- **`GET /internal/metrics/stream`** — SSE com o mesmo snapshot a cada ~2 segundos (útil para ferramentas que suportam SSE; no browser costuma ser mais simples fazer polling no `/internal/metrics`).

Exemplo com `curl`:

```bash
curl -s http://localhost:3002/internal/metrics
# com segredo:
curl -s -H "X-Metrics-Secret: seu_segredo" http://localhost:3002/internal/metrics
```

### Frontend — `frontend/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
# Opcional: se o backend usar METRICS_SECRET, define o mesmo valor para o painel de métricas.
NEXT_PUBLIC_METRICS_SECRET=
```

Ficheiros de exemplo: **`backend/.env.example`** e **`frontend/.env.example`** (copiar para `.env` / `.env.local`).

### Painel de métricas (desenvolvimento)

Com o backend a correr, abre **`http://localhost:3001/dev/metrics`** no frontend: polling a cada 2s em `GET /internal/metrics` (usa `NEXT_PUBLIC_API_URL` e, se necessário, `NEXT_PUBLIC_METRICS_SECRET`).


---

## Navegação das Páginas

```
/                  → Página inicial (landing)
│
├── /register      → Cadastro (4 etapas: dados, endereço, verificação, documentos)
├── /login         → Login
│
└── (autenticado)
    ├── /dashboard → Painel principal com resumo de atividades
    ├── /explore   → Busca e filtro de prestadores de serviços
    ├── /services  → Gerenciamento dos seus serviços
    ├── /bookings  → Agendamentos (histórico e próximos)
    ├── /messages  → Chat com clientes / prestadores
    ├── /ratings   → Avaliações recebidas e enviadas
    ├── /wallet    → Carteira e histórico financeiro
    ├── /profile   → Perfil do usuário (editar nome, foto)
    └── /settings  → Configurações da conta
```

### Fluxo de cadastro

```
/register
  ├── Seção 1 — Nome, celular, e-mail, data de nascimento
  ├── Seção 2 — CEP, número do endereço, senha
  ├── Seção 3 — Verificação por código (SMS / e-mail)
  └── Seção 4 — Envio de documento (RG/CPF/CNH) + selfie
        └── → redireciona para /login
```

---

## Scripts Disponíveis

### Backend

```bash
npm run dev          # inicia em modo desenvolvimento (hot reload)
npm run build        # compila TypeScript
npm run start        # inicia versão compilada
npm run test         # roda todos os testes (Jest)
npm run test:api     # testa endpoints reais (servidor deve estar rodando)
npm run test:servicos # testa endpoints de serviços, prestador e carteira
```

### Frontend

```bash
npm run dev          # inicia em modo desenvolvimento
npm run build        # gera build de produção
npm run start        # inicia build de produção
```

---

## Licença

Este projeto está sob a licença **MIT**.

```
MIT License

Copyright (c) 2025 DOMI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
