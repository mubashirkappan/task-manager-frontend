import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

/** Must be nested inside ProtectedRoute, which already waits for the session. */
export const AdminRoute: React.FC = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/tasks" replace />;
};
