import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

const transactionSelect = {
  id: true,
  description: true,
  amount: true,
  type: true,
  date: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: { id: true, name: true, description: true },
  },
} satisfies Prisma.TransactionSelect;

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    const category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException(
        'Category not found or does not belong to your user',
      );
    }

    return this.prisma.transaction.create({
      data: {
        description: dto.description,
        amount: dto.amount,
        type: dto.type,
        date: new Date(dto.date),
        userId,
        categoryId: dto.categoryId,
      },
      select: transactionSelect,
    });
  }

  async findAll(userId: string, filters: FilterTransactionDto) {
    const {
      type,
      categoryId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = filters;

    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        select: transactionSelect,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      select: transactionSelect,
    });

    if (!transaction) {
      throw new NotFoundException(
        'Transaction not found or does not belong to your user',
      );
    }

    return transaction;
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    await this.findOne(userId, id);

    const categoryId = (dto as { categoryId?: string }).categoryId;

    if (categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: categoryId, userId },
      });

      if (!category) {
        throw new ForbiddenException(
          'Category not found or does not belong to your user',
        );
      }
    }

    const { date, ...rest } = dto as UpdateTransactionDto & { date?: string };

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...rest,
        ...(date && { date: new Date(date) }),
      },
      select: transactionSelect,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.transaction.delete({ where: { id } });

    return { message: 'Transaction removed successfully' };
  }
}
