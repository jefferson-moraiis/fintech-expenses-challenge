import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppShell } from '@/components/layout';
import {
  MoreHorizontal, Plus, Filter, X, Loader2,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/use-transactions';
import { useCategories } from '@/hooks/use-categories';
import { transactionSchema, type TransactionFormData } from '@/lib/transaction.schema';
import type { Transaction, TransactionFilters, TransactionType } from '@/types/transaction.types';

// ── Helpers ───────────────────────────────────────────────────
function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

// ── Componente principal ──────────────────────────────────────
export default function TransactionPage() {
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 10 });
  const [draft, setDraft] = useState<TransactionFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const { data, isLoading, isError } = useTransactions(filters);
  const { data: categories } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({ resolver: zodResolver(transactionSchema) });

  // ── Dialog ──────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditing(null);
    reset({ description: '', amount: '', type: undefined, date: '', categoryId: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (t: Transaction) => {
    console.log(t)
    setEditing(t);
    console.log(t)
    reset({
      description: t.description,
      amount: String(t.amount),
      type: t.type,
      date: t.date.slice(0, 10),
      categoryId: t.category.id,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditing(null);
    reset();
  };

  const onSubmit = (formData: TransactionFormData) => {
    const payload = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date(formData.date).toISOString(),
      categoryId: formData.categoryId,
    };

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload },
        { onSuccess: handleClose },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: handleClose });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover esta transação?')) {
      deleteMutation.mutate(id);
    }
  };

  // ── Filtros ─────────────────────────────────────────────────
  const applyFilters = () => {
    setFilters({ ...draft, page: 1, limit: 10 });
  };

  const clearFilters = () => {
    setDraft({});
    setFilters({ page: 1, limit: 10 });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AppShell title="Transações">
      <div className="space-y-6">

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filtros</CardTitle>
            <CardDescription>Refine a lista por categoria, tipo e período.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1.5">
                <Label className="text-xs">Categoria</Label>
                <Select
                  value={draft.categoryId ?? 'all'}
                  onValueChange={(v) =>
                    setDraft((p) => ({ ...p, categoryId: v === 'all' ? undefined : v }))
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Tipo</Label>
                <Select
                  value={draft.type ?? 'all'}
                  onValueChange={(v) =>
                    setDraft((p) => ({
                      ...p,
                      type: v === 'all' ? undefined : (v as TransactionType),
                    }))
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="INCOME">Entrada</SelectItem>
                    <SelectItem value="EXPENSE">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Data inicial</Label>
                <Input
                  type="date"
                  value={draft.startDate ?? ''}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, startDate: e.target.value || undefined }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Data final</Label>
                <Input
                  type="date"
                  value={draft.endDate ?? ''}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, endDate: e.target.value || undefined }))
                  }
                />
              </div>

              <div className="flex items-end gap-2">
                <Button className="flex-1" onClick={applyFilters}>
                  <Filter className="h-4 w-4 mr-1" /> Filtrar
                </Button>
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" /> Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Transações</CardTitle>
              <CardDescription>
                {data?.meta.total ?? 0} registros encontrados
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-1" /> Nova Transação
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {isError && (
              <p className="px-4 py-6 text-sm text-center text-destructive">
                Erro ao carregar transações. Tente recarregar a página.
              </p>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : data?.data.length === 0
                  ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                          Nenhuma transação encontrada.
                        </TableCell>
                      </TableRow>
                    )
                  : data?.data.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.description}</TableCell>
                        <TableCell className="text-muted-foreground">{t.category.name}</TableCell>
                        <TableCell>
                          <Badge variant={t.type === 'INCOME' ? 'secondary' : 'outline'}>
                            {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(t.date)}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${t.type === 'EXPENSE' ? 'text-destructive' : ''}`}>
                          {t.type === 'EXPENSE' ? '- ' : '+ '}{fmt(t.amount)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenEdit(t)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(t.id)}
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>

            {/* Paginação */}
            {data && data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Página {data.meta.page} de {data.meta.totalPages}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={!data.meta.hasPrevPage}
                    onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={!data.meta.hasNextPage}
                    onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog criar / editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Atualize os dados da transação.' : 'Preencha os dados para registrar.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Ex: Pagamento fornecedor"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  {...register('amount')}
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && (
                  <p className="text-xs text-destructive">{errors.date.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select
                value={watch('type')}
                onValueChange={(v) => setValue('type', v as TransactionType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Entrada</SelectItem>
                  <SelectItem value="EXPENSE">Saída</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select
                value={watch('categoryId')}
                onValueChange={(v) => setValue('categoryId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                  : 'Salvar'
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}