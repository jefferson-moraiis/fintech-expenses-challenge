# Fintech Expenses Challenge

Plataforma interna de gestão financeira corporativa — desafio técnico sênior.

**Stack:** NestJS · React.js · TypeScript · PostgreSQL · Prisma

---

## Decisões técnicas

### Backend
- **NestJS + TypeScript strict** — organização por módulos de domínio: `Auth`, `Users`, `Categories`, `Transactions`, `Dashboard`
- **Prisma ORM** — migrations versionadas, queries type-safe, tipagem automática das entidades
- **PostgreSQL** — banco relacional com suporte a `Decimal(12,2)` para precisão em valores financeiros
- **class-validator + class-transformer** — validação e transformação de tipos nos DTOs (`transform: true` no `ValidationPipe`)
- **passport-jwt** — strategy JWT desacoplada via `PassportModule`; o payload é mínimo (`id`, `name`, `email`) para não vazar dados sensíveis no token
- **`Promise.all` nas queries paralelas** — usado no `DashboardService` em vez de `prisma.$transaction` pois são leituras sem necessidade de atomicidade

### Frontend
- **React Query (TanStack Query v5)** — escolhido por ser especializado em server state: cache automático, invalidação por chave, loading/error states nativos. Elimina a necessidade de Redux ou Context manual para dados remotos
- **Context API** — cobre apenas o estado de autenticação (token + user), que é estado global real de cliente
- **React Hook Form + Zod** — formulários performáticos com validação de schema tipada end-to-end
- **React Router v6** — roteamento com `PrivateRoute` para rotas autenticadas
- **Sonner** — toasts leves para feedback visual de ações

### Infra
- **Docker Compose** — sobe PostgreSQL localmente sem instalar o banco na máquina
- **Railway** (backend) + **Vercel** (frontend) — deploy gratuito com CI/CD integrado ao GitHub

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/fintech-expenses-challenge.git
cd fintech-expenses-challenge
```

### 2. Suba o banco com Docker

```bash
docker compose up -d
```

PostgreSQL disponível em `localhost:5432`.  
Adminer (GUI) em `http://localhost:8080`.

### 3. Configure o backend

```bash
cd backend
cp .env.example .env
npm install
```

### 4. Execute as migrations e gere o Prisma Client

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Popule o banco com o seed

```bash
npm run prisma:seed
```

### 6. Inicie o backend

```bash
npm run start:dev
```

API em `http://localhost:3000`  
Swagger em `http://localhost:3000/docs`

### 7. Configure e inicie o frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

Frontend em `http://localhost:5173`

---

## Variáveis de ambiente

### Backend — `backend/.env`

| Variável | Descrição | Padrão |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | `postgresql://fintech:fintech123@localhost:5432/fintech_db` |
| `JWT_SECRET` | Segredo para assinar os tokens JWT | — |
| `PORT` | Porta do servidor | `3000` |
| `CORS_ORIGIN` | URL do frontend permitida pelo CORS | `http://localhost:5173` |

```env
DATABASE_URL="postgresql://fintech:fintech123@localhost:5432/fintech_db?schema=public"
JWT_SECRET="troque-em-producao"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

### Frontend — `frontend/.env`

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API | `http://localhost:3000` |

---

## Endpoints da API

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário | ❌ |
| `POST` | `/auth/login` | Login — retorna `access_token` | ❌ |
| `GET` | `/categories` | Lista categorias do usuário autenticado | ✅ |
| `POST` | `/categories` | Cria categoria | ✅ |
| `GET` | `/categories/:id` | Busca categoria por ID | ✅ |
| `PATCH` | `/categories/:id` | Atualiza categoria | ✅ |
| `DELETE` | `/categories/:id` | Remove categoria | ✅ |
| `GET` | `/transactions` | Lista transações com filtros e paginação | ✅ |
| `POST` | `/transactions` | Cria transação | ✅ |
| `GET` | `/transactions/:id` | Busca transação por ID | ✅ |
| `PATCH` | `/transactions/:id` | Atualiza transação | ✅ |
| `DELETE` | `/transactions/:id` | Remove transação | ✅ |
| `GET` | `/dashboard` | Saldo, entradas, saídas e top 3 categorias | ✅ |

### Filtros disponíveis em `GET /transactions`

| Query param | Tipo | Descrição |
|---|---|---|
| `type` | `INCOME` \| `EXPENSE` | Filtra por tipo |
| `categoryId` | `uuid` | Filtra por categoria |
| `startDate` | `ISO 8601` | Data inicial do período |
| `endDate` | `ISO 8601` | Data final do período |
| `page` | `number` | Página (padrão: 1) |
| `limit` | `number` | Itens por página (padrão: 10, máx: 100) |

---

## Credenciais do usuário seed

```
E-mail: admin@fintech.com
Senha:  Admin@123
```

---

## Deploy

| Serviço | URL |
|---|---|
| Backend | https://fintech-expenses-backend.railway.app |
| Frontend | https://fintech-expenses-challenge.vercel.app |

---

## Estrutura do projeto

```
fintech-expenses-challenge/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── src/
│       ├── auth/
│       │   ├── decorators/
│       │   │   └── current-user.decorator.ts
│       │   ├── dto/
│       │   │   └── login.dto.ts
│       │   ├── guards/
│       │   │   └── jwt/
│       │   │       └── jwt.guard.ts
│       │   ├── interfaces/
│       │   │   └── jwt-payload.interface.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   └── auth.service.ts
│       ├── categories/
│       │   ├── dto/
│       │   ├── categories.controller.ts
│       │   ├── categories.module.ts
│       │   └── categories.service.ts
│       ├── common/
│       │   ├── filters/
│       │   │   └── http-exception/
│       │   └── interceptors/
│       │       └── response/
│       ├── dashboard/
│       │   ├── dashboard.controller.ts
│       │   ├── dashboard.module.ts
│       │   └── dashboard.service.ts
│       ├── prisma/
│       │   ├── prisma.module.ts
│       │   └── prisma.service.ts
│       ├── transactions/
│       │   ├── dto/
│       │   ├── transactions.controller.ts
│       │   ├── transactions.module.ts
│       │   └── transactions.service.ts
│       ├── users/
│       │   ├── dto/
│       │   ├── users.module.ts
│       │   └── users.service.ts
│       ├── app.module.ts
│       └── main.ts
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── contexts/
        ├── hooks/
        ├── pages/
        ├── types/
        └── App.tsx
```