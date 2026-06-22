import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

const userId = 'user-uuid-123';

const mockCategory = {
  id: 'uid-123',
  name: 'Food',
  description: 'Meal expenses',
  userId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  category: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);
      mockPrisma.category.create.mockResolvedValue(mockCategory);

      const result = await service.create(userId, {
        name: 'Food',
        description: 'Meal expenses',
      });

      expect(result.name).toBe('Food');
    });

    it('should throw ConflictException if category already exists', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);

      await expect(
        service.create(userId, { name: 'Food', description: '' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.findAll(userId);

      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return category', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);

      const result = await service.findOne(userId, mockCategory.id);

      expect(result.id).toBe(mockCategory.id);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne(userId, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      mockPrisma.category.findFirst
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce(null);

      mockPrisma.category.update.mockResolvedValue({
        ...mockCategory,
        name: 'Updated Category',
      });

      const result = await service.update(userId, mockCategory.id, {
        name: 'Updated Category',
      });

      expect(result.name).toBe('Updated Category');
    });

    it('should throw ConflictException if name already exists', async () => {
      mockPrisma.category.findFirst.mockResolvedValueOnce(mockCategory);

      mockPrisma.category.findUnique.mockResolvedValueOnce({
        ...mockCategory,
        id: 'other-id',
      });

      await expect(
        service.update(userId, mockCategory.id, { name: 'Food' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.update(userId, mockCategory.id, { name: 'Food' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove category', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);
      mockPrisma.category.delete.mockResolvedValue(mockCategory);

      const result = await service.remove(userId, mockCategory.id);

      expect(result.message).toBe('Category deleted successfully');
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);

      await expect(service.remove(userId, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
