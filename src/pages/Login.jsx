import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Sparkles, UserCheck, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validators';
import Logo from '../components/Logo';

export default function Login() {
  const [role, setRole] = useState('freelancer'); // 'freelancer' | 'client'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (role === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validation = validateLoginForm({ email, password, role });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password, role);
    setIsSubmitting(false);

    if (result.success) {
      navigate(role === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard', { replace: true });
    } else {
      setGeneralError(result.message);
    }
  };

  const handleDemoLogin = (targetRole) => {
    quickLogin(targetRole);
    navigate(targetRole === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard', { replace: true });
  };

  return (
    <div className="sb-container sb-container-narrow" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Logo size="lg" showTagline={true} />
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1.02rem', maxWidth: '480px', margin: '0 auto' }}>
          Sign in to access your projects, submit verified deliverables, or manage active proposals.
        </p>
      </div>

      <div className="sb-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.25rem' }}>
        {/* Role Toggle Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--color-cream)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setRole('freelancer');
              setGeneralError('');
            }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              backgroundColor: role === 'freelancer' ? 'var(--color-emerald)' : 'transparent',
              color: role === 'freelancer' ? 'var(--color-white)' : 'var(--color-charcoal)',
              transition: 'all 0.15s ease',
            }}
          >
            <UserCheck size={16} />
            <span>Freelancer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('client');
              setGeneralError('');
            }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              backgroundColor: role === 'client' ? 'var(--color-terracotta)' : 'transparent',
              color: role === 'client' ? 'var(--color-white)' : 'var(--color-charcoal)',
              transition: 'all 0.15s ease',
            }}
          >
            <Building2 size={16} />
            <span>Client</span>
          </button>
        </div>

        {generalError && (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger-text)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              {role === 'freelancer' ? 'Freelancer Email' : 'Client Work Email'}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder={role === 'freelancer' ? 'freelancer@skillbridge.in' : 'client@skillbridge.in'}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>
                Password
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>
                Demo pass: <code>password123</code>
              </span>
            </div>
            <div className="password-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="Enter your password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn ${role === 'freelancer' ? 'btn-emerald' : 'btn-terracotta'} btn-lg btn-block`}
            style={{ marginTop: '1.25rem', gap: '0.5rem' }}
          >
            <LogIn size={18} />
            <span>{isSubmitting ? 'Signing in...' : `Log In as ${role === 'freelancer' ? 'Freelancer' : 'Client'}`}</span>
          </button>
        </form>

        {/* 1-Click Instant Demo Login Helper */}
        <div
          style={{
            margin: '2rem 0 1.25rem',
            padding: '1.15rem',
            backgroundColor: 'var(--color-cream)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.65rem' }}>
            <Sparkles size={14} color="#B59344" />
            <span>Instant Demo Logins (1-Click Test)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('freelancer')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', textAlign: 'left', gap: '0.5rem', backgroundColor: 'var(--color-white)' }}
            >
              <UserCheck size={14} color="var(--color-emerald)" />
              <span>Demo Freelancer: <strong>Arjun Sharma</strong> (MERN Specialist)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('client')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', textAlign: 'left', gap: '0.5rem', backgroundColor: 'var(--color-white)' }}
            >
              <Building2 size={14} color="var(--color-terracotta)" />
              <span>Demo Client: <strong>TechNova Solutions</strong> (Priya Nair)</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-muted-text)' }}>
          Don't have an account yet?{' '}
          <Link to="/choose-role" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
