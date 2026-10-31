import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  RotateCcw,
  Star,
  Clock,
  ShieldCheck,
  IndianRupee,
  Layers,
  ArrowRight,
  User,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getProjects,
  getProjectById,
  updateProjectProgress,
  submitWorkDelivery,
  reviewWorkDelivery,
} from '../utils/storage';
import { formatINR } from '../utils/currency';
import { validateWorkSubmission } from '../utils/validators';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function WorkVerification() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, role } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get('project') || '');
  const [project, setProject] = useState(null);

  // Freelancer progress & submission states
  const [currentProgress, setCurrentProgress] = useState(50);
  const [deliveryUrl, setDeliveryUrl] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [submissionErrors, setSubmissionErrors] = useState({});

  // Client review states
  const [reviewAction, setReviewAction] = useState('approve'); // 'approve' | 'revision'
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Status feedback toast/banner
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const loadData = () => {
    const allProj = getProjects();
    // Filter relevant projects for this user
    let relevant = [];
    if (role === 'freelancer') {
      relevant = allProj.filter((p) => p.assignedFreelancerId === user?.id);
    } else {
      relevant = allProj.filter((p) => p.clientId === user?.id);
    }
    setProjects(relevant);

    // Pick active or matching project
    const requestedId = searchParams.get('project') || selectedProjectId;
    let target = relevant.find((p) => p.id === requestedId);
    if (!target && relevant.length > 0) {
      target = relevant[0];
    }
    if (target) {
      setSelectedProjectId(target.id);
      setProject(target);
      setCurrentProgress(target.progress || 50);
      if (target.delivery) {
        setDeliveryUrl(target.delivery.deliveryUrl || '');
        setDeliveryNotes(target.delivery.deliveryNotes || '');
      } else {
        setDeliveryUrl('');
        setDeliveryNotes('');
      }
    } else {
      setProject(null);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, role, searchParams]);

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setSearchParams({ project: id });
    const p = projects.find((item) => item.id === id);
    if (p) {
      setProject(p);
      setCurrentProgress(p.progress || 50);
      if (p.delivery) {
        setDeliveryUrl(p.delivery.deliveryUrl || '');
        setDeliveryNotes(p.delivery.deliveryNotes || '');
      } else {
        setDeliveryUrl('');
        setDeliveryNotes('');
      }
    }
  };

  // Freelancer: update progress slider
  const handleSaveProgress = () => {
    if (!project) return;
    updateProjectProgress(project.id, currentProgress);
    setFeedbackMessage({ type: 'success', text: `Project progress updated to ${currentProgress}%!` });
    loadData();
  };

  // Freelancer: submit deliverables
  const handleSubmitDelivery = (e) => {
    e.preventDefault();
    setSubmissionErrors({});

    const validation = validateWorkSubmission({ deliveryUrl, deliveryNotes });
    if (!validation.isValid) {
      setSubmissionErrors(validation.errors);
      return;
    }

    const updated = submitWorkDelivery(project.id, { deliveryUrl, deliveryNotes }, user);
    if (updated) {
      setFeedbackMessage({
        type: 'success',
        text: 'Work submitted for review! The client has been notified to verify your deliverable link.',
      });
      loadData();
    }
  };

  // Client: review deliverable (Approve or Request Revision)
  const handleClientReview = (e) => {
    e.preventDefault();
    if (!project) return;

    if (reviewAction === 'revision' && (!reviewNotes || reviewNotes.trim().length < 10)) {
      alert('Please provide detailed revision instructions (at least 10 characters) explaining what needs adjustment.');
      return;
    }

    const updated = reviewWorkDelivery(
      project.id,
      {
        action: reviewAction,
        feedbackNotes: reviewNotes,
        rating: reviewRating,
      },
      user
    );

    if (updated) {
      if (reviewAction === 'approve') {
        setFeedbackMessage({
          type: 'success',
          text: `Project verified & approved! Payment of ${formatINR(project.budget)} has been recorded as cleared.`,
        });
      } else {
        setFeedbackMessage({
          type: 'info',
          text: 'Revision request sent to the freelancer. They will be notified to make changes and resubmit.',
        });
      }
      loadData();
    }
  };

  const isFreelancer = role === 'freelancer';

  return (
    <div className="sb-container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            backgroundColor: 'var(--color-emerald-light)',
            color: 'var(--color-emerald)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <ShieldCheck size={16} /> Work Verification Protocol
        </div>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.35rem' }}>
          Work Verification & Deliverables Hub
        </h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem', maxWidth: '680px' }}>
          The core verification stage: Freelancers submit live delivery URLs and track progress. Clients inspect submissions and either approve completion or request revisions.
        </p>
      </div>

      {feedbackMessage && (
        <div
          style={{
            backgroundColor: feedbackMessage.type === 'success' ? 'var(--color-success-bg)' : 'var(--color-info-bg)',
            color: feedbackMessage.type === 'success' ? 'var(--color-success-text)' : 'var(--color-info-text)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            style={{ fontWeight: 700, color: 'inherit', fontSize: '0.82rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* If user has no relevant projects */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No projects in verification right now"
          description={
            isFreelancer
              ? 'You do not have any active projects assigned to you yet. Explore available jobs and submit proposals to get started.'
              : 'You have not assigned any freelancers to active projects yet. Post a project or review received proposals.'
          }
          actionText={isFreelancer ? 'Explore Projects' : 'Post a Project'}
          actionLink={isFreelancer ? '/projects' : '/client/post-project'}
        />
      ) : (
        <>
          {/* Project Selector Bar */}
          <div
            className="sb-card"
            style={{
              padding: '1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
              <label htmlFor="selectProject" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                Select Project:
              </label>
              <select
                id="selectProject"
                value={selectedProjectId}
                onChange={(e) => handleSelectProject(e.target.value)}
                className="form-control"
                style={{ fontWeight: 600, color: 'var(--color-primary)' }}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.status} - {formatINR(p.budget)})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {project && <StatusBadge status={project.status} />}
              <Link to={`/projects/${project?.id}`} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
                <span>View Full Spec</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {project && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.8fr 1.2fr',
                gap: '2rem',
              }}
            >
              {/* Left Column: Role-Specific Action Forms & Verification Status */}
              <div>
                {/* 1. FREELANCER PERSPECTIVE */}
                {isFreelancer && (
                  <>
                    {/* Active In-Progress: Progress updater */}
                    {(project.status === 'In Progress' || project.status === 'Revision Requested') && (
                      <div className="sb-card" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Milestone Progress Tracker</h3>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-emerald)' }}>
                            {currentProgress}%
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', marginBottom: '1.25rem' }}>
                          Keep your client updated on project completion percentage as you work through key milestones.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={currentProgress}
                            onChange={(e) => setCurrentProgress(Number(e.target.value))}
                            style={{ flex: 1, accentColor: 'var(--color-emerald)', cursor: 'pointer' }}
                          />
                          <button
                            type="button"
                            onClick={handleSaveProgress}
                            className="btn btn-secondary btn-sm"
                          >
                            Update Progress
                          </button>
                        </div>

                        <div className="progress-bar-wrap">
                          <div className="progress-bar-fill" style={{ width: `${currentProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Revision Feedback Notice (if revisions were requested) */}
                    {project.status === 'Revision Requested' && project.revisionFeedback && (
                      <div
                        style={{
                          backgroundColor: '#FDF2EE',
                          border: '1.5px solid var(--color-terracotta)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.5rem',
                          marginBottom: '2rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-terracotta)', fontWeight: 700, marginBottom: '0.5rem' }}>
                          <AlertCircle size={20} />
                          <span>Client Revision Request & Feedback Notes</span>
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                          "{project.revisionFeedback.feedbackNotes}"
                        </p>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)', marginTop: '0.5rem' }}>
                          Requested on {new Date(project.revisionFeedback.requestedAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}

                    {/* Submission / Resubmission Form */}
                    {(project.status === 'In Progress' || project.status === 'Revision Requested') && (
                      <div className="sb-card">
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                            {project.status === 'Revision Requested' ? 'Resubmit Revised Deliverables' : 'Submit Finished Work for Verification'}
                          </h3>
                          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.9rem' }}>
                            Provide verifiable links to your code repository, live deployed preview, Figma workspace, or deliverables package.
                          </p>
                        </div>

                        <form onSubmit={handleSubmitDelivery}>
                          <div className="form-group">
                            <label className="form-label" htmlFor="deliveryUrl">
                              Deliverable / Production URL *
                            </label>
                            <input
                              id="deliveryUrl"
                              type="url"
                              value={deliveryUrl}
                              onChange={(e) => {
                                setDeliveryUrl(e.target.value);
                                if (submissionErrors.deliveryUrl) setSubmissionErrors((prev) => ({ ...prev, deliveryUrl: null }));
                              }}
                              placeholder="https://github.com/username/project or https://myproject.vercel.app"
                              className={`form-control ${submissionErrors.deliveryUrl ? 'is-invalid' : ''}`}
                            />
                            {submissionErrors.deliveryUrl && (
                              <span className="form-error">{submissionErrors.deliveryUrl}</span>
                            )}
                            <span className="form-hint">
                              Must be an active, publicly accessible or client-shared link.
                            </span>
                          </div>

                          <div className="form-group">
                            <label className="form-label" htmlFor="deliveryNotes">
                              Handover & Verification Notes *
                            </label>
                            <textarea
                              id="deliveryNotes"
                              rows={5}
                              value={deliveryNotes}
                              onChange={(e) => {
                                setDeliveryNotes(e.target.value);
                                if (submissionErrors.deliveryNotes) setSubmissionErrors((prev) => ({ ...prev, deliveryNotes: null }));
                              }}
                              placeholder="Describe what has been delivered, how the client can test the implementation, any demo login credentials, and milestone highlights..."
                              className={`form-control ${submissionErrors.deliveryNotes ? 'is-invalid' : ''}`}
                            />
                            {submissionErrors.deliveryNotes && (
                              <span className="form-error">{submissionErrors.deliveryNotes}</span>
                            )}
                          </div>

                          <button
                            type="submit"
                            className="btn btn-emerald btn-lg btn-block"
                            style={{ gap: '0.4rem', marginTop: '1rem' }}
                          >
                            <Send size={16} />
                            <span>
                              {project.status === 'Revision Requested'
                                ? 'Resubmit Deliverables for Review'
                                : 'Submit Work for Client Approval'}
                            </span>
                          </button>
                        </form>
                      </div>
                    )}

                    {/* When already Submitted for Review */}
                    {project.status === 'Submitted for Review' && (
                      <div className="sb-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div
                          style={{
                            width: '4.5rem',
                            height: '4.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: '#F4ECF7',
                            color: '#7D3C98',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                          }}
                        >
                          <Clock size={36} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                          Submitted for Client Verification
                        </h3>
                        <p style={{ color: 'var(--color-muted-text)', maxWidth: '460px', margin: '0 auto 1.75rem' }}>
                          Your deliverables have been submitted. The client is inspecting the work. Once approved, the payment of {formatINR(project.budget)} will be released.
                        </p>

                        <div style={{ backgroundColor: 'var(--color-cream-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', marginBottom: '0.25rem' }}>Submitted URL:</div>
                          <div style={{ wordBreak: 'break-all', marginBottom: '0.75rem' }}>
                            <a href={project.delivery?.deliveryUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: 'var(--color-emerald)' }}>
                              {project.delivery?.deliveryUrl}
                            </a>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', marginBottom: '0.25rem' }}>Notes:</div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>{project.delivery?.deliveryNotes}</p>
                        </div>
                      </div>
                    )}

                    {/* When Completed */}
                    {project.status === 'Completed' && (
                      <div className="sb-card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '4px solid var(--color-emerald)' }}>
                        <div
                          style={{
                            width: '4.5rem',
                            height: '4.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--color-emerald-light)',
                            color: 'var(--color-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                          }}
                        >
                          <CheckCircle2 size={38} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                          Project Successfully Completed! 🎉
                        </h3>
                        <p style={{ color: 'var(--color-muted-text)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                          The client approved your deliverables. Payment of <strong>{formatINR(project.budget)}</strong> has been credited to your verified platform earnings.
                        </p>

                        {project.clientReview && (
                          <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', maxWidth: '480px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={18}
                                  fill={i < project.clientReview.rating ? '#D6B46A' : 'none'}
                                  color="#D6B46A"
                                />
                              ))}
                            </div>
                            <p style={{ fontStyle: 'italic', color: 'var(--color-charcoal)', fontSize: '0.92rem' }}>
                              "{project.clientReview.comment}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* 2. CLIENT PERSPECTIVE */}
                {!isFreelancer && (
                  <>
                    {/* When In Progress */}
                    {project.status === 'In Progress' && (
                      <div className="sb-card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                          Freelancer is Currently Working
                        </h3>
                        <p style={{ color: 'var(--color-muted-text)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                          {project.assignedFreelancerName} is developing this project. Once milestones are complete, they will submit live deliverable URLs for your verification.
                        </p>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            <span style={{ fontWeight: 600 }}>Reported Progress</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>{project.progress || 0}%</span>
                          </div>
                          <div className="progress-bar-wrap">
                            <div className="progress-bar-fill" style={{ width: `${project.progress || 0}%` }} />
                          </div>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)' }}>
                          Assigned to: <strong>{project.assignedFreelancerName}</strong> • Deadline: <strong>{project.deadline}</strong>
                        </div>
                      </div>
                    )}

                    {/* When Revision Requested by Client */}
                    {project.status === 'Revision Requested' && (
                      <div className="sb-card" style={{ padding: '2rem', borderLeft: '4px solid var(--color-terracotta)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-terracotta)', fontWeight: 700, marginBottom: '0.5rem' }}>
                          <AlertCircle size={20} />
                          <span>Revision Pending from Freelancer</span>
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal)', marginBottom: '1rem' }}>
                          You requested revisions on this project. {project.assignedFreelancerName} is currently updating the deliverables.
                        </p>
                        <div style={{ backgroundColor: 'var(--color-cream-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
                          <strong>Your Requested Feedback:</strong>
                          <p style={{ marginTop: '0.3rem', fontStyle: 'italic' }}>
                            "{project.revisionFeedback?.feedbackNotes}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* When Submitted for Review (THE KEY APPROVAL WORKFLOW!) */}
                    {project.status === 'Submitted for Review' && (
                      <div className="sb-card" style={{ padding: '2.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                          <FileCheck size={26} color="var(--color-emerald)" />
                          <div>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Inspect & Verify Deliverable</h3>
                            <span style={{ fontSize: '0.84rem', color: 'var(--color-muted-text)' }}>
                              Submitted by {project.assignedFreelancerName}
                            </span>
                          </div>
                        </div>

                        {/* Deliverable Box */}
                        <div
                          style={{
                            backgroundColor: '#F8FBF9',
                            border: '1.5px solid var(--color-emerald)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.35rem',
                            marginBottom: '2rem',
                          }}
                        >
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                            Verified Delivery Link
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <div style={{ wordBreak: 'break-all', fontSize: '1.05rem', fontWeight: 700 }}>
                              <a
                                href={project.delivery?.deliveryUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                              >
                                {project.delivery?.deliveryUrl}
                              </a>
                            </div>
                            <a
                              href={project.delivery?.deliveryUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-emerald btn-sm"
                              style={{ gap: '0.35rem' }}
                            >
                              <span>Open & Test URL</span>
                              <ExternalLink size={14} />
                            </a>
                          </div>

                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-muted-text)', marginBottom: '0.3rem' }}>
                            Freelancer Delivery Notes:
                          </div>
                          <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                            {project.delivery?.deliveryNotes}
                          </p>
                        </div>

                        {/* Decision Form */}
                        <form onSubmit={handleClientReview}>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Your Verification Decision</h4>

                          {/* Approve vs Revision Selector */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '1rem',
                              marginBottom: '1.5rem',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setReviewAction('approve')}
                              style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: reviewAction === 'approve' ? '2px solid var(--color-emerald)' : '1px solid var(--color-border)',
                                backgroundColor: reviewAction === 'approve' ? 'var(--color-emerald-light)' : 'var(--color-white)',
                                textAlign: 'left',
                                cursor: 'pointer',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-emerald)', marginBottom: '0.25rem' }}>
                                <CheckCircle2 size={18} />
                                <span>Approve & Complete</span>
                              </div>
                              <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal)' }}>
                                Work satisfies requirements. Releases {formatINR(project.budget)}.
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setReviewAction('revision')}
                              style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: reviewAction === 'revision' ? '2px solid var(--color-terracotta)' : '1px solid var(--color-border)',
                                backgroundColor: reviewAction === 'revision' ? 'var(--color-terracotta-light)' : 'var(--color-white)',
                                textAlign: 'left',
                                cursor: 'pointer',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-terracotta)', marginBottom: '0.25rem' }}>
                                <RotateCcw size={18} />
                                <span>Request Revisions</span>
                              </div>
                              <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal)' }}>
                                Deliverable needs fixes before you approve payment.
                              </span>
                            </button>
                          </div>

                          {/* Approval Fields: Rating & Review */}
                          {reviewAction === 'approve' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <div className="form-group">
                                <label className="form-label">
                                  Rating for {project.assignedFreelancerName}
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem', margin: '0.4rem 0' }}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setReviewRating(star)}
                                      style={{ padding: '0.25rem' }}
                                    >
                                      <Star
                                        size={26}
                                        fill={star <= reviewRating ? '#D6B46A' : 'none'}
                                        color="#D6B46A"
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="reviewNotes">
                                  Public Client Review & Feedback
                                </label>
                                <textarea
                                  id="reviewNotes"
                                  rows={3}
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Great work! Delivered according to specifications with clear documentation..."
                                  className="form-control"
                                />
                              </div>

                              <button
                                type="submit"
                                className="btn btn-emerald btn-lg btn-block"
                                style={{ gap: '0.5rem' }}
                              >
                                <CheckCircle2 size={18} />
                                <span>Approve Work & Release {formatINR(project.budget)}</span>
                              </button>
                            </div>
                          )}

                          {/* Revision Fields: Feedback Notes */}
                          {reviewAction === 'revision' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <div className="form-group">
                                <label className="form-label" htmlFor="revisionNotes">
                                  Required Revisions & Specific Adjustments *
                                </label>
                                <textarea
                                  id="revisionNotes"
                                  rows={4}
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Explain what specific issues or bugs need to be resolved before final approval..."
                                  className="form-control"
                                  required
                                />
                              </div>

                              <button
                                type="submit"
                                className="btn btn-terracotta btn-lg btn-block"
                                style={{ gap: '0.5rem' }}
                              >
                                <RotateCcw size={18} />
                                <span>Send Revision Request to Freelancer</span>
                              </button>
                            </div>
                          )}
                        </form>
                      </div>
                    )}

                    {/* When Completed */}
                    {project.status === 'Completed' && (
                      <div className="sb-card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '4px solid var(--color-emerald)' }}>
                        <div
                          style={{
                            width: '4.5rem',
                            height: '4.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--color-emerald-light)',
                            color: 'var(--color-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                          }}
                        >
                          <CheckCircle2 size={38} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                          Project Verified & Completed!
                        </h3>
                        <p style={{ color: 'var(--color-muted-text)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                          You have signed off on this project deliverables. Payment of {formatINR(project.budget)} was cleared to {project.assignedFreelancerName}.
                        </p>

                        {project.delivery?.deliveryUrl && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <a
                              href={project.delivery.deliveryUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ gap: '0.35rem' }}
                            >
                              <span>View Verified Deliverables</span>
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column: Project Overview & Contract Terms */}
              <div>
                <div className="sb-card" style={{ marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Contract Summary</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ color: 'var(--color-muted-text)' }}>Agreed Milestone Budget</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                        {formatINR(project.budget)}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ color: 'var(--color-muted-text)' }}>Current Status</span>
                      <StatusBadge status={project.status} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ color: 'var(--color-muted-text)' }}>Deadline</span>
                      <strong>{project.deadline}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ color: 'var(--color-muted-text)' }}>Client</span>
                      <strong>{project.clientCompany || project.clientName}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-muted-text)' }}>Assigned Contractor</span>
                      <strong style={{ color: 'var(--color-emerald)' }}>{project.assignedFreelancerName || 'Unassigned'}</strong>
                    </div>
                  </div>
                </div>

                {/* Verification Guarantee Card */}
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
                        Verification Protection
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                        Both parties are protected. Freelancers are guaranteed payment when deliverables match the agreed specifications, and clients inspect actual output before releasing funds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
