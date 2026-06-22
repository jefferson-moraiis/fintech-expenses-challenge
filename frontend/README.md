# Fintech Expenses — Frontend

Interface de gestão financeira corporativa construída com React e TypeScript.

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite** — bundler
- **shadcn/ui** — componentes de UI
- **Tailwind CSS** — estilização
- **TanStack Query v5** — server state (cache, loading, refetch)
- **React Hook Form** + **Zod** — formulários com validação tipada
- **React Router v6** — roteamento com rotas protegidas
- **Axios** — cliente HTTP com interceptor JWT
- **Sonner** — toasts de feedback

---

## Decisão de estado

**React Query** para server state — dados que vêm da API (transações, categorias, dashboard). Oferece cache automático, invalidação por chave e estados de loading/error nativos sem boilerplate.

**Context API** apenas para auth state — token e dados do usuário logado. É o único estado verdadeiramente global de cliente.

Essa separação evita Redux e mantém o código simples e idiomático.

---

## Pré-requisitos

- Node.js 20.19+ / 22+
- npm 10+
- Backend rodando em `http://localhost:3000`

---

## Como rodar localmente

### 1. Clone e instale as dependências

```bash
git clone https://github.com/jefferson-moraiis/fintech-expenses-challenge.git
cd fintech-expenses-challenge
cd frontend
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Frontend em `http://localhost:5173`

---

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API | `http://localhost:3000` |

---

## Scripts

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run preview    # preview do build
npm run lint       # lint
```

---

## Estrutura

```
src/
├── api/                  # clientes Axios por recurso
│   ├── auth.ts
│   ├── category.ts
│   ├── transactions.ts
│   ├── dashboard.ts
│   └── client.ts         # instância Axios com interceptor JWT
├── components/
│   ├── ui/               # componentes shadcn/ui
│   └── layout/           # componentes layout
├── contexts/
│   └── auth.context.tsx  # token + user + logout
|   └── useAuth.ts
├── hooks/                # hooks de React Query por recurso
│   ├── use-auth.ts
│   ├── use-categories.ts
│   ├── use-dashboard.ts
│   ├── use-mobile.ts
│   └── use-transactions.ts
├── pages/
│   ├── Login/
│   ├── Register/
│   ├── Dashboard/
│   ├── Transactions/
│   └── Categories/
├── types/                # interfaces TypeScript do domínio
│   ├── auth.types.ts
│   ├── category.types.ts
│   ├── transaction.types.ts
│   └── dashboard.types.ts
├── App.tsx               # rotas + PrivateRoute
└── main.tsx
```

---

## Páginas

| Rota | Descrição | Auth |
|---|---|---|
| `/login` | Autenticação | ❌ |
| `/register` | Cadastro de novo usuário | ❌ |
| `/dashboard` | Saldo, entradas, saídas, top categorias | ✅ |
| `/transactions` | Listagem com filtros e paginação | ✅ |
| `/categories` | Gerenciamento de categorias | ✅ |

---

## Deploy

Aplicação deployada em: **https://fintech-expenses-challenge-pi.vercel.app**

---

## Credenciais para teste

```
E-mail: admin@email.com
Senha:  admin@123
```