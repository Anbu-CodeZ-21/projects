import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateClientRegister } from '../utils/validators';
import Logo from '../components/Logo';

export default function ClientRegister() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: 'Logistics & Cloud SaaS',
    location: 'Mumbai, Maharashtra',
    website: '',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerClient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validation = validateClientRegister(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    const result = await registerClient(formData);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/client/dashboard');
    } else {
      setGeneralError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="sb-container sb-container-narrow" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Logo size="md" showTagline={true} />
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            backgroundColor: 'var(--color-gold-light)',
            color: 'var(--color-gold)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            border: '1px solid var(--color-gold-border)',
          }}
        >
          <Building2 size={15} /> Client / Employer Registration
        </div>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}>Create Your Client Account</h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
          Publish projects with transparent INR budgets, hire skilled freelancers, and review verified deliverables before payment.
        </p>
      </div>

      <div className="sb-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '2.25rem' }}>
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
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Contact Person Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Contact Person / Hiring Manager *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Anbu Chandru"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Company Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="companyName">
              Company or Startup Name *
            </label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. TechNova Solutions India"
              className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
            />
            {errors.companyName && <span className="form-error">{errors.companyName}</span>}
          </div>

          {/* Work Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Work Email Address *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="anbu@technova.example.com"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password & Confirm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
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

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Industry & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="industry">
                Industry / Domain
              </label>
              <input
                id="industry"
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Fintech, SaaS, Healthcare"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Headquarters Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Maharashtra"
                className="form-control"
              />
            </div>
          </div>

          {/* Website */}
          <div className="form-group">
            <label className="form-label" htmlFor="website">
              Company Website (Optional)
            </label>
            <input
              id="website"
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="form-control"
            />
          </div>

          {/* Bio / Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              About the Organization
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Brief description of your company, products, and what kinds of projects you hire for..."
              className="form-control"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-gold btn-lg btn-block"
            style={{ marginTop: '1.25rem', gap: '0.5rem' }}
          >
            <span>{isSubmitting ? 'Registering...' : 'Create Client Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '2rem', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <p style={{ color: 'var(--color-muted-text)', marginBottom: '0.5rem' }}>
            Want to work as a freelancer instead?{' '}
            <Link to="/register/freelancer" style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>
              Join as a Freelancer
            </Link>
          </p>
          <p style={{ color: 'var(--color-muted-text)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
