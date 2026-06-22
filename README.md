# 🚀 Fintech Expenses Challenge

Um sistema completo (Full-stack) de gestão financeira corporativa. Este projeto foi desenvolvido utilizando uma arquitetura baseada em **Monorepo**, contendo a API (Backend) e a Interface de Usuário (Frontend) no mesmo repositório.

## 🔗 Links de Produção

- **Frontend (Interface):** [Acessar Aplicação](https://fintech-expenses-challenge-pi.vercel.app)
- **Backend (API):** [Acessar API](https://fintech-expenses-backend.railway.app)
- **Documentação da API (Scalar):** [Acessar Docs](https://fintech-expenses-backend.railway.app/reference)

> ⚠️ Confirme que o link do backend está no ar antes de enviar — o frontend depende dele. Caso a URL do backend mude, atualize também o `VITE_API_URL` do deploy do frontend.

---

## 🏗️ Estrutura do Monorepo

O projeto está dividido em duas aplicações principais. Clique nos links abaixo para ler a documentação detalhada de cada stack:

- [**`/backend`**](./backend/README.md) — API RESTful desenvolvida com **NestJS, TypeScript (strict), Prisma ORM e PostgreSQL**.
- [**`/frontend`**](./frontend/README.md) — Aplicação web construída com **React 19, Vite, Tailwind CSS, shadcn/ui e TanStack Query**.

---

## 🛠️ Como rodar o projeto inteiro localmente

Você precisará do **Node.js 20.19+ / 22+** (Prisma 7 exige essa versão), **npm 10+** e **Docker** instalados.

### Opção A — Tudo via Docker Compose (recomendado)

Sobe Postgres, Adminer, backend (com migrations + seed automáticos) e frontend:

```bash
git clone https://github.com/jefferson-moraiis/fintech-expenses-challenge.git
cd fintech-expenses-challenge
docker compose up -d --build
```

- Frontend: `http://localhost:5173`
- Backend / API: `http://localhost:3000`
- Documentação (Scalar): `http://localhost:3000/reference`
- Adminer (GUI do banco): `http://localhost:8080`
- PostgreSQL: `localhost:5435`

### Opção B — Manualmente (backend e frontend separados)

Siga os passos detalhados em cada README:

1. **Banco:** `docker compose up -d postgres adminer`
2. **Backend:** veja [backend/README.md](./backend/README.md) — `.env`, migrations, seed e `npm run start:dev`.
3. **Frontend:** veja [frontend/README.md](./frontend/README.md) — `.env` e `npm run dev`.

---

## 🔑 Credenciais do seed (usuário de teste)

```
E-mail: admin@email.com
Senha:  admin@123
```

O seed também cria categorias (Alimentação, Transporte, Fornecedor, Receita de Cliente) e algumas transações de exemplo.

---

## 🧪 Testes

```bash
cd backend
npm run test       # unit
npm run test:e2e   # e2e
```
