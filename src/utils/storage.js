import {
  INITIAL_FREELANCERS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_PROPOSALS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  fetchProjects,
  fetchProjectById,
  createProjectApi,
  updateProjectProgressApi,
} from '../api/projectsApi';
import {
  fetchFreelancers,
} from '../api/freelancersApi';
import {
  submitProposalApi,
  acceptProposalApi,
  rejectProposalApi,
  fetchMyProposals,
} from '../api/proposalsApi';
import {
  submitWorkDeliveryApi,
  approveWorkDeliveryApi,
  requestRevisionApi,
} from '../api/verificationApi';
import {
  fetchNotifications,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
} from '../api/notificationsApi';

const KEYS = {
  CURRENT_USER: 'skillbridge_current_user',
  FREELANCERS: 'skillbridge_freelancers',
  CLIENTS: 'skillbridge_clients',
  PROJECTS: 'skillbridge_projects',
  PROPOSALS: 'skillbridge_proposals',
  NOTIFICATIONS: 'skillbridge_notifications',
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for reactive updates across components
    window.dispatchEvent(new CustomEvent('skillbridge_storage_update', { detail: { key, value } }));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Background initial sync from ASP.NET Core & SQL Server
let isSyncing = false;
export async function syncFromBackend() {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const [apiProjects, apiFreelancers] = await Promise.allSettled([
      fetchProjects(),
      fetchFreelancers(),
    ]);

    if (apiProjects.status === 'fulfilled' && apiProjects.value?.length > 0) {
      safeSet(KEYS.PROJECTS, apiProjects.value);
    }
    if (apiFreelancers.status === 'fulfilled' && apiFreelancers.value?.length > 0) {
      safeSet(KEYS.FREELANCERS, apiFreelancers.value);
    }
  } catch (err) {
    console.warn('Backend sync failed, using cached storage:', err);
  } finally {
    isSyncing = false;
  }
}

export function initStorage() {
  if (!localStorage.getItem(KEYS.FREELANCERS)) {
    safeSet(KEYS.FREELANCERS, INITIAL_FREELANCERS);
  }
  if (!localStorage.getItem(KEYS.CLIENTS)) {
    safeSet(KEYS.CLIENTS, INITIAL_CLIENTS);
  }
  if (!localStorage.getItem(KEYS.PROJECTS)) {
    safeSet(KEYS.PROJECTS, INITIAL_PROJECTS);
  }
  if (!localStorage.getItem(KEYS.PROPOSALS)) {
    safeSet(KEYS.PROPOSALS, INITIAL_PROPOSALS);
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    safeSet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  // Fire background sync to ensure latest data from SQL Server
  syncFromBackend();
}

// Current User Helpers
export function getCurrentUser() {
  return safeGet(KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(KEYS.CURRENT_USER);
  } else {
    safeSet(KEYS.CURRENT_USER, user);
  }
}

// Freelancers Helpers
export function getFreelancers() {
  initStorage();
  return safeGet(KEYS.FREELANCERS, INITIAL_FREELANCERS);
}

export function getFreelancerById(id) {
  const freelancers = getFreelancers();
  return freelancers.find((f) => String(f.id) === String(id) || String(f.userId) === String(id)) || null;
}

export function saveFreelancer(updatedFreelancer) {
  const list = getFreelancers();
  const index = list.findIndex((f) => String(f.id) === String(updatedFreelancer.id));
  let updatedList;
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = { ...list[index], ...updatedFreelancer };
  } else {
    updatedList = [updatedFreelancer, ...list];
  }
  safeSet(KEYS.FREELANCERS, updatedList);
  return updatedFreelancer;
}

// Clients Helpers
export function getClients() {
  initStorage();
  return safeGet(KEYS.CLIENTS, INITIAL_CLIENTS);
}

export function getClientById(id) {
  const clients = getClients();
  return clients.find((c) => String(c.id) === String(id) || String(c.userId) === String(id)) || null;
}

export function saveClient(updatedClient) {
  const list = getClients();
  const index = list.findIndex((c) => String(c.id) === String(updatedClient.id));
  let updatedList;
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = { ...list[index], ...updatedClient };
  } else {
    updatedList = [updatedClient, ...list];
  }
  safeSet(KEYS.CLIENTS, updatedList);
  return updatedClient;
}

// Projects Helpers
export function getProjects() {
  initStorage();
  return safeGet(KEYS.PROJECTS, INITIAL_PROJECTS);
}

