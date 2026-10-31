import React, { useState, useEffect } from 'react';
import { Settings, User, Building, Save, CheckCircle2, RotateCcw, AlertTriangle, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resetDemoData } from '../utils/storage';

export default function ProfileSettings() {
  const { user, role, updateProfile } = useAuth();
  const isFreelancer = role === 'freelancer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    hourlyRate: 1500,
    skills: '',
    location: '',
    companyName: '',
    industry: '',
    website: '',
    availability: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        title: user.title || '',
        bio: user.bio || '',
        hourlyRate: user.hourlyRate || 1500,
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '',
        location: user.location || '',
        companyName: user.companyName || '',
        industry: user.industry || '',
        website: user.website || '',
        availability: user.availability || 'Available full-time',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      hourlyRate: Number(formData.hourlyRate) || 0,
    };
    if (isFreelancer && typeof formData.skills === 'string') {
      payload.skills = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    updateProfile(payload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default? Any projects or proposals you created in this browser session will be restored to initial sample state.')) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="sb-container sb-container-narrow" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.35rem' }}>Profile Settings</h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem' }}>
          Update your public profile, rates, credentials, and account settings.
        </p>
      </div>

      {savedSuccess && (
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
          <CheckCircle2 size={18} />
          <span>Your profile settings have been updated successfully!</span>
        </div>
      )}

      {resetSuccess && (
        <div
          style={{
            backgroundColor: 'var(--color-info-bg)',
            color: 'var(--color-info-text)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          <span>Demo data reset. Reloading application...</span>
        </div>
      )}

      <div className="sb-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            {isFreelancer ? <User size={20} color="var(--color-emerald)" /> : <Building size={20} color="var(--color-terracotta)" />}
            <h3 style={{ fontSize: '1.25rem' }}>
              {isFreelancer ? 'Freelancer Public Profile' : 'Client Organization Details'}
            </h3>
          </div>

          {/* Name & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Registered Email (Read Only)
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="form-control"
                style={{ backgroundColor: 'var(--color-cream)', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          {/* Freelancer Specific Fields */}
          {isFreelancer && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Professional Title / Headline *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Senior Full-Stack MERN & Next.js Developer"
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="hourlyRate">
                    Hourly Rate (₹ INR) *
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-muted-text)', fontWeight: 700 }}>
                      ₹
                    </span>
                    <input
                      id="hourlyRate"
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      style={{ paddingLeft: '2rem' }}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="availability">
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Available full-time">Available full-time (40 hrs/wk)</option>
                    <option value="Available part-time">Available part-time (20 hrs/wk)</option>
                    <option value="Weekends only">Weekends only</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="skills">
                  Technical Skills (comma separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </>
          )}

          {/* Client Specific Fields */}
          {!isFreelancer && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="companyName">
                  Company / Organization Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="industry">
                    Industry / Sector
                  </label>
                  <input
                    id="industry"
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="website">
                    Company Website URL
                  </label>
                  <input
                    id="website"
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </>
          )}

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Location (City, State)
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru, Karnataka"
              className="form-control"
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              {isFreelancer ? 'Professional Overview & Bio' : 'About the Company'}
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ gap: '0.5rem', marginTop: '1rem' }}
          >
            <Save size={18} />
            <span>Save Profile Changes</span>
          </button>
        </form>
      </div>

      {/* Danger Zone / Reset Demo Data */}
      <div
        className="sb-card"
        style={{
          border: '1.5px solid #F5B7B1',
          backgroundColor: '#FDEDEC',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#922B21', fontWeight: 700, marginBottom: '0.35rem' }}>
              <AlertTriangle size={18} />
              <span>Developer & Testing Zone</span>
            </div>
            <h4 style={{ fontSize: '1.1rem', color: '#922B21', marginBottom: '0.35rem' }}>
              Reset Platform Demo Data
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-charcoal)', maxWidth: '480px' }}>
              Restore all projects, proposals, mock accounts, and statuses to their initial seed state. Helpful for testing multiple workflows.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="btn btn-terracotta btn-sm"
            style={{ gap: '0.4rem', alignSelf: 'center' }}
          >
            <RotateCcw size={15} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
