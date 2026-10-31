import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, ArrowLeft, IndianRupee, Clock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProjectById, getProposals, submitProposal } from '../utils/storage';
import { formatINR } from '../utils/currency';
import { validateProposal } from '../utils/validators';

export default function SubmitProposal() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [formData, setFormData] = useState({
    bidAmount: '',
    estimatedDays: 14,
    coverLetter: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const p = getProjectById(id);
    setProject(p);
    if (p) {
      setFormData((prev) => ({
        ...prev,
        bidAmount: p.budget || '',
      }));

      const allProps = getProposals();
      const existing = allProps.find((pr) => pr.projectId === p.id && pr.freelancerId === user?.id);
      if (existing) {
        setAlreadyApplied(true);
      }
    }
  }, [id, user]);

  if (!project) {
    return (
      <div className="sb-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Project Not Found</h2>
        <Link to="/projects" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Projects
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');

    const validation = validateProposal(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      submitProposal(
        {
          projectId: project.id,
          projectTitle: project.title,
          bidAmount: formData.bidAmount,
          estimatedDays: formData.estimatedDays,
          coverLetter: formData.coverLetter,
        },
        user
      );

      navigate(`/freelancer/proposals`);
    } catch (err) {
      console.error(err);
      setGeneralError('Failed to submit proposal. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sb-container sb-container-narrow" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/projects/${project.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Project Details</span>
        </Link>
      </div>

      {/* Project Quick Context Card */}
      <div className="sb-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-emerald)' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
          Submitting Proposal For
        </span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.35rem 0 0.5rem' }}>
          {project.title}
        </h2>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--color-muted-text)', flexWrap: 'wrap' }}>
          <span>Client: <strong>{project.clientCompany || project.clientName}</strong></span>
          <span>Client Budget: <strong style={{ color: 'var(--color-primary)' }}>{formatINR(project.budget)}</strong></span>
          <span>Category: <strong>{project.category}</strong></span>
        </div>
      </div>

      {alreadyApplied ? (
        <div className="sb-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-emerald-light)',
              color: 'var(--color-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Proposal Already Submitted</h2>
          <p style={{ color: 'var(--color-muted-text)', maxWidth: '420px', margin: '0 auto 1.75rem' }}>
            You have already sent a proposal for this project. You can track client acceptance in your proposals tab.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/freelancer/proposals" className="btn btn-primary btn-sm">
              View My Proposals
            </Link>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              Explore More Projects
            </Link>
          </div>
        </div>
      ) : (
        <div className="sb-card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Your Terms & Technical Pitch
            </h1>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem' }}>
              Explain how you plan to tackle this project and specify your milestone bid in Indian Rupees.
            </p>
          </div>

          {generalError && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-danger-bg)',
                color: 'var(--color-danger-text)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Bid Amount & Days */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="bidAmount">
                  Your Bid Amount (₹ INR) *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-muted-text)', fontWeight: 700 }}>
                    ₹
                  </span>
                  <input
                    id="bidAmount"
                    type="number"
                    name="bidAmount"
                    value={formData.bidAmount}
                    onChange={handleChange}
                    placeholder="35000"
                    style={{ paddingLeft: '2rem' }}
                    className={`form-control ${errors.bidAmount ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.bidAmount ? (
                  <span className="form-error">{errors.bidAmount}</span>
                ) : (
                  <span className="form-hint">Client's listed budget is {formatINR(project.budget)}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="estimatedDays">
                  Estimated Delivery (Days) *
                </label>
                <input
                  id="estimatedDays"
                  type="number"
                  name="estimatedDays"
                  min="1"
                  max="365"
                  value={formData.estimatedDays}
                  onChange={handleChange}
                  className={`form-control ${errors.estimatedDays ? 'is-invalid' : ''}`}
                />
                {errors.estimatedDays && <span className="form-error">{errors.estimatedDays}</span>}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="form-group">
              <label className="form-label" htmlFor="coverLetter">
                Cover Letter & Implementation Strategy *
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={6}
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Detail your approach, similar projects you have built, tech stack choices, milestone check-ins, and how you will deliver verified deliverables..."
                className={`form-control ${errors.coverLetter ? 'is-invalid' : ''}`}
              />
              {errors.coverLetter && <span className="form-error">{errors.coverLetter}</span>}
              <span className="form-hint">A tailored, thoughtful pitch increases client acceptance rates by 3x.</span>
            </div>

            {/* Verification Guarantee Notice */}
            <div
              style={{
                backgroundColor: 'var(--color-cream-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                margin: '1.25rem 0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
              }}
            >
              <ShieldCheck size={20} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.84rem', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                <strong>Verification Commitment:</strong> By submitting, you agree to provide testable, live deliverables (such as public Git repos, hosted links, or Figma designs) upon milestone completion.
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-emerald btn-lg btn-block"
              style={{ marginTop: '1rem', gap: '0.5rem' }}
            >
              <Send size={18} />
              <span>{isSubmitting ? 'Sending Proposal...' : 'Send Proposal to Client'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