export function getProjectById(id) {
  const projects = getProjects();
  return projects.find((p) => String(p.id) === String(id) || String(p.projectId) === String(id)) || null;
}

export function saveProjects(projects) {
  safeSet(KEYS.PROJECTS, projects);
}

export function createProject(projectData, clientUser) {
  const projects = getProjects();
  const tempId = `proj-${Date.now()}`;
  
  const newProject = {
    id: tempId,
    projectId: tempId,
    ...projectData,
    clientId: clientUser.id || clientUser.userId,
    clientName: clientUser.name || clientUser.fullName,
    clientCompany: clientUser.companyName || 'Individual Client',
    clientRating: clientUser.rating || 5.0,
    clientLocation: clientUser.location || 'India',
    createdAt: new Date().toISOString().split('T')[0],
    status: 'Open',
    assignedFreelancerId: null,
    assignedFreelancerName: null,
    progress: 0,
    proposalsCount: 0,
    delivery: null,
    reviewNotes: null,
  };

  const updatedProjects = [newProject, ...projects];
  saveProjects(updatedProjects);

  // Send to backend API asynchronously and replace temporary id with real SQL Server ID
  createProjectApi(projectData)
    .then((savedProject) => {
      if (savedProject) {
        const currentList = getProjects();
        const replaced = currentList.map((p) => (p.id === tempId ? savedProject : p));
        saveProjects(replaced);
      }
    })
    .catch((err) => {
      console.warn('Backend createProject failed, kept optimistic local project:', err);
    });

  return newProject;
}

export function updateProject(projectId, updates) {
  const projects = getProjects();
  const updated = projects.map((p) =>
    String(p.id) === String(projectId) || String(p.projectId) === String(projectId)
      ? { ...p, ...updates }
      : p
  );
  saveProjects(updated);
  return updated.find((p) => String(p.id) === String(projectId) || String(p.projectId) === String(projectId));
}

// Proposals Helpers
export function getProposals() {
  initStorage();
  return safeGet(KEYS.PROPOSALS, INITIAL_PROPOSALS);
}

export function saveProposals(proposals) {
  safeSet(KEYS.PROPOSALS, proposals);
}

