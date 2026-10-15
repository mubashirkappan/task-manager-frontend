import React from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { AdminDashboardView } from '../components/AdminDashboardView';
import { UserDashboardView } from '../components/UserDashboardView';

/** Admins get the workspace-wide dashboard (/dashboard/admin), everyone else their own (/dashboard/user). */
export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboardView /> : <UserDashboardView />;
};
