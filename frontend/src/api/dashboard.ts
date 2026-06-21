import { api } from './client';
import type { DashboardSummary } from '@/types/dashboard.types';
 
interface Envelope<T> {
  success: boolean;
  data: T;
}
 
export const dashboardApi = {
  getSummary: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardSummary> => {
    const { data } = await api.get<Envelope<DashboardSummary>>('/dashboard', { params });
    return data.data;
  },
};
 