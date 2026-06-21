import { api } from './client';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/types/category.types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return data.data;
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await api.get<{ success: boolean; data: Category }>(`/categories/${id}`);
    return data.data;
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await api.post<{ success: boolean; data: Category }>('/categories', payload);
    return data.data;
  },

  update: async (id: string, payload: UpdateCategoryPayload): Promise<Category> => {
    const { data } = await api.patch<{ success: boolean; data: Category }>(`/categories/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};