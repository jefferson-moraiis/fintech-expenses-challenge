import { api } from './client';
import type {
  CreateTransactionPayload,
  PaginatedTransactions,
  Transaction,
  TransactionFilters,
  UpdateTransactionPayload,
} from '@/types/transaction.types';

interface Envelope<T> {
  success: boolean;
  data: T;
}

export const transactionsApi = {
  getAll: async (filters?: TransactionFilters): Promise<PaginatedTransactions> => {
    const { data } = await api.get<Envelope<PaginatedTransactions>>('/transactions', {
      params: filters,
    });
    return data.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const { data } = await api.get<Envelope<Transaction>>(`/transactions/${id}`);
    return data.data;
  },

  create: async (payload: CreateTransactionPayload): Promise<Transaction> => {
    const { data } = await api.post<Envelope<Transaction>>('/transactions', payload);
    return data.data;
  },

  update: async (id: string, payload: UpdateTransactionPayload): Promise<Transaction> => {
    const { data } = await api.patch<Envelope<Transaction>>(`/transactions/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};