import apiClient from '../../../api/client';
import type { DashboardStats } from '../types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await apiClient.get<DashboardStats>('/admin/stats');
  return data;
};
