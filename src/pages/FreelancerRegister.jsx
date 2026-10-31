import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserCheck, AlertCircle, ArrowRight, IndianRupee, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateFreelancerRegister } from '../utils/validators';
import Logo from '../components/Logo';

export default function FreelancerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    hourlyRate: 1200,
    experienceYears: 4,
    skills: 'React.js, Node.js, JavaScript, Tailwind CSS',
    location: 'Bengaluru, Karnataka',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerFreelancer } = useAuth();
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

    const validation = validateFreelancerRegister(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    const result = await registerFreelancer(formData);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/freelancer/dashboard');
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
            backgroundColor: 'var(--color-emerald-light)',
            color: 'var(--color-emerald)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <UserCheck size={15} /> Freelancer Registration
        </div>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}>Create Your Freelancer Account</h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
          Showcase your skills, set your hourly rate in INR (₹), and verify project deliverables with confidence.
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
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
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

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
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

          {/* Professional Headline */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Professional Headline / Title *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior MERN Stack & Next.js Developer"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Hourly Rate (INR) & Experience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="hourlyRate">
                Hourly Rate (₹ INR) *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-muted-text)', fontWeight: 700 }}>
                  ₹
                </span>
                <input
                  id="hourlyRate"
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="1500"
                  style={{ paddingLeft: '2rem' }}
                  className={`form-control ${errors.hourlyRate ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.hourlyRate && <span className="form-error">{errors.hourlyRate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experienceYears">
                Experience (Years)
              </label>
              <input
                id="experienceYears"
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                min="0"
                max="40"
                className="form-control"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label" htmlFor="skills">
              Key Skills (comma separated)
            </label>
            <input
              id="skills"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React.js, Node.js, MongoDB, Figma, Python"
              className="form-control"
            />
            <span className="form-hint">Enter your top technical skills so clients can discover your profile.</span>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              City, State (India)
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Chennai ,Tamil Nadu"
              className="form-control"
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              Brief Bio & Overview
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell clients about your background, projects you have completed, and your commitment to verified deliverables..."
              className="form-control"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-emerald btn-lg btn-block"
            style={{ marginTop: '1.25rem', gap: '0.5rem' }}
          >
            <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '2rem', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <p style={{ color: 'var(--color-muted-text)', marginBottom: '0.5rem' }}>
            Looking to hire freelancers instead?{' '}
            <Link to="/register/client" style={{ color: 'var(--color-terracotta)', fontWeight: 700 }}>
              Register as a Client
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
