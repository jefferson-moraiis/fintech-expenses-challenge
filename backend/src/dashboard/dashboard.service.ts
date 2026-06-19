import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string, filters: DashboardFilters = {}) {
    const { startDate, endDate } = filters;

    const dateFilter =
      startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {};

    const baseWhere = { userId, ...dateFilter };

    const [incomeAgg, expenseAgg, topCategories] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...baseWhere, type: TransactionType.INCOME },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.transaction.aggregate({
        where: { ...baseWhere, type: TransactionType.EXPENSE },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { ...baseWhere, type: TransactionType.EXPENSE },
        _sum: { amount: true },
        _count: true,
        orderBy: { _sum: { amount: 'desc' } },
        take: 3,
      }),
    ]);

    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const totalExpense = Number(expenseAgg._sum.amount ?? 0);

    const categoryIds = topCategories.map((t) => t.categoryId);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const topExpenseCategories = topCategories.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId) ?? 'Category Deleted',
      totalAmount: Number(item._sum?.amount ?? 0),
      transactionCount: item._count,
    }));

    return {
      balance: parseFloat((totalIncome - totalExpense).toFixed(2)),
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      transactionCount: {
        income: incomeAgg._count,
        expense: expenseAgg._count,
        total: incomeAgg._count + expenseAgg._count,
      },
      topExpenseCategories,
      period: {
        startDate: startDate ?? null,
        endDate: endDate ?? null,
      },
    };
  }
}
