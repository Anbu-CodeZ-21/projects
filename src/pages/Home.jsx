import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  Code,
  Smartphone,
  Palette,
  Server,
  Cpu,
  PenTool,
  CheckCircle2,
  Users,
  IndianRupee,
  Clock,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { getProjects, getFreelancers } from '../utils/storage';
import ProjectCard from '../components/ProjectCard';
import FreelancerCard from '../components/FreelancerCard';
import { formatINR } from '../utils/currency';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const allProjects = getProjects();
  const allFreelancers = getFreelancers();

  // Take top 3 projects and top 3 freelancers for featured sections
  const featuredProjects = allProjects.slice(0, 3);
  const featuredFreelancers = allFreelancers.slice(0, 3);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/projects');
    }
  };

  const categories = [
    { name: 'Web Development', icon: Code, count: '142 Open Projects', desc: 'React, Node.js, Next.js, full-stack web solutions' },
    { name: 'Mobile Apps', icon: Smartphone, count: '89 Open Projects', desc: 'Flutter, React Native, iOS and Android apps' },
    { name: 'UI/UX Design', icon: Palette, count: '67 Open Projects', desc: 'Figma prototypes, design systems & mobile UI' },
    { name: 'Backend & APIs', icon: Server, count: '54 Open Projects', desc: 'Microservices, REST & GraphQL endpoints, databases' },
    { name: 'Data Science & AI', icon: Cpu, count: '76 Open Projects', desc: 'LLMs, RAG pipelines, LangChain, PyTorch' },
    { name: 'Content & Copywriting', icon: PenTool, count: '48 Open Projects', desc: 'Technical documentation, blogs, SEO copywriting' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern" />
        <div className="sb-container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <ShieldCheck size={16} />
                <span>India's Work Verification & Milestone Platform</span>
              </div>

              <h1 className="hero-title">
                Hire Verified Talent. <span>Track Work Live.</span> Pay with Confidence.
              </h1>

              <p className="hero-desc">
                SkillBridge eliminates uncertainty in freelance work. Clients post projects with milestone budgets in Indian Rupees (₹), review verified deliverable links, and approve finished work with zero disputes.
              </p>

              {/* Quick Search Form */}
              <form
                onSubmit={handleHeroSearch}
                style={{
                  display: 'flex',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.45rem',
                  boxShadow: 'var(--shadow-xl)',
                  maxWidth: '640px',
                  marginBottom: '2rem',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 0.85rem', gap: '0.65rem' }}>
                  <Search size={20} color="var(--color-muted-text)" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Try 'React Developer', 'Flutter App', 'Figma UI'..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.98rem',
                      color: 'var(--color-charcoal)',
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-gold" style={{ padding: '0.75rem 1.6rem' }}>
                  Search
                </button>
              </form>

              {/* CTA Buttons */}
              <div className="hero-cta-group">
                <Link to="/choose-role" className="btn btn-gold btn-lg" style={{ gap: '0.5rem' }}>
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/projects"
                  className="btn btn-secondary btn-lg"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: 'var(--color-white)', borderColor: 'rgba(255, 255, 255, 0.35)' }}
                >
                  Explore Projects
                </Link>
              </div>
            </div>

            {/* Right Brand Showcase Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
                  border: '2px solid rgba(199, 140, 58, 0.35)',
                  maxWidth: '420px',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                    backgroundColor: '#F7F5EF',
                  }}
                >
                  <img
                    src="/skillbridge-logo.jpg"
                    alt="SkillBridge Official Logo"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left', marginTop: '1.25rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--color-cream-surface)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.84rem',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-cream-border)',
                    }}
                  >
                    <ShieldCheck size={18} color="var(--color-emerald)" style={{ flexShrink: 0 }} />
                    <span><strong>100% Milestone Verification:</strong> Deliverable URLs checked before payment</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--color-cream-surface)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.84rem',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-cream-border)',
                    }}
                  >
                    <IndianRupee size={17} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                    <span><strong>Indian Rupee Standard:</strong> Zero currency loss, direct local rates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Metric Highlights Bar */}
      <section style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)', padding: '2rem 0' }}>
        <div className="sb-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                ₹2.5 Cr+
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', fontWeight: 600 }}>
                Paid to Indian Freelancers
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-emerald)', fontFamily: 'var(--font-display)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', fontWeight: 600 }}>
                Verified Deliverables Required
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-terracotta)', fontFamily: 'var(--font-display)' }}>
                4,800+
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', fontWeight: 600 }}>
                Completed Client Projects
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#B59344', fontFamily: 'var(--font-display)' }}>
                4.9 / 5
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', fontWeight: 600 }}>
                Average Client Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the Work Verification Workflow Works */}
      <section style={{ padding: '5rem 0' }}>
        <div className="sb-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--color-emerald)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'inline-block',
                marginBottom: '0.5rem',
              }}
            >
              How It Works
            </span>
            <h2 style={{ fontSize: '2.35rem', marginBottom: '1rem' }}>
              The 5-Step Work Verification Process
            </h2>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '1.05rem' }}>
              Say goodbye to ghosting and incomplete work. Every project is tracked from proposal submission to verified completion.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                step: '01',
                title: 'Client Posts Project',
                desc: 'Client sets a clear project scope, required skills, and milestone budget in Indian Rupees (₹).',
              },
              {
                step: '02',
                title: 'Proposals & Match',
                desc: 'Freelancers send bids with estimated days and cover letter. Client reviews and accepts the right match.',
              },
              {
                step: '03',
                title: 'Active Progress',
                desc: 'Freelancer works on the task and updates milestone percentages, keeping the client informed.',
              },
              {
                step: '04',
                title: 'Deliverable Verification',
                desc: 'Freelancer submits live delivery URLs (GitHub, Figma, Live demo) with comprehensive handover notes.',
              },
              {
                step: '05',
                title: 'Client Approves Work',
                desc: 'Client verifies the link, approves completed work, or requests revisions with targeted feedback.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="sb-card"
                style={{
                  position: 'relative',
                  borderTop: '3px solid var(--color-emerald)',
                }}
              >
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: 'var(--color-gold)',
                    fontFamily: 'var(--font-display)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ backgroundColor: 'var(--color-cream-surface)', padding: '5rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="sb-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
                Categories
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>Popular Skill Domains</h2>
            </div>
            <Link to="/projects" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <span>Browse All Categories</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {categories.map((cat, i) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={i}
                  to={`/projects?category=${encodeURIComponent(cat.name)}`}
                  className="sb-card sb-card-hover"
                  style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: '3.2rem',
                      height: '3.2rem',
                      backgroundColor: 'var(--color-cream)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.3rem' }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--color-muted-text)', marginBottom: '0.5rem' }}>{cat.desc}</p>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald)' }}>{cat.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ padding: '5rem 0' }}>
        <div className="sb-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
                Latest Postings
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>Featured Client Projects</h2>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '0.98rem' }}>
                Explore active projects with clear requirements and milestone budgets in INR (₹).
              </p>
            </div>
            <Link to="/projects" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <span>View All Projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} showProgress={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section style={{ backgroundColor: 'var(--color-cream-surface)', padding: '5rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="sb-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
                Verified Talent
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>Top-Rated Freelancers</h2>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '0.98rem' }}>
                Skilled developers, designers, and specialists ready to work on your next big milestone.
              </p>
            </div>
            <Link to="/freelancers" className="btn btn-secondary" style={{ gap: '0.4rem' }}>
              <span>Find More Freelancers</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {featuredFreelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '5rem 0' }}>
        <div className="sb-container">
          <div
            style={{
              background: 'linear-gradient(145deg, #123C32, #1f624d)',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2.5rem',
              color: 'var(--color-white)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-gold)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={15} /> Join Thousands of Indian Professionals
              </div>
              <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.25 }}>
                Ready to Experience Seamless Work Verification?
              </h2>
              <p style={{ color: '#E2DDD4', fontSize: '1.1rem', marginBottom: '2.25rem', lineHeight: 1.6 }}>
                Whether you are a freelancer seeking guaranteed payments in INR or a client wanting verified deliverables before releasing funds, SkillBridge is built for you.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register/freelancer" className="btn btn-emerald btn-lg">
                  Join as Freelancer
                </Link>
                <Link to="/register/client" className="btn btn-terracotta btn-lg">
                  Hire as Client
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
