import { apiRequest } from './apiClient';

export function normalizeProposal(w) {
  if (!w) return null;
  return {
    id: w.workRequestId,
    workRequestId: w.workRequestId,
    projectId: w.projectId,
    projectTitle: w.projectTitle,
    projectCategory: w.projectCategory,
    projectBudget: Number(w.projectBudget),
    projectStatus: w.projectStatus,
    clientId: w.clientId,
    clientName: w.clientName,
    clientCompany: w.clientCompany,
    freelancerId: w.freelancerId,
    freelancerName: w.freelancerName,
    freelancerTitle: w.freelancerTitle,
    freelancerAvatar: w.freelancerAvatar,
    freelancerRating: Number(w.freelancerRating) || 5.0,
    bidAmount: Number(w.bidAmount),
    estimatedDays: Number(w.estimatedDays),
    coverLetter: w.coverLetter,
    status: (w.status || 'pending').toLowerCase(),
    submittedAt: w.createdAt,
    createdAt: w.createdAt,
  };
}

export async function submitProposalApi(data) {
  const res = await apiRequest('/workrequests', {
    method: 'POST',
    body: {
      projectId: Number(data.projectId),
      bidAmount: Number(data.bidAmount),
      estimatedDays: Number(data.estimatedDays),
      coverLetter: data.coverLetter,
    },
  });
  return normalizeProposal(res);
}

export async function fetchMyProposals() {
  const res = await apiRequest('/workrequests/my');
  return (res || []).map(normalizeProposal);
}

export async function fetchProjectProposals(projectId) {
  const res = await apiRequest(`/workrequests/project/${projectId}`);
  return (res || []).map(normalizeProposal);
}

export async function acceptProposalApi(proposalId) {
  const res = await apiRequest(`/workrequests/${proposalId}/accept`, {
    method: 'PUT',
  });
  return normalizeProposal(res);
}

export async function rejectProposalApi(proposalId) {
  const res = await apiRequest(`/workrequests/${proposalId}/reject`, {
    method: 'PUT',
  });
  return normalizeProposal(res);
}
