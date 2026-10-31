import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, RotateCcw, Briefcase, PlusCircle, ArrowUpDown } from 'lucide-react';
import { getProjects } from '../utils/storage';
import { CATEGORIES } from '../data/mockData';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

export default function ExploreProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = useAuth();
  const [allProjects, setAllProjects] = useState([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [budgetRange, setBudgetRange] = useState('all'); // all | under_25k | 25k_50k | above_50k
  const [statusFilter, setStatusFilter] = useState('all'); // all | open | in_progress | completed
  const [sortBy, setSortBy] = useState('newest'); // newest | budget_high | budget_low

  useEffect(() => {
    setAllProjects(getProjects());
  }, []);

  // Sync state if search params change
  useEffect(() => {
    if (searchParams.get('search')) setSearchTerm(searchParams.get('search'));
    if (searchParams.get('category')) setCategory(searchParams.get('category'));
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All Categories');
    setBudgetRange('all');
    setStatusFilter('all');
    setSortBy('newest');
    setSearchParams({});
  };

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return allProjects
      .filter((project) => {
        // Search term matching title, description, or skills
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = project.title.toLowerCase().includes(q);
          const matchDesc = project.description.toLowerCase().includes(q);
          const matchSkills = project.skills?.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchSkills) return false;
        }

        // Category filter
        if (category !== 'All Categories' && project.category !== category) {
          return false;
        }

        // Status filter
        if (statusFilter === 'open' && project.status !== 'Open') return false;
        if (statusFilter === 'in_progress' && project.status !== 'In Progress' && project.status !== 'Submitted for Review') return false;
        if (statusFilter === 'completed' && project.status !== 'Completed') return false;

        // Budget Range in INR
        if (budgetRange === 'under_25k' && project.budget >= 25000) return false;
        if (budgetRange === '25k_50k' && (project.budget < 25000 || project.budget > 50000)) return false;
        if (budgetRange === 'above_50k' && project.budget <= 50000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'budget_high') return b.budget - a.budget;
        if (sortBy === 'budget_low') return a.budget - b.budget;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [allProjects, searchTerm, category, budgetRange, statusFilter, sortBy]);

  return (
    <div className="sb-container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
            Work Opportunities
          </span>
          <h1 style={{ fontSize: '2.3rem', marginTop: '0.2rem', marginBottom: '0.35rem' }}>
            Explore Verified Client Projects
          </h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem' }}>
            Browse open contracts, send proposals, and get paid securely in Indian Rupees (₹).
          </p>
        </div>

        {role === 'client' && (
          <Link to="/client/post-project" className="btn btn-emerald btn-sm" style={{ gap: '0.4rem' }}>
            <PlusCircle size={15} />
            <span>Post a Project</span>
          </Link>
        )}
      </div>

      {/* Filter Toolbar */}
      <div
        className="sb-card"
        style={{
          padding: '1.25rem',
          marginBottom: '2.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', backgroundColor: 'var(--color-white)' }}>
          <Search size={19} color="var(--color-emerald)" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keywords, required skills (React, Flutter, AWS, UI/UX)..."
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.96rem' }}
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
            alignItems: 'center',
          }}
        >
          {/* Category */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted-text)', display: 'block', marginBottom: '0.25rem' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
            >
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Budget Range (INR) */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted-text)', display: 'block', marginBottom: '0.25rem' }}>
              Budget (INR ₹)
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
            >
              <option value="all">Any Budget</option>
              <option value="under_25k">Under ₹25,000</option>
              <option value="25k_50k">₹25,000 – ₹50,000</option>
              <option value="above_50k">Above ₹50,000</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted-text)', display: 'block', marginBottom: '0.25rem' }}>
              Project Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open for Bidding</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted-text)', display: 'block', marginBottom: '0.25rem' }}>
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
            >
              <option value="newest">Newest First</option>
              <option value="budget_high">Budget: High to Low</option>
              <option value="budget_low">Budget: Low to High</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', gap: '0.35rem', height: '42px' }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-text)' }}>
          Showing <strong>{filteredProjects.length}</strong> project{filteredProjects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects match your search criteria"
          description="Try broadening your filters, searching different keywords, or resetting your filter selections."
          resetText="Clear Filters"
          onReset={handleResetFilters}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} showProgress={true} />
          ))}
        </div>
      )}
    </div>
  );
}
