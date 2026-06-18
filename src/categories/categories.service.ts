import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCategoryDto) {
    const categoryExist = await this.prisma.category.findUnique({
      where: { name_userId: { name: dto.name, userId } },
    });
    if (categoryExist) {
      throw new ConflictException(`Category name already exists ${dto.name}`);
    }
    return await this.prisma.category.create({
      data: { ...dto, userId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { transactions: true } },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { transactions: true } },
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(userId: string, id: string, dto: CreateCategoryDto) {
    await this.findOne(userId, id);
    if (dto.name) {
      const categoryExist = await this.prisma.category.findUnique({
        where: { name_userId: { name: dto.name, userId } },
      });
      if (categoryExist) {
        throw new ConflictException(`Category name already exists ${dto.name}`);
      }
    }
    return await this.prisma.category.update({
      where: { id },
      data: { ...dto },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
