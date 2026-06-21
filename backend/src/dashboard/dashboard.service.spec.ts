import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

const userId = 'user-uuid-123';

const mockPrisma = {
  transaction: {
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
  category: {
    findMany: jest.fn(),
  },
};

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  describe('getSummary', () => {
    it('should return the financial summary correctly', async () => {
      mockPrisma.transaction.aggregate
        .mockResolvedValueOnce({
          _sum: { amount: 5000 },
          _count: 3,
        })
        .mockResolvedValueOnce({
          _sum: { amount: 2000 },
          _count: 2,
        });

      mockPrisma.transaction.groupBy.mockResolvedValue([
        {
          categoryId: 'cat-uuid-123',
          _sum: { amount: 2000 },
          _count: 2,
        },
      ]);

      mockPrisma.category.findMany.mockResolvedValue([
        {
          id: 'cat-uuid-123',
          name: 'Food',
        },
      ]);

      const result = await service.getSummary(userId);

      expect(result.balance).toBe(3000);
      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpense).toBe(2000);
      expect(result.transactionCount.total).toBe(5);
      expect(result.topExpenseCategories).toHaveLength(1);
      expect(result.topExpenseCategories[0].categoryName).toBe('Food');
    });

    it('should return a zero balance when there are no transactions', async () => {
      mockPrisma.transaction.aggregate
        .mockResolvedValueOnce({
          _sum: { amount: null },
          _count: 0,
        })
        .mockResolvedValueOnce({
          _sum: { amount: null },
          _count: 0,
        });

      mockPrisma.transaction.groupBy.mockResolvedValue([]);
      mockPrisma.category.findMany.mockResolvedValue([]);

      const result = await service.getSummary(userId);

      expect(result.balance).toBe(0);
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpense).toBe(0);
      expect(result.topExpenseCategories).toHaveLength(0);
    });

    it('should filter by date range when startDate and endDate are provided', async () => {
      mockPrisma.transaction.aggregate
        .mockResolvedValueOnce({
          _sum: { amount: 1000 },
          _count: 1,
        })
        .mockResolvedValueOnce({
          _sum: { amount: 500 },
          _count: 1,
        });

      mockPrisma.transaction.groupBy.mockResolvedValue([]);
      mockPrisma.category.findMany.mockResolvedValue([]);

      const result = await service.getSummary(userId, {
        startDate: '2026-06-01',
        endDate: '2026-06-30',
      });

      expect(result.period.startDate).toBe('2026-06-01');
      expect(result.period.endDate).toBe('2026-06-30');
    });
  });
});
