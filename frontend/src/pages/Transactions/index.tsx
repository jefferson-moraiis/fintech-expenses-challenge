import { useState } from 'react';
import { AppShell } from '@/components/layout';

import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/use-transactions';
import { useCategories } from '@/hooks/use-categories';
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters as Filters,
} from '@/types/transaction.types';

import { TransactionFilters } from './components/TransactionFilters';
import { TransactionsTable } from './components/TransactionsTable';
import { TransactionFormDialog } from './components/TransactionFormDialog';

export default function TransactionPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 10 });
  const [draft, setDraft] = useState<Filters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const { data, isLoading, isError } = useTransactions(filters);
  const { data: categories } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleOpenCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setDialogOpen(true);
  };

  const handleSubmit = (payload: CreateTransactionPayload) => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover esta transação?')) {
      deleteMutation.mutate(id);
    }
  };

  const applyFilters = () => setFilters({ ...draft, page: 1, limit: 10 });

  const clearFilters = () => {
    setDraft({});
    setFilters({ page: 1, limit: 10 });
  };

  return (
    <AppShell title="Transações">
      <div className="space-y-6">
        <TransactionFilters
          draft={draft}
          onDraftChange={setDraft}
          categories={categories}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        <TransactionsTable
          data={data}
          isLoading={isLoading}
          isError={isError}
          onCreate={handleOpenCreate}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onPageChange={(page) => setFilters((p) => ({ ...p, page }))}
        />
      </div>

      <TransactionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        categories={categories}
        isPending={isPending}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}
