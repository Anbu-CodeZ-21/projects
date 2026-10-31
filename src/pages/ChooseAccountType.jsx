import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, Building2, Check, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';
import Logo from '../components/Logo';

export default function ChooseAccountType() {
  const [selectedRole, setSelectedRole] = useState('freelancer');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === 'freelancer') {
      navigate('/register/freelancer');
    } else {
      navigate('/register/client');
    }
  };

  return (
    <div className="sb-container sb-container-narrow" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Logo size="lg" showTagline={true} />
        </div>
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--color-emerald)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Join SkillBridge Platform
        </span>
        <h1 style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '0.85rem' }}>
          Choose How You Want to Join
        </h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto' }}>
          Select the account type that best matches your goals. You'll receive a tailored dashboard and dedicated workflow.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Freelancer Card */}
        <div
          onClick={() => setSelectedRole('freelancer')}
          className="sb-card"
          style={{
            cursor: 'pointer',
            borderColor: selectedRole === 'freelancer' ? 'var(--color-emerald)' : 'var(--color-border)',
            borderWidth: selectedRole === 'freelancer' ? '2.5px' : '1px',
            backgroundColor: selectedRole === 'freelancer' ? '#F2F9F5' : 'var(--color-white)',
            position: 'relative',
            transition: 'all 0.2s ease',
            padding: '2rem',
          }}
        >
          {selectedRole === 'freelancer' && (
            <div
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                backgroundColor: 'var(--color-emerald)',
                color: 'var(--color-white)',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={16} strokeWidth={3} />
            </div>
          )}

          <div
            style={{
              width: '3.75rem',
              height: '3.75rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-emerald-light)',
              color: 'var(--color-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <UserCheck size={32} />
          </div>

          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
            I am a Freelancer
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            I want to browse high-paying Indian projects, submit proposals, upload verified work deliverables, and build a trusted reputation.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem', color: 'var(--color-charcoal)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={15} color="var(--color-emerald)" /> Showcase portfolio and hourly rates in ₹
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={15} color="var(--color-emerald)" /> Submit proposals and track project milestones
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={15} color="var(--color-emerald)" /> Submit delivery links with review notes
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={15} color="var(--color-emerald)" /> Guaranteed payment tracking upon approval
            </li>
          </ul>
        </div>

        {/* Client Card */}
        <div
          onClick={() => setSelectedRole('client')}
          className="sb-card"
          style={{
            cursor: 'pointer',
            borderColor: selectedRole === 'client' ? 'var(--color-gold)' : 'var(--color-border)',
            borderWidth: selectedRole === 'client' ? '2.5px' : '1px',
            backgroundColor: selectedRole === 'client' ? '#FAF4EA' : 'var(--color-white)',
            position: 'relative',
            transition: 'all 0.2s ease',
            padding: '2rem',
          }}
        >
          {selectedRole === 'client' && (
            <div
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-white)',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={16} strokeWidth={3} />
            </div>
          )}

          <div
            style={{
              width: '3.75rem',
              height: '3.75rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-gold-light)',
              color: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <Building2 size={32} />
          </div>

          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
            I am a Client
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            I want to hire skilled Indian professionals, publish projects with transparent INR budgets, review proposals, and verify work deliverables.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem', color: 'var(--color-charcoal)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={15} color="var(--color-gold)" /> Post projects with milestone budgets in ₹
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={15} color="var(--color-gold)" /> Review candidate proposals & portfolios
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={15} color="var(--color-gold)" /> Assign freelancers with 1-click acceptance
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={15} color="var(--color-gold)" /> Verify delivery links before approving completion
            </li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={handleContinue}
          className={`btn ${selectedRole === 'freelancer' ? 'btn-emerald' : 'btn-gold'} btn-lg`}
          style={{ minWidth: '240px', gap: '0.5rem' }}
        >
          <span>Continue as {selectedRole === 'freelancer' ? 'Freelancer' : 'Client'}</span>
          <ArrowRight size={18} />
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.92rem', color: 'var(--color-muted-text)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
