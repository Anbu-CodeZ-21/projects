import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Send, Clock, CheckCircle2, XCircle, ArrowRight, FileCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProposals, getProjects } from '../utils/storage';
import { formatINR } from '../utils/currency';
import EmptyState from '../components/EmptyState';

export default function MyProposals() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all | pending | accepted | rejected

  useEffect(() => {
    const allProps = getProposals();
    const myProps = allProps.filter((p) => p.freelancerId === user?.id);
    setProposals(myProps);
  }, [user]);

  const filteredProposals = useMemo(() => {
    if (activeTab === 'pending') return proposals.filter((p) => p.status === 'pending');
    if (activeTab === 'accepted') return proposals.filter((p) => p.status === 'accepted');
    if (activeTab === 'rejected') return proposals.filter((p) => p.status === 'rejected');
    return proposals;
  }, [proposals, activeTab]);

  return (
    <div className="sb-container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
            Freelancer Workspace
          </span>
          <h1 style={{ fontSize: '2.3rem', marginTop: '0.2rem', marginBottom: '0.35rem' }}>
            My Proposals
          </h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem' }}>
            Track the status of all bids sent to clients. Once accepted, projects move directly into work verification.
          </p>
        </div>

        <Link to="/projects" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
          <Briefcase size={15} />
          <span>Find More Projects</span>
        </Link>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: 'all', label: `All Proposals (${proposals.length})` },
          { id: 'pending', label: `Pending (${proposals.filter((p) => p.status === 'pending').length})` },
          { id: 'accepted', label: `Accepted (${proposals.filter((p) => p.status === 'accepted').length})` },
          { id: 'rejected', label: `Declined (${proposals.filter((p) => p.status === 'rejected').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredProposals.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No proposals in this category"
          description="Browse available client projects and submit competitive proposals with milestone estimates."
          actionText="Explore Projects"
          actionLink="/projects"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredProposals.map((prop) => (
            <div
              key={prop.id}
              className="sb-card"
              style={{
                borderLeft:
                  prop.status === 'accepted'
                    ? '4px solid var(--color-emerald)'
                    : prop.status === 'rejected'
                    ? '4px solid var(--color-terracotta)'
                    : '4px solid #3498DB',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <Link to={`/projects/${prop.projectId}`} style={{ color: 'var(--color-primary)' }}>
                      {prop.projectTitle}
                    </Link>
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-muted-text)' }}>
                    Submitted on {new Date(prop.submittedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                    {formatINR(prop.bidAmount)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
                    Timeline: <strong>{prop.estimatedDays} Days</strong>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--color-cream-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '0.85rem 0', fontSize: '0.9rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                <strong>Your Cover Letter Pitch:</strong>
                <p style={{ marginTop: '0.35rem' }}>{prop.coverLetter}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <span
                    className={`badge ${
                      prop.status === 'accepted'
                        ? 'badge-open'
                        : prop.status === 'rejected'
                        ? 'badge-revision-requested'
                        : 'badge-proposal-submitted'
                    }`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {prop.status === 'accepted' ? 'Accepted by Client' : prop.status === 'rejected' ? 'Declined' : 'Under Review'}
                  </span>
                </div>

                {prop.status === 'accepted' && (
                  <Link
                    to={`/work-verification?project=${prop.projectId}`}
                    className="btn btn-emerald btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <FileCheck size={14} />
                    <span>Go to Work Verification</span>
                  </Link>
                )}

                <Link
                  to={`/projects/${prop.projectId}`}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <span>View Project</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
