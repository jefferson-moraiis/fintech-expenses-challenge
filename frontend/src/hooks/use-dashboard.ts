import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';

export const DASHBOARD_KEY = ['dashboard'] as const;

export function useDashboard(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: [...DASHBOARD_KEY, params],
    queryFn: () => dashboardApi.getSummary(params),
  });
}