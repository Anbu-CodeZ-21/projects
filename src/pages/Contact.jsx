import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';
import { isValidEmail } from '../utils/validators';
import Logo from '../components/Logo';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Verification Assistance',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      category: 'Verification Assistance',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="sb-container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Logo size="lg" showTagline={true} />
        </div>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
          Get in Touch
        </span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
          Contact the SkillBridge Team
        </h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1.05rem' }}>
          Have questions about work verification, escrow-style milestones, or need assistance with an ongoing contract? We are here to support you.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1.2fr',
          gap: '2.5rem',
          marginBottom: '4rem',
        }}
      >
        {/* Contact Form */}
        <div className="sb-card" style={{ padding: '2.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
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
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Message Received!</h3>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Thank you for reaching out. A SkillBridge support specialist will reply to your registered email within 2-4 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn btn-secondary btn-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Send Us a Direct Message</h2>

              {error && (
                <div
                  style={{
                    backgroundColor: 'var(--color-danger-bg)',
                    color: 'var(--color-danger-text)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="category">
                    Topic / Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Verification Assistance">Work Verification Assistance</option>
                    <option value="Billing & INR Payments">Billing & INR Milestone Payments</option>
                    <option value="Client Project Support">Client Project Support</option>
                    <option value="Freelancer Profile Help">Freelancer Profile Help</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of inquiry"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  Detailed Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you need assistance with..."
                  className="form-control"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ gap: '0.45rem', marginTop: '0.75rem' }}
              >
                <Send size={16} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Office & FAQ Info */}
        <div>
          <div className="sb-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Platform Support Center</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <MapPin size={20} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Headquarters</div>
                  <div style={{ color: 'var(--color-muted-text)' }}>
                    SkillBridge Digital India Pvt Ltd<br />
                    Koramangala 5th Block, Bengaluru, Karnataka 560095
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <Mail size={20} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Support Email</div>
                  <div style={{ color: 'var(--color-muted-text)' }}>support@skillbridge.in</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <Phone size={20} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Support Hours</div>
                  <div style={{ color: 'var(--color-muted-text)' }}>
                    Monday – Saturday, 9:00 AM – 7:00 PM IST
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ card */}
          <div className="sb-card" style={{ backgroundColor: 'var(--color-cream-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', color: 'var(--color-primary)', fontWeight: 700 }}>
              <HelpCircle size={18} color="var(--color-emerald)" />
              <span>Verification FAQ</span>
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
              <strong>What links can be submitted for verification?</strong><br />
              Freelancers can submit public GitHub/GitLab repositories, hosted demo URLs (e.g. Vercel, Netlify), Figma design files, or cloud folders containing production assets.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
