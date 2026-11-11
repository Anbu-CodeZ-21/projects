import { apiRequest } from './apiClient';
import { normalizeProject } from './projectsApi';

export async function submitWorkDeliveryApi(projectId, { deliveryUrl, deliveryNotes }) {
  const res = await apiRequest(`/projects/${projectId}/submit`, {
    method: 'POST',
    body: {
      deliveryUrl: deliveryUrl.trim(),
      deliveryNotes: deliveryNotes.trim(),
    },
  });
  return normalizeProject(res);
}

export async function approveWorkDeliveryApi(projectId, { feedback, rating, reviewComment }) {
  const res = await apiRequest(`/projects/${projectId}/verify`, {
    method: 'POST',
    body: {
      feedback: feedback?.trim() || 'Work verified and accepted.',
      rating: rating ? Number(rating) : 5,
      reviewComment: reviewComment?.trim() || feedback?.trim() || 'Excellent delivery.',
    },
  });
  return normalizeProject(res);
}

export async function requestRevisionApi(projectId, { revisionNotes }) {
  const res = await apiRequest(`/projects/${projectId}/request-revision`, {
    method: 'POST',
    body: {
      revisionNotes: revisionNotes.trim(),
    },
  });
  return normalizeProject(res);
}
