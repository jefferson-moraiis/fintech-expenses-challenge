import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { categoriesApi } from '@/api/category';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '@/types/category.types';

export const CATEGORIES_KEY = ['categories'] as const;


export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => categoriesApi.getAll(),
  });
}


export function useCategory(id: string) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id, 
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      toast.success('Categoria criada com sucesso!');
    },
    onError: (error: { response?: { status?: number; data?: { message?: string } } }) => {
      if (error.response?.status === 409) {
        toast.error('Já existe uma categoria com esse nome');
      } else {
        const message = error.response?.data?.message ?? 'Erro ao criar categoria';
        toast.error(message);
      }
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      categoriesApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: [...CATEGORIES_KEY, id] });
      toast.success('Categoria atualizada!');
    },
    onError: (error: { response?: { status?: number; data?: { message?: string } } }) => {
      if (error.response?.status === 409) {
        toast.error('Já existe uma categoria com esse nome');
      } else {
        toast.error('Erro ao atualizar categoria');
      }
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      toast.success('Categoria removida!');
    },
    onError: () => {
      toast.error('Erro ao remover categoria');
    },
  });
}