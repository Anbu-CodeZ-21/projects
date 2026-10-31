import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ allowedRole, children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading SkillBridge...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    // Redirect to the appropriate dashboard for the user's role
    const targetDashboard = user?.role === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}
