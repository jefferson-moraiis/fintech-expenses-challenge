import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { AppShell } from '@/components/layout/AppShell';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/use-dashboard';
import { useTransactions } from '@/hooks/use-transactions';

function fmt(v: number) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function StatCard({
  label, value, hint, icon, loading,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading
          ? <Skeleton className="h-7 w-36" />
          : <div className="text-2xl font-semibold tracking-tight">{value}</div>
        }
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" /> {hint}
        </p>
      </CardContent>
    </Card>
  );
}
export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { data: recentData, isLoading: recentLoading } = useTransactions({
    page: 1,
    limit: 5,
  });

  const topCategory = data?.topExpenseCategories?.[0];
  const totalExpense = data?.totalExpense ?? 0;

  const categoriesWithPct = (data?.topExpenseCategories ?? []).map((c) => ({
    ...c,
    pct: totalExpense > 0 ? Math.round((c.totalAmount / totalExpense) * 100) : 0,
  }));
  const chartData = [
    { mes: 'Entradas', entradas: data?.totalIncome ?? 0, saidas: 0 },
    { mes: 'Saídas', entradas: 0, saidas: data?.totalExpense ?? 0 },
    { mes: 'Saldo', entradas: Math.max(data?.balance ?? 0, 0), saidas: 0 },
  ];

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Saldo Atual"
            value={fmt(data?.balance ?? 0)}
            hint={`${data?.transactionCount.total ?? 0} transações no total`}
            icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
            loading={isLoading}
          />
          <StatCard
            label="Total de Entradas"
            value={fmt(data?.totalIncome ?? 0)}
            hint={`${data?.transactionCount.income ?? 0} transações`}
            icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
            loading={isLoading}
          />
          <StatCard
            label="Total de Saídas"
            value={fmt(data?.totalExpense ?? 0)}
            hint={`${data?.transactionCount.expense ?? 0} transações`}
            icon={<ArrowDownRight className="h-4 w-4 text-muted-foreground" />}
            loading={isLoading}
          />
          <StatCard
            label="Maior categoria"
            value={topCategory?.categoryName ?? '—'}
            hint={topCategory ? fmt(topCategory.totalAmount) : 'Sem saídas registradas'}
            icon={<PieIcon className="h-4 w-4 text-muted-foreground" />}
            loading={isLoading}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base">Fluxo de caixa</CardTitle>
              <CardDescription>Entradas e saídas do período atual</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] pl-0">
              {isLoading
                ? <Skeleton className="h-full w-full" />
                : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 4 }}>
                      <defs>
                        <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis
                        dataKey="mes"
                        stroke="currentColor"
                        className="text-xs text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="currentColor"
                        className="text-xs text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                        width={60}
                        tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v: number) => fmt(v)}
                      />
                      <Area type="monotone" dataKey="entradas" stroke="currentColor" fill="url(#in)" strokeWidth={2} />
                      <Area type="monotone" dataKey="saidas" stroke="currentColor" className="text-muted-foreground" fill="url(#out)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )
              }
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Resumo por categoria</CardTitle>
              <CardDescription>Distribuição das saídas no período</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-1.5 w-full" />
                    </div>
                  ))
                : categoriesWithPct.length === 0
                ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Nenhuma saída registrada ainda.
                    </p>
                  )
                : categoriesWithPct.map((c) => (
                    <div key={c.categoryId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{c.categoryName}</span>
                        <span className="text-muted-foreground">{fmt(c.totalAmount)}</span>
                      </div>
                      <Progress value={c.pct} className="h-1.5" />
                    </div>
                  ))
              }
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimas transações</CardTitle>
            <CardDescription>Movimentações recentes na conta corporativa</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : recentData?.data.length === 0
                  ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                          Nenhuma transação ainda.
                        </TableCell>
                      </TableRow>
                    )
                  : recentData?.data.map((t) => (
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
                          {t.type === 'EXPENSE' ? '- ' : '+ '}{fmt(Number(t.amount))}
                        </TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
