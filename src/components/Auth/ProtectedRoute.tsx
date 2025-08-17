import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginForm />;
  }

  return <>{children}</>;
}