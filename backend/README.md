# Fintech Expenses — Backend

API REST de gestão financeira corporativa construída com NestJS e TypeScript.

## Stack

- **NestJS** com TypeScript strict
- **Prisma ORM** + **PostgreSQL**
- **JWT** via `@nestjs/jwt` + `passport-jwt`
- **class-validator** + **class-transformer**
- **Scalar** em `/reference`
- **Docker Compose** para o banco local

---

## Pré-requisitos

- Node.js 20.19+ / 22+ (exigido pelo Prisma 7)
- npm 10+
- Docker e Docker Compose

---

## Como rodar localmente

### 1. Clone e instale as dependências

```bash
git clone https://github.com/jefferson-moraiis/fintech-expenses-challenge.git
cd fintech-expenses-challenge
cd backend
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` se necessário — os valores padrão já funcionam com o Docker Compose.

### 3. Suba o banco com Docker

```bash
docker compose up -d
```

PostgreSQL disponível em `localhost:5435`.  
Adminer (GUI) disponível em `http://localhost:8080`.

### 4. Execute as migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Popule o banco com o seed

```bash
npm run prisma:seed
```

### 6. Inicie o servidor

```bash
npm run start:dev
```

API em `http://localhost:3000`  
Scalar em `http://localhost:3000/reference`

---

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | `postgresql://postgres:postgres@localhost:5435/fintech_db` |
| `JWT_SECRET` | Segredo para assinar tokens JWT | — |
| `PORT` | Porta do servidor | `3000` |
| `CORS_ORIGIN` | Origem(ns) do frontend permitida(s) pelo CORS (vazio = todas) | `http://localhost:5173` |

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/fintech_db?schema=public"
JWT_SECRET="troque-em-producao"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

---

## Endpoints

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário | ❌ |
| `POST` | `/auth/login` | Login — retorna `access_token` | ❌ |
| `GET` | `/categories` | Lista categorias do usuário | ✅ |
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

### Filtros em `GET /transactions`

| Param | Tipo | Descrição |
|---|---|---|
| `type` | `INCOME` \| `EXPENSE` | Filtra por tipo |
| `categoryId` | `uuid` | Filtra por categoria |
| `startDate` | `YYYY-MM-DD` | Data inicial do período |
| `endDate` | `YYYY-MM-DD` | Data final do período |
| `page` | `number` | Página (padrão: 1) |
| `limit` | `number` | Itens por página (padrão: 10, máx: 100) |

---

## Autenticação no Scalar 

1. Acesse `http://localhost:3000/reference`
2. Execute `POST /auth/login` e copie o `access_token`
3. Clique em **Authorize** (canto superior direito)
4. Cole o token e confirme

---

## Credenciais do seed

```
E-mail: admin@fintech.com
Senha:  Admin@123
```

---

## Testes

```bash
# unit tests
npm run test

# cobertura
npm run test:cov

# e2e
npm run test:e2e
```

---

## Estrutura

```
src/
├── auth/
│   ├── decorators/          # @CurrentUser()
│   ├── dto/                 # LoginDto
│   ├── guards/jwt/          # JwtAuthGuard
│   ├── interfaces/          # JwtPayload
│   ├── strategies/          # JwtStrategy
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── categories/
│   ├── dto/
│   ├── categories.controller.ts
│   ├── categories.module.ts
│   └── categories.service.ts
├── common/
│   ├── filters/http-exception/   # Respostas de erro padronizadas
│   ├── interceptors/response/    # Envelope de resposta global
│   └── pipes/parse-date/         # Transformação de datas em query params
├── dashboard/
│   ├── dashboard.controller.ts
│   ├── dashboard.module.ts
│   └── dashboard.service.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── transactions/
│   ├── dto/
│   ├── transactions.controller.ts
│   ├── transactions.module.ts
│   └── transactions.service.ts
├── users/
│   ├── dto/
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts
└── main.ts
```

---

## Deploy

Aplicação deployada em: **https://fintech-expenses-backend.railway.app**
