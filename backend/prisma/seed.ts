import 'dotenv/config';
import { PrismaClient, TransactionType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_USER = {
  name: 'Admin',
  email: 'admin@email.com',
  password: 'admin@123',
};

async function main() {
  const hashedPassword = bcrypt.hashSync(SEED_USER.password, 10);

  const user = await prisma.user.upsert({
    where: { email: SEED_USER.email },
    update: {},
    create: {
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hashedPassword,
    },
  });

  const categoryNames = [
    'Alimentação',
    'Transporte',
    'Fornecedor',
    'Receita de Cliente',
  ];

  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name_userId: { name, userId: user.id } },
        update: {},
        create: { name, userId: user.id },
      }),
    ),
  );

  const byName = (name: string) => {
    const category = categories.find((c) => c.name === name);
    if (!category) throw new Error(`Category not found: ${name}`);
    return category.id;
  };

  const existing = await prisma.transaction.count({
    where: { userId: user.id },
  });
  if (existing > 0) {
    console.log(`Seed: usuário já possui ${existing} transações, pulando.`);
  } else {
    await prisma.transaction.createMany({
      data: [
        {
          description: 'Pagamento de cliente — Projeto A',
          amount: 5000,
          type: TransactionType.INCOME,
          date: new Date('2026-06-01'),
          userId: user.id,
          categoryId: byName('Receita de Cliente'),
        },
        {
          description: 'Almoço com equipe',
          amount: 180.5,
          type: TransactionType.EXPENSE,
          date: new Date('2026-06-03'),
          userId: user.id,
          categoryId: byName('Alimentação'),
        },
        {
          description: 'Uber para reunião',
          amount: 42.9,
          type: TransactionType.EXPENSE,
          date: new Date('2026-06-05'),
          userId: user.id,
          categoryId: byName('Transporte'),
        },
        {
          description: 'Compra de insumos',
          amount: 1200,
          type: TransactionType.EXPENSE,
          date: new Date('2026-06-08'),
          userId: user.id,
          categoryId: byName('Fornecedor'),
        },
        {
          description: 'Pagamento de cliente — Projeto B',
          amount: 3200,
          type: TransactionType.INCOME,
          date: new Date('2026-06-10'),
          userId: user.id,
          categoryId: byName('Receita de Cliente'),
        },
      ],
    });
  }

  console.log('Seed concluído com sucesso.');
  console.log(`Usuário seed: ${SEED_USER.email} / ${SEED_USER.password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
