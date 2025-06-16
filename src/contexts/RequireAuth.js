import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in → redirect to /login, but remember where they tried to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in → render the child routes
  return <Outlet />;
}
