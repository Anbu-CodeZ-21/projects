import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, RotateCcw, Users, Star, IndianRupee, MapPin } from 'lucide-react';
import { getFreelancers } from '../utils/storage';
import FreelancerCard from '../components/FreelancerCard';
import EmptyState from '../components/EmptyState';

export default function FindFreelancers() {
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all'); // all | 3plus | 5plus | 7plus
  const [rateFilter, setRateFilter] = useState('all'); // all | under_1500 | 1500_2000 | above_2000
  const [sortBy, setSortBy] = useState('rating'); // rating | rate_low | rate_high | completed

  useEffect(() => {
    setAllFreelancers(getFreelancers());
  }, []);

  const handleResetFilters = () => {
    setSearchTerm('');
    setExperienceFilter('all');
    setRateFilter('all');
    setSortBy('rating');
  };

  const filteredFreelancers = useMemo(() => {
    return allFreelancers
      .filter((freelancer) => {
        // Search term matching name, title, bio, or skills
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = freelancer.name.toLowerCase().includes(q);
          const matchTitle = freelancer.title.toLowerCase().includes(q);
          const matchBio = freelancer.bio?.toLowerCase().includes(q);
          const matchSkills = freelancer.skills?.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchTitle && !matchBio && !matchSkills) return false;
        }

        // Experience filter
        if (experienceFilter === '3plus' && freelancer.experienceYears < 3) return false;
        if (experienceFilter === '5plus' && freelancer.experienceYears < 5) return false;
        if (experienceFilter === '7plus' && freelancer.experienceYears < 7) return false;

        // Rate filter in INR
        if (rateFilter === 'under_1500' && freelancer.hourlyRate >= 1500) return false;
        if (rateFilter === '1500_2000' && (freelancer.hourlyRate < 1500 || freelancer.hourlyRate > 2000)) return false;
        if (rateFilter === 'above_2000' && freelancer.hourlyRate <= 2000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rate_high') return b.hourlyRate - a.hourlyRate;
        if (sortBy === 'rate_low') return a.hourlyRate - b.hourlyRate;
        if (sortBy === 'completed') return (b.completedProjectsCount || 0) - (a.completedProjectsCount || 0);
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [allFreelancers, searchTerm, experienceFilter, rateFilter, sortBy]);

  return (
    <div className="sb-container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase' }}>
          Talent Directory
        </span>
        <h1 style={{ fontSize: '2.3rem', marginTop: '0.2rem', marginBottom: '0.35rem' }}>
          Hire Verified Indian Freelancers
        </h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1rem', maxWidth: '650px' }}>
          Browse verified developers, UI/UX designers, and tech specialists. View detailed portfolios and transparent hourly rates in INR.
        </p>
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
            placeholder="Search by name, skill (React, Figma, Python), or domain..."
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.96rem' }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
            alignItems: 'center',
          }}
        >
          {/* Experience */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted-text)', display: 'block', marginBottom: '0.25rem' }}>
              Experience Level
            </label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
            >
              <option value="all">Any Experience</option>
              <option value="3plus">3+ Years Experience</option>
              <option value="5plus">5+ Years Experience</option>
              <option value="7plus">7+ Years Experience</option>
            </select>
          </div>

          {/* Hourly Rate */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted-text)', display: 'block', marginBottom: '0.25rem' }}>
              Hourly Rate (₹ INR)
            </label>
            <select
              value={rateFilter}
              onChange={(e) => setRateFilter(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
            >
              <option value="all">Any Rate</option>
              <option value="under_1500">Under ₹1,500 / hr</option>
              <option value="1500_2000">₹1,500 – ₹2,000 / hr</option>
              <option value="above_2000">Above ₹2,000 / hr</option>
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
              <option value="rating">Highest Rated</option>
              <option value="completed">Most Projects Completed</option>
              <option value="rate_low">Hourly Rate: Low to High</option>
              <option value="rate_high">Hourly Rate: High to Low</option>
            </select>
          </div>

          {/* Reset button */}
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

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-text)' }}>
          Showing <strong>{filteredFreelancers.length}</strong> verified freelancer{filteredFreelancers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Freelancers Grid */}
      {filteredFreelancers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No freelancers match your search"
          description="Try modifying your keyword search or adjusting your rate and experience filters."
          resetText="Clear Filters"
          onReset={handleResetFilters}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredFreelancers.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      )}
    </div>
  );
}
