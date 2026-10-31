import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  IndianRupee,
  Users,
  CheckCircle,
  Building,
  Star,
  MapPin,
  ArrowLeft,
  Send,
  FileCheck,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { getProjectById, getProposals, acceptProposal } from '../utils/storage';
import { formatINR } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = () => {
    const p = getProjectById(id);
    setProject(p);
    if (p) {
      const allProps = getProposals();
      const projProps = allProps.filter((pr) => pr.projectId === p.id);
      setProposals(projProps);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!project) {
    return (
      <div className="sb-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Project Not Found</h2>
        <p style={{ color: 'var(--color-muted-text)', margin: '1rem 0 2rem' }}>
          This project could not be found or has been removed.
        </p>
        <Link to="/projects" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Explore All Projects</span>
        </Link>
      </div>
    );
  }

  const isClientOwner = user?.id === project.clientId;
  const isAssignedFreelancer = user?.id === project.assignedFreelancerId;
  const myProposal = proposals.find((pr) => pr.freelancerId === user?.id);

  // Stepper logic
  const steps = [
    { label: 'Open for Bidding', key: 'Open' },
    { label: 'Freelancer Assigned', key: 'Assigned' },
    { label: 'In Progress', key: 'In Progress' },
    { label: 'Submitted for Review', key: 'Submitted for Review' },
    { label: 'Completed', key: 'Completed' },
  ];

  let currentStepIndex = 0;
  if (project.status === 'Open' || project.status === 'Proposal Submitted') currentStepIndex = 0;
  else if (project.status === 'In Progress' && (project.progress || 0) < 30) currentStepIndex = 1;
  else if (project.status === 'In Progress' || project.status === 'Revision Requested') currentStepIndex = 2;
  else if (project.status === 'Submitted for Review') currentStepIndex = 3;
  else if (project.status === 'Completed') currentStepIndex = 4;

  const handleAcceptProposal = (proposalId, freelancerName) => {
    if (window.confirm(`Are you sure you want to assign ${freelancerName} to this project? Other proposals will be declined and the project will move to In Progress.`)) {
      acceptProposal(proposalId);
      setSuccessMessage(`${freelancerName} has been assigned to this project! Status updated to In Progress.`);
      loadData();
    }
  };

  return (
    <div className="sb-container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
      </div>

      {successMessage && (
        <div
          style={{
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success-text)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Project Details Header */}
      <div className="sb-card" style={{ padding: '2.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {project.category}
              </span>
              <span>•</span>
              <span style={{ fontSize: '0.84rem', color: 'var(--color-muted-text)' }}>
                Posted on {project.createdAt}
              </span>
              <StatusBadge status={project.status} />
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
              {project.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--color-muted-text)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} /> Duration: <strong>{project.duration || 'Flexible'}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} /> Deadline: <strong>{project.deadline || 'Open'}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={15} /> Proposals: <strong>{proposals.length} received</strong>
              </span>
            </div>
          </div>

          {/* Budget & Primary Role Action Card */}
          <div
            style={{
              backgroundColor: 'var(--color-cream)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              minWidth: '260px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-muted-text)', textTransform: 'uppercase' }}>
              Milestone Budget
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)', margin: '0.25rem 0 1.25rem' }}>
              {formatINR(project.budget)}
            </div>

            {/* Dynamic CTA depending on current user and project state */}
            {!isAuthenticated ? (
              <Link to="/login" className="btn btn-primary btn-block">
                Log In to Submit Proposal
              </Link>
            ) : isAssignedFreelancer ? (
              <Link to={`/work-verification?project=${project.id}`} className="btn btn-emerald btn-block" style={{ gap: '0.4rem' }}>
                <FileCheck size={16} />
                <span>Work Verification Hub</span>
              </Link>
            ) : isClientOwner ? (
              project.status === 'Submitted for Review' ? (
                <Link to={`/work-verification?project=${project.id}`} className="btn btn-primary btn-block" style={{ backgroundColor: '#6C3483', borderColor: '#6C3483', gap: '0.4rem' }}>
                  <FileCheck size={16} />
                  <span>Verify Deliverable</span>
                </Link>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-emerald)', fontWeight: 700, padding: '0.4rem' }}>
                  You are the Project Owner
                </div>
              )
            ) : role === 'freelancer' ? (
              myProposal ? (
                <div
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-emerald)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-emerald)',
                    fontWeight: 700,
                  }}
                >
                  ✓ Proposal Submitted ({formatINR(myProposal.bidAmount)})
                </div>
              ) : project.status === 'Open' ? (
                <Link to={`/projects/${project.id}/apply`} className="btn btn-emerald btn-block" style={{ gap: '0.4rem' }}>
                  <Send size={15} />
                  <span>Send Proposal</span>
                </Link>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', fontStyle: 'italic' }}>
                  Project is no longer accepting bids
                </div>
              )
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
                Client Account active
              </div>
            )}
          </div>
        </div>

        {/* Milestone Verification Stepper */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
            Work Verification Lifecycle
          </div>
          <div className="verification-stepper">
            <div className="stepper-line" />
            <div
              className="stepper-line-active"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((st, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  className={`stepper-step ${isCurrent ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                >
                  <div className="stepper-circle">
                    {isPast ? <Check size={16} strokeWidth={3} /> : idx + 1}
                  </div>
                  <span className="stepper-label">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Columns: Project Scope & Client Information */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
        }}
      >
        {/* Left Column: Scope, Skills, Deliverables */}
        <div>
          <div className="sb-card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Project Description & Requirements</h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--color-charcoal)', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: '1.75rem' }}>
              {project.description}
            </p>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Required Skills & Technologies
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.5rem' }}>
              {project.skills?.map((skill, index) => (
                <span key={index} className="badge-skill" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                  {skill}
                </span>
              ))}
            </div>

            {/* Delivery details if already submitted or completed */}
            {project.delivery && (
              <div
                style={{
                  backgroundColor: 'var(--color-cream-surface)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.35rem',
                  marginTop: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  <FileCheck size={18} color="var(--color-emerald)" />
                  <span>Submitted Work Deliverables</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
                  <strong>Delivery URL:</strong>{' '}
                  <a href={project.delivery.deliveryUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--color-emerald)' }}>
                    {project.delivery.deliveryUrl}
                  </a>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>
                  <strong>Notes:</strong> {project.delivery.deliveryNotes}
                </div>
              </div>
            )}
          </div>

          {/* Received Proposals Section (Visible to Client Owner) */}
          {isClientOwner && (
            <div className="sb-card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.35rem' }}>Received Proposals ({proposals.length})</h2>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
                  Only visible to you as project client
                </span>
              </div>

              {proposals.length === 0 ? (
                <p style={{ color: 'var(--color-muted-text)', fontSize: '0.92rem' }}>
                  No freelancers have bid on this project yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {proposals.map((prop) => (
                    <div
                      key={prop.id}
                      style={{
                        border: '1.5px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        backgroundColor: prop.status === 'accepted' ? '#F4FAF6' : 'var(--color-white)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                          <img
                            src={prop.freelancerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(prop.freelancerName)}`}
                            alt={prop.freelancerName}
                            style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                          />
                          <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                              <Link to={`/freelancers/${prop.freelancerId}`}>{prop.freelancerName}</Link>
                            </h4>
                            <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
                              {prop.freelancerTitle} • <Star size={12} fill="#D6B46A" color="#D6B46A" style={{ verticalAlign: 'middle' }} /> {prop.freelancerRating || 5.0}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                            {formatINR(prop.bidAmount)}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)' }}>
                            in {prop.estimatedDays} days
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)', lineHeight: 1.55, margin: '0.75rem 0' }}>
                        {prop.coverLetter}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
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
                          {prop.status}
                        </span>

                        {prop.status === 'pending' && (project.status === 'Open' || project.status === 'Proposal Submitted') && (
                          <button
                            type="button"
                            onClick={() => handleAcceptProposal(prop.id, prop.freelancerName)}
                            className="btn btn-emerald btn-sm"
                            style={{ gap: '0.35rem' }}
                          >
                            <Check size={14} />
                            <span>Accept & Assign Freelancer</span>
                          </button>
                        )}

                        {prop.status === 'accepted' && (
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-emerald)' }}>
                            ✓ Active Contractor on this Project
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Client Profile & Verification Assurance */}
        <div>
          {/* Client Info Card */}
          <div className="sb-card" style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>About the Client</h3>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                <Building size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {project.clientCompany || project.clientName}
                </h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
                  Contact: {project.clientName}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Location</span>
                <strong>{project.clientLocation || 'India'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Client Rating</span>
                <strong style={{ color: '#B59344' }}>
                  <Star size={13} fill="#D6B46A" color="#D6B46A" style={{ verticalAlign: 'middle' }} /> {project.clientRating || 5.0} / 5
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Payment Verification</span>
                <strong style={{ color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={14} /> Verified Client
                </strong>
              </div>
            </div>
          </div>

          {/* Work Verification Workflow Info */}
          <div
            className="sb-card"
            style={{
              backgroundColor: 'var(--color-cream-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ShieldCheck size={22} color="var(--color-emerald)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  SkillBridge Verification Protocol
                </h4>
                <p style={{ fontSize: '0.83rem', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                  Funds for this project are reserved in advance. The freelancer only gets marked as completed after verified deliverables (code, design, or documentation) are inspected and approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
