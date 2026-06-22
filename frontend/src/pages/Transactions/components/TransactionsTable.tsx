import {
  MoreHorizontal, Plus, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PaginatedTransactions, Transaction } from '@/types/transaction.types';
import { formatCurrency, formatDate } from '../format';

interface TransactionsTableProps {
  data?: PaginatedTransactions;
  isLoading: boolean;
  isError: boolean;
  onCreate: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function TransactionsTable({
  data,
  isLoading,
  isError,
  onCreate,
  onEdit,
  onDelete,
  onPageChange,
}: TransactionsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Transações</CardTitle>
          <CardDescription>
            {data?.meta.total ?? 0} registros encontrados
          </CardDescription>
        </div>
        <Button size="sm" onClick={onCreate}>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((t) => (
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
                    {t.type === 'EXPENSE' ? '- ' : '+ '}{formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(t)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(t.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
                onClick={() => onPageChange(data.meta.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={!data.meta.hasNextPage}
                onClick={() => onPageChange(data.meta.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
