import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

const userId = 'user-uuid-123';

const mockCategory = {
  id: 'cat-uuid-123',
  name: 'Food',
  userId,
};

const mockTransaction = {
  id: 'trans-uuid-123',
  description: 'Lunch',
  amount: 50.0,
  type: TransactionType.EXPENSE,
  date: new Date(),
  userId,
  categoryId: mockCategory.id,
  category: {
    id: mockCategory.id,
    name: mockCategory.name,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  transaction: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  category: {
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);
      mockPrisma.transaction.create.mockResolvedValue(mockTransaction);

      const result = await service.create(userId, {
        description: 'Lunch',
        amount: 50.0,
        type: TransactionType.EXPENSE,
        date: new Date().toISOString(),
        categoryId: mockCategory.id,
      });

      expect(result).toHaveProperty('description', 'Lunch');
      expect(mockPrisma.transaction.create).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if the category does not belong to the user', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.create(userId, {
          description: 'Lunch',
          amount: 50.0,
          type: TransactionType.EXPENSE,
          date: new Date().toISOString(),
          categoryId: 'other-user-category-id',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated user transactions', async () => {
      mockPrisma.$transaction.mockResolvedValue([1, [mockTransaction]]);

      const result = await service.findAll(userId, {
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('total', 1);
    });

    it('should filter transactions by INCOME type', async () => {
      mockPrisma.$transaction.mockResolvedValue([0, []]);

      const result = await service.findAll(userId, {
        type: TransactionType.INCOME,
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      mockPrisma.transaction.findFirst.mockResolvedValue(mockTransaction);

      const result = await service.findOne(userId, mockTransaction.id);

      expect(result).toHaveProperty('id', mockTransaction.id);
    });

    it('should throw NotFoundException if the transaction is not found', async () => {
      mockPrisma.transaction.findFirst.mockResolvedValue(null);

      await expect(service.findOne(userId, 'non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a transaction successfully', async () => {
      mockPrisma.transaction.findFirst.mockResolvedValue(mockTransaction);
      mockPrisma.transaction.delete.mockResolvedValue(mockTransaction);

      const result = await service.remove(userId, mockTransaction.id);

      expect(result).toHaveProperty('message');
    });

    it('should throw NotFoundException when removing a non-existent transaction', async () => {
      mockPrisma.transaction.findFirst.mockResolvedValue(null);

      await expect(service.remove(userId, 'non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
