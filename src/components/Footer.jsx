import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Heart, ExternalLink, IndianRupee } from 'lucide-react';
import logo from "../assets/skillbridge-logo";

export default function Footer() {
  return (
    <footer className="sb-footer">
      <div className="sb-container">
        <div className="sb-footer-grid">
          {/* Brand info */}
          <div className="sb-footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '2.8rem',
                  height: '2.8rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(199, 140, 58, 0.45)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={logo}
                  alt="SkillBridge Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.25) translateY(2%)' }}
                />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.45rem', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                  <span style={{ color: '#FFFFFF' }}>Skill</span>
                  <span style={{ color: 'var(--color-gold)' }}>Bridge</span>
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#D4DDD8', letterSpacing: '0.02em', marginTop: '0.2rem' }}>
                  Freelancer & Client Work Verification Platform
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#B2BFBA', maxWidth: '340px', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Connecting skilled Indian freelancers with forward-thinking clients through milestone tracking and verified deliverables.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                color: 'var(--color-gold)',
                border: '1px solid rgba(214, 180, 106, 0.3)',
              }}
            >
              <IndianRupee size={13} />
              <span>All budgets & earnings strictly in Indian Rupees (₹)</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="sb-footer-col">
            <h4>Platform</h4>
            <ul className="sb-footer-links">
              <li><Link to="/projects">Explore Projects</Link></li>
              <li><Link to="/freelancers">Find Freelancers</Link></li>
              <li><Link to="/about">About SkillBridge</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="sb-footer-col">
            <h4>For Clients</h4>
            <ul className="sb-footer-links">
              <li><Link to="/client/post-project">Post a Project</Link></li>
              <li><Link to="/register/client">Client Registration</Link></li>
              <li><Link to="/work-verification">Work Verification</Link></li>
              <li><Link to="/freelancers">Browse Portfolios</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="sb-footer-col">
            <h4>For Freelancers</h4>
            <ul className="sb-footer-links">
              <li><Link to="/register/freelancer">Join as Freelancer</Link></li>
              <li><Link to="/projects">Browse Available Jobs</Link></li>
              <li><Link to="/login">Freelancer Login</Link></li>
              <li><Link to="/about">Verification Guide</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="sb-footer-bottom">
          <div>
            © {new Date().getFullYear()} SkillBridge – Freelancer Work Verification Platform. Built for Indian Freelancers & Clients.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D6B46A' }}>
              <ShieldCheck size={16} /> Verified Work Delivery Guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