export function submitProposal(proposalData, freelancerUser) {
  const proposals = getProposals();
  const tempId = `prop-${Date.now()}`;

  const newProposal = {
    id: tempId,
    workRequestId: tempId,
    projectId: proposalData.projectId,
    projectTitle: proposalData.projectTitle,
    freelancerId: freelancerUser.id || freelancerUser.userId,
    freelancerName: freelancerUser.name || freelancerUser.fullName,
    freelancerTitle: freelancerUser.title || freelancerUser.professionalTitle || 'Freelancer',
    freelancerAvatar: freelancerUser.avatar || '',
    freelancerRating: freelancerUser.rating || 5.0,
    bidAmount: Number(proposalData.bidAmount),
    estimatedDays: Number(proposalData.estimatedDays),
    coverLetter: proposalData.coverLetter,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  const updatedProposals = [newProposal, ...proposals];
  saveProposals(updatedProposals);

  // Increment proposal count on the project locally
  const project = getProjectById(proposalData.projectId);
  if (project) {
    const updatedCount = (project.proposalsCount || 0) + 1;
    updateProject(project.id, { proposalsCount: updatedCount });
  }

  // Send to backend API asynchronously
  submitProposalApi(proposalData)
    .then((saved) => {
      if (saved) {
        const currentList = getProposals();
        const replaced = currentList.map((pr) => (pr.id === tempId ? saved : pr));
        saveProposals(replaced);
      }
    })
    .catch((err) => {
      console.warn('Backend submitProposal failed, kept optimistic local proposal:', err);
    });

  return newProposal;
}

export function acceptProposal(proposalId) {
  const proposals = getProposals();
  const targetProposal = proposals.find(
    (p) => String(p.id) === String(proposalId) || String(p.workRequestId) === String(proposalId)
  );
  if (!targetProposal) return null;

  const updatedProposals = proposals.map((p) => {
    if (String(p.id) === String(proposalId) || String(p.workRequestId) === String(proposalId)) {
      return { ...p, status: 'accepted' };
    }
    if (String(p.projectId) === String(targetProposal.projectId)) {
      return { ...p, status: 'rejected' };
    }
    return p;
  });
  saveProposals(updatedProposals);

  updateProject(targetProposal.projectId, {
    status: 'In Progress',
    assignedFreelancerId: targetProposal.freelancerId,
    assignedFreelancerName: targetProposal.freelancerName,
    progress: 10,
  });

  // Call backend API asynchronously
  if (typeof targetProposal.workRequestId === 'number' || !isNaN(Number(targetProposal.id))) {
    acceptProposalApi(targetProposal.workRequestId || targetProposal.id).catch((err) =>
      console.warn('Backend acceptProposal failed:', err)
    );
  }

  return targetProposal;
}

// Work Verification Workflow Helpers
export function updateProjectProgress(projectId, progress) {
  const p = Math.min(100, Math.max(0, Number(progress)));
  const updated = updateProject(projectId, { progress: p });

  if (!isNaN(Number(projectId))) {
    updateProjectProgressApi(projectId, p).catch((err) =>
      console.warn('Backend updateProgress failed:', err)
    );
  }

  return updated;
}

export function submitWorkDelivery(projectId, { deliveryUrl, deliveryNotes }, freelancerUser) {
  const project = getProjectById(projectId);
  if (!project) return null;

  const delivery = {
    deliveryUrl,
    deliveryNotes,
    submittedAt: new Date().toISOString(),
  };

  const updated = updateProject(projectId, {
    delivery,
    progress: 100,
    status: 'Submitted for Review',
  });

  // Call backend API asynchronously
  if (!isNaN(Number(projectId))) {
    submitWorkDeliveryApi(projectId, { deliveryUrl, deliveryNotes }).catch((err) =>
      console.warn('Backend submitWorkDelivery failed:', err)
    );
  }

  return updated;
}

export function reviewWorkDelivery(projectId, { action, feedbackNotes, rating }, clientUser) {
  const project = getProjectById(projectId);
  if (!project) return null;

  if (action === 'approve') {
    const updated = updateProject(projectId, {
      status: 'Completed',
      progress: 100,
      approvedAt: new Date().toISOString(),
      clientReview: {
        rating: rating || 5,
        comment: feedbackNotes || 'Great work! Delivered according to requirements.',
      },
    });

    if (!isNaN(Number(projectId))) {
      approveWorkDeliveryApi(projectId, {
        feedback: feedbackNotes,
        rating: rating || 5,
        reviewComment: feedbackNotes,
      }).catch((err) => console.warn('Backend approveWorkDelivery failed:', err));
    }

    return updated;
  } else if (action === 'revision') {
    const updated = updateProject(projectId, {
      status: 'Revision Requested',
      revisionFeedback: {
        requestedAt: new Date().toISOString(),
        feedbackNotes: feedbackNotes || 'Please make required improvements to the deliverables.',
      },
      progress: 85,
    });

    if (!isNaN(Number(projectId))) {
      requestRevisionApi(projectId, { revisionNotes: feedbackNotes }).catch((err) =>
        console.warn('Backend requestRevision failed:', err)
      );
    }

    return updated;
  }
}

// Notifications Helpers
export function getNotifications() {
  initStorage();
  return safeGet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function createNotification(notif) {
  const list = getNotifications();
  const newNotif = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    read: false,
    ...notif,
  };
  safeSet(KEYS.NOTIFICATIONS, [newNotif, ...list]);
  return newNotif;
}

export function markNotificationAsRead(id) {
  const list = getNotifications();
  const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
  safeSet(KEYS.NOTIFICATIONS, updated);

  if (!isNaN(Number(id))) {
    markNotificationAsReadApi(id).catch((err) =>
      console.warn('Backend markNotificationAsRead failed:', err)
    );
  }
  return updated;
}

export function markAllNotificationsAsRead(userId) {
  const list = getNotifications();
  const updated = list.map((n) => (n.userId === userId ? { ...n, read: true } : n));
  safeSet(KEYS.NOTIFICATIONS, updated);

  markAllNotificationsAsReadApi().catch((err) =>
    console.warn('Backend markAllNotificationsAsRead failed:', err)
  );
  return updated;
}

// Reset Demo Data helper
export function resetDemoData() {
  safeSet(KEYS.FREELANCERS, INITIAL_FREELANCERS);
  safeSet(KEYS.CLIENTS, INITIAL_CLIENTS);
  safeSet(KEYS.PROJECTS, INITIAL_PROJECTS);
  safeSet(KEYS.PROPOSALS, INITIAL_PROPOSALS);
  safeSet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  syncFromBackend();
  return true;
}
