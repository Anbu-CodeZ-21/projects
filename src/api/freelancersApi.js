import { apiRequest } from './apiClient';

export function normalizeFreelancer(f) {
  if (!f) return null;
  return {
    id: f.userId,
    userId: f.userId,
    freelancerProfileId: f.freelancerProfileId,
    name: f.fullName,
    fullName: f.fullName,
    email: f.email,
    avatar: f.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    title: f.professionalTitle,
    professionalTitle: f.professionalTitle,
    bio: f.bio,
    skills: typeof f.skills === 'string'
      ? f.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : (f.skills || []),
    experienceYears: f.experience,
    experience: f.experience,
    hourlyRate: Number(f.hourlyRate),
    location: f.location || 'India',
    portfolioUrl: f.portfolioUrl,
    githubUrl: f.githubUrl,
    availability: f.availability || 'Available',
    rating: Number(f.averageRating) || 5.0,
    reviewsCount: Number(f.reviewCount) || 0,
    completedProjectsCount: Number(f.completedProjectsCount) || 0,
    totalEarned: Number(f.totalEarned) || 0,
    portfolio: [
      {
        id: 'port-1',
        title: 'Enterprise Fintech Dashboard',
        description: 'React, Tailwind CSS, TypeScript, Chart.js',
        link: f.portfolioUrl || 'https://github.com',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'port-2',
        title: 'E-Commerce Marketplace Web App',
        description: 'React, Redux, Node.js, Stripe integration',
        link: f.portfolioUrl || 'https://github.com',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80',
      },
    ],
  };
}

export async function fetchFreelancers(filters = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.skill) query.append('skill', filters.skill);
  if (filters.location) query.append('location', filters.location);
  if (filters.minRating) query.append('minRating', filters.minRating);
  if (filters.maxHourlyRate) query.append('maxHourlyRate', filters.maxHourlyRate);
  if (filters.sortBy) query.append('sortBy', filters.sortBy);

  const qs = query.toString();
  const endpoint = `/freelancers${qs ? `?${qs}` : ''}`;
  const res = await apiRequest(endpoint);
  return (res || []).map(normalizeFreelancer);
}

export async function fetchFreelancerById(id) {
  const res = await apiRequest(`/freelancers/${id}`);
  return normalizeFreelancer(res);
}

export async function updateFreelancerProfileApi(data) {
  const res = await apiRequest('/freelancers/me', {
    method: 'PUT',
    body: data,
  });
  return normalizeFreelancer(res);
}

export async function updateClientProfileApi(data) {
  const res = await apiRequest('/clients/me', {
    method: 'PUT',
    body: data,
  });
  return res;
}
