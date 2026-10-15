import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { useMinimumLoading } from '../hooks/useMinimumLoading';
import { Spinner } from '../components/Spinner';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const showLoader = useMinimumLoading(isLoading);

  if (showLoader) return <Spinner label="Verifying session..." fullScreen />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
