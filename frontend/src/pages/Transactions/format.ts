export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
