import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, IndianRupee, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createProject } from '../utils/storage';
import { validateProjectPost } from '../utils/validators';
import { CATEGORIES } from '../data/mockData';

export default function PostProject() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    skills: 'React.js, Node.js, Tailwind CSS',
    budget: 35000,
    duration: '3 Weeks',
    deadline: '',
    experienceLevel: 'Intermediate',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = CATEGORIES.filter((c) => c !== 'All Categories');

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

    const validation = validateProjectPost(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const skillsArray = typeof formData.skills === 'string'
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.skills;

      const created = createProject(
        {
          ...formData,
          budget: Number(formData.budget),
          skills: skillsArray,
        },
        user
      );

      navigate(`/projects/${created.id}`);
    } catch (err) {
      console.error(err);
      setGeneralError('Failed to publish project. Please verify inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sb-container sb-container-narrow" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
          <PlusCircle size={15} /> Publish New Contract
        </div>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}>Post a New Project</h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
          Define your project scope, timeline, and milestone budget in Indian Rupees (₹). Verified freelancers will submit bids for your review.
        </p>
      </div>

      <div className="sb-card" style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem' }}>
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
          {/* Project Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Project Title *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Build Responsive React Dashboard with GST Invoice Export"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Category & Experience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
              >
                {availableCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experienceLevel">
                Experience Level Needed
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Beginner">Beginner (1-2 years)</option>
                <option value="Intermediate">Intermediate (3-5 years)</option>
                <option value="Expert">Expert (5+ years)</option>
              </select>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Project Description & Deliverables *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive explanation of what you need built, key milestones, user stories, and acceptance criteria..."
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {/* Required Skills */}
          <div className="form-group">
            <label className="form-label" htmlFor="skills">
              Required Skills (comma separated) *
            </label>
            <input
              id="skills"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React.js, Tailwind CSS, Node.js, MongoDB"
              className={`form-control ${errors.skills ? 'is-invalid' : ''}`}
            />
            {errors.skills && <span className="form-error">{errors.skills}</span>}
          </div>

          {/* Budget, Duration, Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {/* Budget in INR */}
            <div className="form-group">
              <label className="form-label" htmlFor="budget">
                Budget (₹ INR) *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-muted-text)', fontWeight: 700 }}>
                  ₹
                </span>
                <input
                  id="budget"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="35000"
                  style={{ paddingLeft: '2rem' }}
                  className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.budget && <span className="form-error">{errors.budget}</span>}
            </div>

            {/* Estimated Duration */}
            <div className="form-group">
              <label className="form-label" htmlFor="duration">
                Estimated Duration
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-control"
              >
                <option value="1 Week">1 Week</option>
                <option value="2 Weeks">2 Weeks</option>
                <option value="3 Weeks">3 Weeks</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3+ Months">3+ Months</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="form-group">
              <label className="form-label" htmlFor="deadline">
                Deadline Date *
              </label>
              <input
                id="deadline"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
              />
              {errors.deadline && <span className="form-error">{errors.deadline}</span>}
            </div>
          </div>

          {/* Work Verification info */}
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
              <strong>Work Verification Protection:</strong> Your project will require the assigned freelancer to submit verified URLs (e.g. GitHub repo, Figma links, or deployed demos) with deliverable notes before completion approval.
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-emerald btn-lg btn-block"
            style={{ marginTop: '1rem', gap: '0.5rem' }}
          >
            <span>{isSubmitting ? 'Publishing...' : 'Publish Project'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
