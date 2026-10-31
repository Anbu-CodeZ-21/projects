import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  PlusCircle,
  FileCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  Users,
  Building,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProjects, getProposals } from '../utils/storage';
import { formatINR } from '../utils/currency';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'needs_review' | 'active' | 'open' | 'completed'

  useEffect(() => {
    const allProj = getProjects();
    const allProps = getProposals();

    const myProjects = allProj.filter((p) => p.clientId === user?.id);
    setProjects(myProjects);
    setProposals(allProps);
  }, [user]);

  // Projects pending review by client
  const pendingReviews = projects.filter((p) => p.status === 'Submitted for Review');
  const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Revision Requested');
  const openProjects = projects.filter((p) => p.status === 'Open' || p.status === 'Proposal Submitted');
  const completedProjects = projects.filter((p) => p.status === 'Completed');

  // Filter based on active tab
  const displayedProjects =
    activeTab === 'needs_review'
      ? pendingReviews
      : activeTab === 'active'
      ? activeProjects
      : activeTab === 'open'
      ? openProjects
      : activeTab === 'completed'
      ? completedProjects
      : projects;

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
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>
            {user?.companyName || user?.name} Dashboard
          </h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.98rem' }}>
            Manage your project pipeline, review candidate proposals, and inspect work deliverables before releasing payment.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/client/post-project" className="btn btn-emerald btn-sm" style={{ gap: '0.4rem' }}>
            <PlusCircle size={15} />
            <span>Post a New Project</span>
          </Link>
          <Link to="/freelancers" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <Users size={15} />
            <span>Find Freelancers</span>
          </Link>
        </div>
      </div>

      {/* Urgent Deliverables Review Alert Banner */}
      {pendingReviews.length > 0 && (
        <div
          style={{
            backgroundColor: '#F4ECF7',
            border: '1.5px solid #A569BD',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <FileCheck size={24} color="#7D3C98" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#5B2C6F', fontSize: '1.05rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                {pendingReviews.length} Project Deliverable{pendingReviews.length > 1 ? 's' : ''} Awaiting Verification!
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>
                Freelancer submitted work for "{pendingReviews[0].title}". Inspect the delivery link and either approve completion or request revisions with targeted feedback.
              </p>
            </div>
          </div>
          <Link
            to={`/work-verification?project=${pendingReviews[0].id}`}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#6C3483', borderColor: '#6C3483', gap: '0.4rem' }}
          >
            <FileCheck size={14} />
            <span>Verify Deliverable</span>
          </Link>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <StatCard
          title="Total Spent"
          value={formatINR(user?.totalSpent || 0)}
          icon={IndianRupee}
          theme="terracotta"
          subtitle="Cleared milestone payments"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviews.length}
          icon={FileCheck}
          theme={pendingReviews.length > 0 ? 'terracotta' : 'emerald'}
          subtitle={pendingReviews.length > 0 ? 'Deliverables need signoff' : 'All deliverables reviewed'}
        />
        <StatCard
          title="Active Projects"
          value={activeProjects.length}
          icon={Clock}
          theme="primary"
          subtitle="Currently in development"
        />
        <StatCard
          title="Completed Projects"
          value={completedProjects.length}
          icon={CheckCircle}
          theme="emerald"
          subtitle="Verified and signed off"
        />
      </div>

      {/* Projects Management Header & Filter Tabs */}
      <div className="sb-card" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Posted Projects Overview</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)' }}>
              Manage all projects created under your company profile.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All (${projects.length})` },
              { id: 'needs_review', label: `Needs Review (${pendingReviews.length})` },
              { id: 'active', label: `Active (${activeProjects.length})` },
              { id: 'open', label: `Open (${openProjects.length})` },
              { id: 'completed', label: `Completed (${completedProjects.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {displayedProjects.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No projects found in this category"
            description="You have no projects matching this filter tab right now."
            actionText="Post a New Project"
            actionLink="/client/post-project"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {displayedProjects.map((project) => (
              <div
                key={project.id}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  backgroundColor: project.status === 'Submitted for Review' ? '#FCF9FE' : 'var(--color-white)',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <StatusBadge status={project.status} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)', fontWeight: 600 }}>
                      Posted on {project.createdAt}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <Link to={`/projects/${project.id}`} style={{ color: 'var(--color-primary)' }}>
                      {project.title}
                    </Link>
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.84rem', color: 'var(--color-muted-text)' }}>
                    <span>Budget: <strong style={{ color: 'var(--color-primary)' }}>{formatINR(project.budget)}</strong></span>
                    <span>Proposals: <strong>{project.proposalsCount || 0}</strong></span>
                    {project.assignedFreelancerName && (
                      <span>Assigned to: <strong style={{ color: 'var(--color-emerald)' }}>{project.assignedFreelancerName}</strong></span>
                    )}
                  </div>
                </div>

                {/* Action Buttons based on Project Status */}
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  {project.status === 'Submitted for Review' ? (
                    <Link
                      to={`/work-verification?project=${project.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#6C3483', borderColor: '#6C3483', gap: '0.35rem' }}
                    >
                      <FileCheck size={14} />
                      <span>Verify Work Delivery</span>
                    </Link>
                  ) : project.status === 'Open' || project.status === 'Proposal Submitted' ? (
                    <Link
                      to={`/projects/${project.id}`}
                      className="btn btn-emerald btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <Users size={14} />
                      <span>Review Proposals ({project.proposalsCount || 0})</span>
                    </Link>
                  ) : (
                    <Link
                      to={`/projects/${project.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <span>View Project</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
