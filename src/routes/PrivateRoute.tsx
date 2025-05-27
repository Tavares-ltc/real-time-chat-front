import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';

interface PrivateRouteProps {
  children: JSX.Element
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
