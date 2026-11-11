import { apiRequest, setStoredToken } from './apiClient';

export function normalizeUser(apiUser) {
  if (!apiUser) return null;
  const isFreelancer = apiUser.role?.toLowerCase() === 'freelancer';
  const fp = apiUser.freelancerProfile || {};
  const cp = apiUser.clientProfile || {};

  return {
    id: apiUser.userId,
    userId: apiUser.userId,
    name: apiUser.fullName,
    fullName: apiUser.fullName,
    email: apiUser.email,
    role: apiUser.role?.toLowerCase(), // 'freelancer' | 'client'
    avatar: apiUser.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    phoneNumber: apiUser.phoneNumber,
    createdAt: apiUser.createdAt,
    // Freelancer fields
    title: fp.professionalTitle || (isFreelancer ? 'Freelancer Specialist' : ''),
    professionalTitle: fp.professionalTitle,
    bio: isFreelancer ? fp.bio : (cp.companyDescription || ''),
    skills: typeof fp.skills === 'string'
      ? fp.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : (fp.skills || []),
    hourlyRate: Number(fp.hourlyRate) || 800,
    rating: Number(fp.averageRating) || 5.0,
    reviewsCount: Number(fp.reviewCount) || 0,
    completedProjectsCount: Number(fp.completedProjectsCount) || 0,
    totalEarned: Number(fp.totalEarned) || 0,
    experienceYears: fp.experience || '3+ years',
    location: (isFreelancer ? fp.location : cp.location) || 'Bengaluru, India',
    portfolioUrl: fp.portfolioUrl || '',
    githubUrl: fp.githubUrl || '',
    availability: fp.availability || 'Available',
    // Client fields
    companyName: cp.companyName || (isFreelancer ? '' : `${apiUser.fullName}'s Company`),
    industry: cp.industry || 'Technology & Services',
    website: cp.website || '',
    totalSpent: Number(cp.totalSpent) || 0,
    projectsPostedCount: Number(cp.projectsPostedCount) || 0,
    verifiedPayment: cp.verifiedPayment ?? true,
  };
}

export async function loginUser(email, password) {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (res?.token) {
    setStoredToken(res.token);
  }

  return {
    token: res.token,
    user: normalizeUser(res.user),
  };
}

export async function registerUser(data) {
  const res = await apiRequest('/auth/register', {
    method: 'POST',
    body: data,
  });

  if (res?.token) {
    setStoredToken(res.token);
  }

  return {
    token: res.token,
    user: normalizeUser(res.user),
  };
}

export async function getCurrentUserFromApi() {
  const res = await apiRequest('/auth/me');
  return normalizeUser(res);
}
