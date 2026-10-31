import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Briefcase,
  IndianRupee,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowLeft,
  Mail,
  Send,
} from 'lucide-react';
import { getFreelancerById } from '../utils/storage';
import { formatINR } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function FreelancerProfile() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const [freelancer, setFreelancer] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    const f = getFreelancerById(id);
    setFreelancer(f);
  }, [id]);

  if (!freelancer) {
    return (
      <div className="sb-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Freelancer Profile Not Found</h2>
        <p style={{ color: 'var(--color-muted-text)', margin: '1rem 0 2rem' }}>
          The requested freelancer profile may have been removed or does not exist.
        </p>
        <Link to="/freelancers" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to All Freelancers</span>
        </Link>
      </div>
    );
  }

  const isOwnProfile = user?.id === freelancer.id;

  const handleSendInvite = (e) => {
    e.preventDefault();
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteModalOpen(false);
    }, 1800);
  };

  return (
    <div className="sb-container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/freelancers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Freelancers Directory</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="sb-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img
            src={freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(freelancer.name)}`}
            alt={freelancer.name}
            style={{
              width: '6.5rem',
              height: '6.5rem',
              borderRadius: 'var(--radius-full)',
              objectFit: 'cover',
              border: '3px solid var(--color-emerald-light)',
            }}
          />

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>{freelancer.name}</h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: 'var(--color-emerald-light)',
                  color: 'var(--color-emerald)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <CheckCircle size={13} /> Verified Freelancer
              </span>
            </div>

            <p style={{ fontSize: '1.15rem', color: 'var(--color-emerald)', fontWeight: 600, marginBottom: '0.75rem' }}>
              {freelancer.title}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--color-muted-text)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#B59344' }}>
                <Star size={16} fill="#D6B46A" color="#D6B46A" />
                {freelancer.rating?.toFixed(1) || '5.0'} ({freelancer.reviewsCount || 0} reviews)
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} />
                {freelancer.location}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} />
                Member since {freelancer.memberSince || '2023'}
              </span>
            </div>
          </div>

          {/* Pricing & CTA Panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'var(--color-cream)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              minWidth: '220px',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', fontWeight: 600 }}>
              Hourly Rate
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)', margin: '0.2rem 0 0.85rem' }}>
              {formatINR(freelancer.hourlyRate)}
              <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-muted-text)' }}> / hr</span>
            </div>

            {isOwnProfile ? (
              <Link to="/settings" className="btn btn-secondary btn-sm btn-block">
                Edit My Profile
              </Link>
            ) : role === 'client' ? (
              <button
                type="button"
                onClick={() => setInviteModalOpen(true)}
                className="btn btn-emerald btn-sm btn-block"
                style={{ gap: '0.4rem' }}
              >
                <Send size={14} />
                <span>Invite to Project</span>
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm btn-block">
                Hire Freelancer
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Details, Experience, Skills & Portfolio */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
        }}
      >
        {/* Left Column: Bio & Portfolio */}
        <div>
          {/* About Section */}
          <div className="sb-card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>About Me</h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--color-charcoal)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {freelancer.bio}
            </p>
          </div>

          {/* Portfolio Projects Section */}
          <div className="sb-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Verified Portfolio Projects</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', fontWeight: 600 }}>
                {freelancer.portfolio?.length || 0} showcase projects
              </span>
            </div>

            {!freelancer.portfolio || freelancer.portfolio.length === 0 ? (
              <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem' }}>
                No portfolio items published yet.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {freelancer.portfolio.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--color-white)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.35rem 0 0.5rem' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.86rem', color: 'var(--color-muted-text)', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
                        {item.description}
                      </p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem', alignSelf: 'flex-start' }}
                        >
                          <span>Live Demo / Code</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Stats, Skills & Verification Assurance */}
        <div>
          {/* Quick Stats Card */}
          <div className="sb-card" style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Performance Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Completed Projects</span>
                <strong style={{ color: 'var(--color-primary)' }}>{freelancer.completedProjectsCount || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Experience</span>
                <strong style={{ color: 'var(--color-primary)' }}>{freelancer.experienceYears || 1} Years</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Total Platform Earnings</span>
                <strong style={{ color: 'var(--color-emerald)' }}>{formatINR(freelancer.totalEarned || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Availability</span>
                <strong style={{ color: 'var(--color-primary)' }}>{freelancer.availability || 'Available'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Verification Status</span>
                <strong style={{ color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={15} /> 100% Verified
                </strong>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="sb-card" style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Technical Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {freelancer.skills?.map((skill, i) => (
                <span key={i} className="badge-skill" style={{ padding: '0.35rem 0.75rem', fontSize: '0.84rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Delivery Quality Guarantee Badge */}
          <div
            className="sb-card"
            style={{
              backgroundColor: 'var(--color-cream-surface)',
              border: '1.5px solid var(--color-emerald)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ShieldCheck size={24} color="var(--color-emerald)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  Work Verification Guarantee
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                  This freelancer's previous deliverables were inspected and approved by clients before fund release.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal for Clients */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title={`Invite ${freelancer.name} to a Project`}
      >
        {inviteSent ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-emerald-light)',
                color: 'var(--color-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Invitation Sent!</h3>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '0.92rem' }}>
              {freelancer.name} has been notified and will review your project details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendInvite}>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-text)', marginBottom: '1.25rem' }}>
              Send a personalized invitation for {freelancer.name} to view and bid on one of your posted projects.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="invitationMessage">
                Personal Message / Project Overview *
              </label>
              <textarea
                id="invitationMessage"
                required
                rows={4}
                defaultValue={`Hi ${freelancer.name}, I reviewed your portfolio and would like to invite you to discuss our upcoming milestone.`}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-emerald btn-sm" style={{ gap: '0.4rem' }}>
                <Send size={14} />
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
