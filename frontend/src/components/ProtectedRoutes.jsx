import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'VENDOR' || user.role === 'PROVIDER') {
      return <Navigate to="/vendor/dashboard" replace />;
    } else if (user.role === 'CUSTOMER') {
      return <Navigate to="/customer/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
