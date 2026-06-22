import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  transactionSchema,
  type TransactionFormData,
} from '@/lib/transaction.schema';
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionType,
} from '@/types/transaction.types';

interface CategoryOption {
  id: string;
  name: string;
}

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Transaction | null;
  categories?: CategoryOption[];
  isPending: boolean;
  onSubmit: (payload: CreateTransactionPayload) => void;
}

const EMPTY_FORM: Partial<TransactionFormData> = {
  description: '',
  amount: '',
  type: undefined,
  date: '',
  categoryId: '',
};

export function TransactionFormDialog({
  open,
  onOpenChange,
  editing,
  categories,
  isPending,
  onSubmit,
}: TransactionFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({ resolver: zodResolver(transactionSchema) });

  useEffect(() => {
    if (!open) return;
    if (editing) {
      reset({
        description: editing.description,
        amount: String(editing.amount),
        type: editing.type,
        date: editing.date.slice(0, 10),
        categoryId: editing.category.id,
      });
    } else {
      reset(EMPTY_FORM);
    }
  }, [open, editing, reset]);

  const submit = (formData: TransactionFormData) => {
    onSubmit({
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date(formData.date).toISOString(),
      categoryId: formData.categoryId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
          <DialogDescription>
            {editing ? 'Atualize os dados da transação.' : 'Preencha os dados para registrar.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
