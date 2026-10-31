import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, IndianRupee, Users, ArrowRight, Building, CheckCircle } from 'lucide-react';
import { formatINR } from '../utils/currency';
import StatusBadge from './StatusBadge';

export default function ProjectCard({ project, showProgress = false, actionLabel = 'View Details' }) {
  if (!project) return null;

  return (
    <div className="sb-card sb-card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sb-card-header" style={{ marginBottom: '0.85rem' }}>
        <div>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--color-emerald)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'inline-block',
              marginBottom: '0.35rem',
            }}
          >
            {project.category}
          </span>
          <h3 style={{ fontSize: '1.18rem', fontWeight: 700, lineHeight: 1.35 }}>
            <Link to={`/projects/${project.id}`} style={{ color: 'var(--color-primary)' }}>
              {project.title}
            </Link>
          </h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--color-muted-text)', marginBottom: '1rem' }}>
        <Building size={15} />
        <span>{project.clientCompany || project.clientName}</span>
        {project.clientLocation && (
          <>
            <span>•</span>
            <span>{project.clientLocation}</span>
          </>
        )}
      </div>

      <p
        style={{
          fontSize: '0.92rem',
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
        {project.description}
      </p>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {project.skills?.slice(0, 4).map((skill, index) => (
          <span key={index} className="badge-skill">
            {skill}
          </span>
        ))}
        {project.skills?.length > 4 && (
          <span className="badge-skill" style={{ color: 'var(--color-muted-text)' }}>
            +{project.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Progress bar if active */}
      {showProgress && project.status !== 'Open' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>{project.progress || 0}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${project.progress || 0}%` }} />
          </div>
        </div>
      )}

      {/* Footer Info: Budget, Proposals, Link */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1rem',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)', fontWeight: 500 }}>Budget</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
            {formatINR(project.budget)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Proposals Received">
            <Users size={14} />
            {project.proposalsCount || 0} proposals
          </span>
        </div>

        <Link to={`/projects/${project.id}`} className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
          <span>{actionLabel}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
