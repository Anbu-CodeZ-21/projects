import { apiRequest } from './apiClient';

export function normalizeProjectStatus(status) {
  if (!status) return 'Open';
  const s = status.toLowerCase().replace(/\s+/g, '');
  if (s === 'inprogress' || s === 'accepted') return 'In Progress';
  if (s === 'submitted' || s === 'submittedforreview') return 'Submitted for Review';
  if (s === 'revisionrequested') return 'Revision Requested';
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled') return 'Cancelled';
  return 'Open';
}

export function denormalizeProjectStatus(status) {
  if (!status) return 'Open';
  const s = status.toLowerCase().replace(/\s+/g, '');
  if (s === 'inprogress' || s === 'accepted') return 'InProgress';
  if (s === 'submitted' || s === 'submittedforreview') return 'Submitted';
  if (s === 'revisionrequested') return 'RevisionRequested';
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled') return 'Cancelled';
  return 'Open';
}

export function normalizeProject(p) {
  if (!p) return null;
  const status = normalizeProjectStatus(p.status);

  return {
    id: p.projectId,
    projectId: p.projectId,
    title: p.projectTitle,
    projectTitle: p.projectTitle,
    description: p.description,
    category: p.category,
    budget: Number(p.budget),
    duration: p.duration,
    skills: typeof p.skillsRequired === 'string'
      ? p.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
      : (p.skills || []),
    skillsRequired: p.skillsRequired,
    experienceLevel: p.experienceLevel || 'Intermediate',
    deadline: p.deadline ? new Date(p.deadline).toISOString().split('T')[0] : '',
    status: status,
    rawStatus: p.status,
    progress: p.progress ?? 0,
    clientId: p.clientId,
    clientName: p.clientName || 'Client',
    clientCompany: p.clientCompany || 'TechNova Solutions',
    clientLocation: p.clientLocation || 'Bengaluru, India',
    clientRating: 4.9,
    assignedFreelancerId: p.freelancerId,
    assignedFreelancerName: p.freelancerName,
    assignedFreelancerAvatar: p.freelancerAvatar,
    delivery: p.deliveryUrl
      ? {
          deliveryUrl: p.deliveryUrl,
          deliveryNotes: p.deliveryNotes,
          submittedAt: p.submissions?.[0]?.submittedAt || p.createdAt,
        }
      : null,
    revisionFeedback:
      status === 'Revision Requested'
        ? {
            feedbackNotes: p.clientFeedback || 'Please refine the deliverables according to feedback.',
            requestedAt: p.submissions?.[0]?.reviewedAt || p.createdAt,
          }
        : null,
    clientReview:
      status === 'Completed'
        ? {
            rating: 5,
            comment: p.clientFeedback || 'Deliverables verified and accepted successfully.',
          }
        : null,
    milestones: p.milestones || [],
    submissions: p.submissions || [],
    proposalsCount: p.proposalsCount ?? 0,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export async function fetchProjects(filters = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.category && filters.category !== 'all') query.append('category', filters.category);
  if (filters.status) query.append('status', denormalizeProjectStatus(filters.status));
  if (filters.minBudget) query.append('minBudget', filters.minBudget);
  if (filters.maxBudget) query.append('maxBudget', filters.maxBudget);
  if (filters.experienceLevel) query.append('experienceLevel', filters.experienceLevel);
  if (filters.duration) query.append('duration', filters.duration);
  if (filters.sortBy) query.append('sortBy', filters.sortBy);

  const qs = query.toString();
  const endpoint = `/projects${qs ? `?${qs}` : ''}`;
  const res = await apiRequest(endpoint);
  return (res || []).map(normalizeProject);
}

export async function fetchProjectById(id) {
  const res = await apiRequest(`/projects/${id}`);
  return normalizeProject(res);
}

export async function fetchMyProjects() {
  const res = await apiRequest('/projects/my');
  return (res || []).map(normalizeProject);
}

export async function createProjectApi(data) {
  const payload = {
    projectTitle: data.title || data.projectTitle,
    description: data.description,
    category: data.category,
    budget: Number(data.budget),
    duration: data.duration,
    skillsRequired: Array.isArray(data.skills) ? data.skills.join(', ') : data.skillsRequired || '',
    experienceLevel: data.experienceLevel || 'Intermediate',
    deadline: data.deadline ? new Date(data.deadline).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
  };

  const res = await apiRequest('/projects', {
    method: 'POST',
    body: payload,
  });

  return normalizeProject(res);
}

export async function updateProjectProgressApi(projectId, progress, note = '') {
  const res = await apiRequest(`/projects/${projectId}/progress`, {
    method: 'PUT',
    body: { progress: Number(progress), note },
  });

  return normalizeProject(res);
}
