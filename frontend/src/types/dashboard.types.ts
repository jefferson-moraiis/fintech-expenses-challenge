export interface TopExpenseCategory {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
}

export interface DashboardSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: {
    income: number;
    expense: number;
    total: number;
  };
  topExpenseCategories: TopExpenseCategory[];
  period: {
    startDate: string | null;
    endDate: string | null;
  };
}