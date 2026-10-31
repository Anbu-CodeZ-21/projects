import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/currency';

export default function FreelancerCard({ freelancer }) {
  if (!freelancer) return null;

  return (
    <div className="sb-card sb-card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with Avatar and Basic Info */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <img
          src={freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(freelancer.name)}`}
          alt={freelancer.name}
          style={{
            width: '3.6rem',
            height: '3.6rem',
            borderRadius: 'var(--radius-full)',
            objectFit: 'cover',
            border: '2px solid var(--color-cream-border)',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Link to={`/freelancers/${freelancer.id}`} style={{ color: 'var(--color-primary)' }}>
                {freelancer.name}
              </Link>
            </h3>
            <CheckCircle size={15} color="var(--color-emerald)" fill="var(--color-emerald-light)" />
          </div>
          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--color-emerald)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '0.25rem',
            }}
          >
            {freelancer.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, color: '#B59344' }}>
              <Star size={13} fill="#D6B46A" color="#D6B46A" />
              {freelancer.rating?.toFixed(1) || '5.0'} ({freelancer.reviewsCount || 0})
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={13} />
              {freelancer.location?.split(',')[0] || 'India'}
            </span>
          </div>
        </div>
      </div>

      {/* Bio excerpt */}
      <p
        style={{
          fontSize: '0.88rem',
          color: 'var(--color-charcoal)',
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
        }}
      >
        {freelancer.bio}
      </p>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {freelancer.skills?.slice(0, 4).map((skill, index) => (
          <span key={index} className="badge-skill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
            {skill}
          </span>
        ))}
        {freelancer.skills?.length > 4 && (
          <span className="badge-skill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--color-muted-text)' }}>
            +{freelancer.skills.length - 4}
          </span>
        )}
      </div>

      {/* Footer: Rate, Completed Projects, CTA */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1rem',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>Rate</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
            {formatINR(freelancer.hourlyRate)}
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-muted-text)' }}>/hr</span>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', textAlign: 'right' }}>
          <div><strong>{freelancer.completedProjectsCount || 0}</strong> projects done</div>
          <div style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>{freelancer.experienceYears || 1}+ yrs exp</div>
        </div>

        <Link to={`/freelancers/${freelancer.id}`} className="btn btn-primary btn-sm">
          <span>Profile</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
