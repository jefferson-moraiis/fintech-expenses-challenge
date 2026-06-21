import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';

describe('Fintech API (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let categoryId: string;

  const email = `jefferson-${Date.now()}@test.com`;
  const password = '123456';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('should register a user', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Jefferson',
          email,
          password,
        })
        .expect(201);
    });

    it('should login and return a JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password,
        })
        .expect(201);

      expect(response.body.access_token).toBeDefined();

      token = response.body.access_token;
    });
  });

  describe('Categories', () => {
    it('should create a category', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Salário',
          description: 'Entrada mensal',
        })
        .expect(201);

      // Ajuste conforme o formato da sua resposta
      categoryId = response.body.data?.id ?? response.body.id;
    });

    it('should list categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const categories = response.body.data ?? response.body;

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);

      if (!categoryId) {
        categoryId = categories[0].id;
      }
    });
  });

  describe('Transactions', () => {
    it('should create a transaction', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Salário Junho',
          description: 'Recebimento do salário de junho',
          amount: 3500,
          type: 'INCOME',
          date: new Date().toISOString(),
          categoryId,
        })
        .expect(201);
    });

    it('should list transactions', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });
});
