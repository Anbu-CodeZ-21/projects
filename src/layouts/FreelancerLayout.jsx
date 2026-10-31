import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Sparkles } from 'lucide-react';

export default function FreelancerLayout() {
  const { user, isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Loading Freelancer Workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== 'freelancer') {
    return <Navigate to="/client/dashboard" replace />;
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          background: 'linear-gradient(90deg, #0D3B2E, #145A46)',
          color: 'var(--color-white)',
          padding: '0.65rem 0',
          fontSize: '0.82rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="sb-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                backgroundColor: 'var(--color-emerald)',
                color: 'var(--color-white)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.72rem',
                textTransform: 'uppercase',
              }}
            >
              Freelancer Mode
            </span>
            <span>Welcome back, <strong>{user?.name}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)' }}>
            <Sparkles size={14} />
            <span>Profile completion: <strong>{user?.profileCompletion || 90}%</strong></span>
          </div>
        </div>
      </div>
      <main className="sb-page-wrapper">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
