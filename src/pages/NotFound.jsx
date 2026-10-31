import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Briefcase, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div
      className="sb-container sb-container-narrow"
      style={{
        padding: '5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <Logo size="lg" showTagline={true} />
      </div>
      <div
        style={{
          width: '5.5rem',
          height: '5.5rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-cream)',
          color: 'var(--color-emerald)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Compass size={44} strokeWidth={1.8} />
      </div>

      <div
        style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-display)',
          lineHeight: 1,
          marginBottom: '0.75rem',
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Page Not Found</h1>

      <p style={{ color: 'var(--color-muted-text)', fontSize: '1.05rem', maxWidth: '460px', marginBottom: '2rem' }}>
        The page you are looking for doesn't exist, has been moved, or requires different account permissions to access.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ gap: '0.45rem' }}>
          <Home size={16} />
          <span>Return to Home</span>
        </Link>
        <Link to="/projects" className="btn btn-secondary" style={{ gap: '0.45rem' }}>
          <Briefcase size={16} />
          <span>Browse Projects</span>
        </Link>
      </div>
    </div>
  );
}
