import { Filter, X } from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type {
  TransactionFilters as Filters,
  TransactionType,
} from '@/types/transaction.types';

interface CategoryOption {
  id: string;
  name: string;
}

interface TransactionFiltersProps {
  draft: Filters;
  onDraftChange: (updater: (prev: Filters) => Filters) => void;
  categories?: CategoryOption[];
  onApply: () => void;
  onClear: () => void;
}

export function TransactionFilters({
  draft,
  onDraftChange,
  categories,
  onApply,
  onClear,
}: TransactionFiltersProps) {
  return (
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
                onDraftChange((p) => ({ ...p, categoryId: v === 'all' ? undefined : v }))
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
                onDraftChange((p) => ({
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
                onDraftChange((p) => ({ ...p, startDate: e.target.value || undefined }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Data final</Label>
            <Input
              type="date"
              value={draft.endDate ?? ''}
              onChange={(e) =>
                onDraftChange((p) => ({ ...p, endDate: e.target.value || undefined }))
              }
            />
          </div>

          <div className="flex items-end gap-2">
            <Button className="flex-1" onClick={onApply}>
              <Filter className="h-4 w-4 mr-1" /> Filtrar
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClear}>
              <X className="h-4 w-4 mr-1" /> Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
