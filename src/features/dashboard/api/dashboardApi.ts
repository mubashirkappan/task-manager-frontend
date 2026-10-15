import apiClient from '../../../api/client';
import type { AdminDashboard, UserDashboard } from '../types';

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const { data } = await apiClient.get<AdminDashboard>('/dashboard/admin');
  return data;
};

export const getUserDashboard = async (): Promise<UserDashboard> => {
  const { data } = await apiClient.get<UserDashboard>('/dashboard/user');
  return data;
};
