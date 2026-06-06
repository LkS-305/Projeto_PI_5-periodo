# DOMI — Plataforma de Serviços e Agendamentos

DOMI é uma plataforma web que conecta **clientes** a **prestadores de serviços** (diaristas, eletricistas, pedreiros, etc.). O usuário pode buscar profissionais, agendar serviços, trocar mensagens, avaliar atendimentos e gerenciar pagamentos — tudo em um só lugar.

---

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Execução](#configuração-e-execução)
  - [Clone o repositório](#clone-o-repositório)
  - [1. Banco de Dados](#1-banco-de-dados)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
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

### Clone o repositório

```bash
git clone https://github.com/LkS-305/Projeto_PI_5-periodo.git
cd Projeto_PI_5-periodo
```

---

### 1. Banco de Dados

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

---

### 2. Backend

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

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse em **`http://localhost:3001`**

---

## Variáveis de Ambiente

### Backend — `backend/.env`



### Frontend — `frontend/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

---

## Navegação das Páginas

```
/                      → Página inicial (landing)
│
├── /register          → Cadastro (4 etapas: dados, endereço, verificação, documentos)
├── /login             → Login
│
└── (autenticado)
    ├── /home          → Página principal pós-login
    ├── /dashboard     → Painel financeiro (saldos, transações)
    ├── /explore       → Busca e filtro de prestadores de serviços
    ├── /services      → Gerenciamento dos seus serviços
    ├── /bookings      → Agendamentos (histórico e próximos)
    ├── /contracts     → Contratos e status dos serviços contratados
    ├── /demand        → Solicitar um serviço (criar demanda)
    ├── /messages      → Chat com clientes / prestadores
    ├── /portifolio    → Portfólio do prestador
    ├── /profile       → Perfil do usuário (editar nome, foto)
    ├── /settings      → Configurações da conta
    └── /become-prestador → Cadastro como prestador de serviços
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
