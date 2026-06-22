import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transactionsApi } from '@/api/transactions';
import type {
  CreateTransactionPayload,
  TransactionFilters,
  UpdateTransactionPayload,
} from '@/types/transaction.types';

export const TRANSACTIONS_KEY = ['transactions'] as const;
export const DASHBOARD_KEY = ['dashboard'] as const;

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: [...TRANSACTIONS_KEY, filters],
    queryFn: () => transactionsApi.getAll(filters),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: [...TRANSACTIONS_KEY, id],
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      toast.success('Transação criada com sucesso!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message ?? 'Erro ao criar transação';
      toast.error(message);
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      transactionsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      toast.success('Transação atualizada!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message ?? 'Erro ao atualizar transação';
      toast.error(message);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      toast.success('Transação removida!');
    },
    onError: () => {
      toast.error('Erro ao remover transação');
    },
  });
}