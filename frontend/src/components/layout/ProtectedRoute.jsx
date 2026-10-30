import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage text="Connecting to AGchat..." />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
