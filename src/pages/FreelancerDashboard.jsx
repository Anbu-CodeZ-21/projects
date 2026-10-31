import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  Briefcase,
  Send,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProjects, getProposals } from '../utils/storage';
import { formatINR } from '../utils/currency';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const allProj = getProjects();
    const allProps = getProposals();

    // Active projects where this freelancer is assigned
    const myProjects = allProj.filter((p) => p.assignedFreelancerId === user?.id);
    // Proposals sent by this freelancer
    const myProposals = allProps.filter((p) => p.freelancerId === user?.id);

    setProjects(myProjects);
    setProposals(myProposals);
  }, [user]);

  const activeProjects = projects.filter((p) => p.status !== 'Completed');
  const completedProjects = projects.filter((p) => p.status === 'Completed');
  const needsAttention = projects.filter((p) => p.status === 'Revision Requested');

  return (
    <div className="sb-container" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* Top Welcome Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.98rem' }}>
            Track your ongoing assignments, update deliverable links, and monitor your earnings in Indian Rupees.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/projects" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
            <Briefcase size={15} />
            <span>Explore Projects</span>
          </Link>
          <Link to={`/freelancers/${user?.id}`} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <span>View Public Profile</span>
          </Link>
        </div>
      </div>

      {/* Urgent Attention Alert: Revisions requested */}
      {needsAttention.length > 0 && (
        <div
          style={{
            backgroundColor: '#FDF2EE',
            border: '1.5px solid var(--color-terracotta)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <AlertCircle size={22} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: 'var(--color-terracotta)', fontSize: '1rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                Action Required: Client Requested Revisions
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>
                {needsAttention[0].clientName} requested changes on "{needsAttention[0].title}". Review feedback and resubmit your deliverables.
              </p>
            </div>
          </div>
          <Link
            to={`/work-verification?project=${needsAttention[0].id}`}
            className="btn btn-terracotta btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <span>Review Feedback & Resubmit</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <StatCard
          title="Total Earnings"
          value={formatINR(user?.totalEarned || 0)}
          icon={IndianRupee}
          theme="emerald"
          subtitle="Cleared payments in INR"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects.length}
          icon={Briefcase}
          theme="primary"
          subtitle="Currently in progress"
        />
        <StatCard
          title="Submitted Proposals"
          value={proposals.length}
          icon={Send}
          theme="gold"
          subtitle={`${proposals.filter((p) => p.status === 'accepted').length} accepted proposals`}
        />
        <StatCard
          title="Completed Projects"
          value={user?.completedProjectsCount || completedProjects.length || 0}
          icon={CheckCircle}
          theme="emerald"
          subtitle="100% verified deliverables"
        />
      </div>

      {/* Main Grid: Active Work & Recent Proposals */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '2rem',
        }}
      >
        {/* Left Column: Active Projects with Work Verification Status */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Active Projects & Work Delivery</h2>
            <Link to="/freelancer/projects" style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-emerald)' }}>
              View All ({projects.length})
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No active projects right now"
              description="Browse the latest client projects and submit proposals to start working and earning."
              actionText="Browse Available Projects"
              actionLink="/projects"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeProjects.map((project) => (
                <div key={project.id} className="sb-card" style={{ borderLeft: '4px solid var(--color-emerald)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
                        {project.category}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', marginTop: '0.15rem' }}>
                        <Link to={`/projects/${project.id}`}>{project.title}</Link>
                      </h3>
                      <div style={{ fontSize: '0.84rem', color: 'var(--color-muted-text)', marginTop: '0.2rem' }}>
                        Client: <strong>{project.clientCompany || project.clientName}</strong>
                      </div>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  {/* Progress Bar */}
                  <div style={{ margin: '1rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Milestone Progress</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>{project.progress || 0}%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                  </div>

                  {/* Project Footer with Work Verification Button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '0.85rem',
                      marginTop: '0.5rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>Agreed Budget</span>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {formatINR(project.budget)}
                      </div>
                    </div>

                    <Link
                      to={`/work-verification?project=${project.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <FileCheck size={14} />
                      <span>
                        {project.status === 'Submitted for Review'
                          ? 'View Submitted Deliverable'
                          : project.status === 'Revision Requested'
                          ? 'Resubmit Work'
                          : 'Submit Work Delivery'}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Submitted Proposals Status */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>My Sent Proposals</h2>
            <Link to="/freelancer/proposals" style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-emerald)' }}>
              View All ({proposals.length})
            </Link>
          </div>

          {proposals.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No proposals submitted yet"
              description="Start submitting proposals to find clients and secure your next milestone."
              actionText="Find Projects"
              actionLink="/projects"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {proposals.slice(0, 4).map((prop) => (
                <div key={prop.id} className="sb-card" style={{ padding: '1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.35 }}>
                      <Link to={`/projects/${prop.projectId}`}>{prop.projectTitle}</Link>
                    </h4>
                    <span
                      className={`badge ${
                        prop.status === 'accepted'
                          ? 'badge-open'
                          : prop.status === 'rejected'
                          ? 'badge-revision-requested'
                          : 'badge-proposal-submitted'
                      }`}
                      style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--color-muted-text)', marginTop: '0.5rem' }}>
                    <div>
                      Bid: <strong style={{ color: 'var(--color-primary)' }}>{formatINR(prop.bidAmount)}</strong>
                    </div>
                    <div>Est: <strong>{prop.estimatedDays} days</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verification Guarantee Card */}
          <div
            className="sb-card"
            style={{
              marginTop: '1.5rem',
              backgroundColor: 'var(--color-cream-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
                  Work Verification Tip
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                  Always submit live URLs (such as deployed Vercel apps, public GitHub repos, or Figma files) alongside detailed release notes to expedite client sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
