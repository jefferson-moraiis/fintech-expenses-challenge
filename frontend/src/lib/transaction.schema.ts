import { z } from 'zod';

export const transactionSchema = z.object({
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255),
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Valor deve ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Selecione o tipo',
  }),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().uuid('Selecione uma categoria'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;