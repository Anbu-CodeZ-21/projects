import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, ArrowRight, FileCheck, Layers, Users, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../utils/storage';
import { formatINR } from '../utils/currency';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function MyProjects() {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const allProj = getProjects();
    if (role === 'freelancer') {
      const myProj = allProj.filter((p) => p.assignedFreelancerId === user?.id);
      setProjects(myProj);
    } else {
      const myProj = allProj.filter((p) => p.clientId === user?.id);
      setProjects(myProj);
    }
  }, [user, role]);

  const filteredProjects = useMemo(() => {
    if (statusFilter === 'all') return projects;
    if (statusFilter === 'active') {
      return projects.filter((p) => p.status === 'In Progress' || p.status === 'Revision Requested' || p.status === 'Submitted for Review');
    }
    if (statusFilter === 'open') {
      return projects.filter((p) => p.status === 'Open' || p.status === 'Proposal Submitted');
    }
    if (statusFilter === 'completed') {
      return projects.filter((p) => p.status === 'Completed');
    }
    return projects;
  }, [projects, statusFilter]);

  const isFreelancer = role === 'freelancer';

  return (
    <div className="sb-container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isFreelancer ? 'var(--color-emerald)' : 'var(--color-terracotta)', textTransform: 'uppercase' }}>
            {isFreelancer ? 'Freelancer Contracts' : 'Client Projects'}
          </span>
          <h1 style={{ fontSize: '2.3rem', marginTop: '0.2rem', marginBottom: '0.35rem' }}>
            {isFreelancer ? 'My Active & Completed Projects' : 'My Posted Projects'}
          </h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem' }}>
            {isFreelancer
              ? 'Manage your milestones, update project progress, and submit work for verification.'
              : 'Monitor incoming proposals, track assigned freelancers, and inspect deliverables.'}
          </p>
        </div>

        {!isFreelancer && (
          <Link to="/client/post-project" className="btn btn-emerald btn-sm" style={{ gap: '0.4rem' }}>
            <PlusCircle size={15} />
            <span>Post New Project</span>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
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
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Projects ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('active')}
          className={`btn btn-sm ${statusFilter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Active / In Progress ({projects.filter((p) => p.status !== 'Completed' && p.status !== 'Open').length})
        </button>
        {!isFreelancer && (
          <button
            type="button"
            onClick={() => setStatusFilter('open')}
            className={`btn btn-sm ${statusFilter === 'open' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Open for Bidding ({projects.filter((p) => p.status === 'Open' || p.status === 'Proposal Submitted').length})
          </button>
        )}
        <button
          type="button"
          onClick={() => setStatusFilter('completed')}
          className={`btn btn-sm ${statusFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Completed ({projects.filter((p) => p.status === 'Completed').length})
        </button>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No projects found"
          description={
            isFreelancer
              ? 'You have not been assigned to any project in this category yet. Explore projects to submit proposals.'
              : 'You have no projects in this category. Post a new project to start hiring verified talent.'
          }
          actionText={isFreelancer ? 'Explore Projects' : 'Post a Project'}
          actionLink={isFreelancer ? '/projects' : '/client/post-project'}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="sb-card"
              style={{
                borderLeft:
                  project.status === 'Completed'
                    ? '4px solid var(--color-emerald)'
                    : project.status === 'Revision Requested'
                    ? '4px solid var(--color-terracotta)'
                    : '4px solid var(--color-primary)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
                      {project.category}
                    </span>
                    <StatusBadge status={project.status} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    <Link to={`/projects/${project.id}`} style={{ color: 'var(--color-primary)' }}>
                      {project.title}
                    </Link>
                  </h3>
                  <div style={{ fontSize: '0.86rem', color: 'var(--color-muted-text)', marginTop: '0.35rem' }}>
                    {isFreelancer ? (
                      <span>Client: <strong>{project.clientCompany || project.clientName}</strong></span>
                    ) : (
                      <span>
                        Assigned Freelancer:{' '}
                        <strong>{project.assignedFreelancerName || 'Not yet assigned'}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                    {formatINR(project.budget)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
                    Deadline: <strong>{project.deadline || 'Flexible'}</strong>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Active Projects */}
              {project.status !== 'Open' && (
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Milestone Progress</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>{project.progress || 0}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${project.progress || 0}%` }} />
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)' }}>
                  Duration: <strong>{project.duration}</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {project.status !== 'Open' && (
                    <Link
                      to={`/work-verification?project=${project.id}`}
                      className="btn btn-emerald btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <FileCheck size={14} />
                      <span>Work Verification</span>
                    </Link>
                  )}
                  <Link
                    to={`/projects/${project.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <span>Project Overview</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
