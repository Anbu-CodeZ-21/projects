import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, IndianRupee, CheckCircle, Users, Award, Target, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

export default function About() {
  return (
    <div className="sb-container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
          <Logo size="xl" showTagline={true} />
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: 'var(--color-emerald-light)',
            color: 'var(--color-emerald)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          <ShieldCheck size={16} /> About SkillBridge
        </div>
        <h1 style={{ fontSize: '2.8rem', lineHeight: 1.2, marginBottom: '1.25rem' }}>
          Restoring Trust in Freelancer Work Through Verified Deliverables
        </h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          SkillBridge is built specifically for Indian tech talent and forward-thinking enterprises. We replace guesswork with transparent progress tracking, verified live deliveries, and milestone payments denominated in Indian Rupees (₹).
        </p>
      </div>

      {/* The Problem & Solution Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '4.5rem',
        }}
      >
        <div className="sb-card" style={{ padding: '2.25rem', borderLeft: '4px solid var(--color-terracotta)' }}>
          <div style={{ color: 'var(--color-terracotta)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            The Traditional Freelance Problem
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Uncertain Deliverables & Payment Disputes
          </h3>
          <p style={{ color: 'var(--color-charcoal)', fontSize: '0.94rem', lineHeight: 1.65 }}>
            Clients often pay upfront and end up with incomplete repositories or ghosting. Freelancers pour weeks into development only to deal with delayed approvals and endless unpaid scope creep. Foreign platforms charge 20% fees and deduct currency exchange fees.
          </p>
        </div>

        <div className="sb-card" style={{ padding: '2.25rem', borderLeft: '4px solid var(--color-emerald)' }}>
          <div style={{ color: 'var(--color-emerald)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            The SkillBridge Solution
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Strict Work Verification Protocol
          </h3>
          <p style={{ color: 'var(--color-charcoal)', fontSize: '0.94rem', lineHeight: 1.65 }}>
            Every project has defined deliverables and milestone budgets in Indian Rupees (₹). Freelancers update live milestone progress and submit testable links (GitHub, Vercel, Figma). Clients inspect before approving completion. Zero ambiguity, zero foreign currency loss.
          </p>
        </div>
      </div>

      {/* Our 4 Core Pillars */}
      <div style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
            Core Pillars
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.35rem' }}>What Makes SkillBridge Unique</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              icon: IndianRupee,
              title: 'Indian Rupee Native',
              desc: 'All budgets, hourly rates, bids, and settlements are strictly in INR (₹). No currency conversion losses or confusing USD rates.',
            },
            {
              icon: ShieldCheck,
              title: 'Mandatory Deliverable URL',
              desc: 'Projects cannot be marked complete without providing an active, verifiable URL (repo, Figma mockup, or deployed application).',
            },
            {
              icon: Target,
              title: 'Milestone Progress Tracker',
              desc: 'Real-time percentage updates allow clients to see project momentum and prevent last-minute surprises.',
            },
            {
              icon: Award,
              title: 'Verified Indian Talent',
              desc: 'Curated developer and designer profiles highlighting proven expertise, client testimonials, and verified portfolio cases.',
            },
          ].map((col, idx) => {
            const IconComp = col.icon;
            return (
              <div key={idx} className="sb-card" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <IconComp size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{col.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
                  {col.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div
        style={{
          background: 'linear-gradient(145deg, #123C32, #237A57)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          color: 'var(--color-white)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: 'var(--color-white)', fontSize: '2.2rem', marginBottom: '0.85rem' }}>
          Be Part of India's Most Trusted Work Marketplace
        </h2>
        <p style={{ color: '#E2DDD4', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 2rem' }}>
          Whether you need an expert React developer or want to earn competitive rates in INR, start your journey today.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register/freelancer" className="btn btn-emerald btn-lg">
            Join as Freelancer
          </Link>
          <Link to="/register/client" className="btn btn-terracotta btn-lg">
            Hire Verified Talent
          </Link>
        </div>
      </div>
    </div>
  );
}
