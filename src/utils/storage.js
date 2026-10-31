import {
  INITIAL_FREELANCERS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_PROPOSALS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

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
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
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
  return freelancers.find((f) => f.id === id) || null;
}

export function saveFreelancer(updatedFreelancer) {
  const list = getFreelancers();
  const index = list.findIndex((f) => f.id === updatedFreelancer.id);
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
  return clients.find((c) => c.id === id) || null;
}

export function saveClient(updatedClient) {
  const list = getClients();
  const index = list.findIndex((c) => c.id === updatedClient.id);
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
  return projects.find((p) => p.id === id) || null;
}

export function saveProjects(projects) {
  safeSet(KEYS.PROJECTS, projects);
}

export function createProject(projectData, clientUser) {
  const projects = getProjects();
  const newProject = {
    id: `proj-${Date.now()}`,
    ...projectData,
    clientId: clientUser.id,
    clientName: clientUser.name,
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

  // Update client project count
  const clients = getClients();
  const clientIdx = clients.findIndex((c) => c.id === clientUser.id);
  if (clientIdx >= 0) {
    clients[clientIdx].projectsPostedCount = (clients[clientIdx].projectsPostedCount || 0) + 1;
    safeSet(KEYS.CLIENTS, clients);
  }

  return newProject;
}

export function updateProject(projectId, updates) {
  const projects = getProjects();
  const updated = projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p));
  saveProjects(updated);
  return updated.find((p) => p.id === projectId);
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
  const newProposal = {
    id: `prop-${Date.now()}`,
    projectId: proposalData.projectId,
    projectTitle: proposalData.projectTitle,
    freelancerId: freelancerUser.id,
    freelancerName: freelancerUser.name,
    freelancerTitle: freelancerUser.title || 'Freelancer',
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

  // Increment proposal count on the project
  const project = getProjectById(proposalData.projectId);
  if (project) {
    const updatedCount = (project.proposalsCount || 0) + 1;
    const newStatus = project.status === 'Open' ? 'Open' : project.status;
    updateProject(project.id, { proposalsCount: updatedCount, status: newStatus });

    // Send notification to the client
    createNotification({
      userId: project.clientId,
      userRole: 'client',
      title: 'New Proposal Received',
      message: `${freelancerUser.name} submitted a bid of ₹${Number(proposalData.bidAmount).toLocaleString('en-IN')} for "${project.title}".`,
      time: 'Just now',
      link: `/projects/${project.id}`,
      type: 'proposal',
    });
  }

  return newProposal;
}

export function acceptProposal(proposalId) {
  const proposals = getProposals();
  const targetProposal = proposals.find((p) => p.id === proposalId);
  if (!targetProposal) return null;

  // Mark this proposal as accepted and others for this project as rejected
  const updatedProposals = proposals.map((p) => {
    if (p.id === proposalId) {
      return { ...p, status: 'accepted' };
    }
    if (p.projectId === targetProposal.projectId && p.id !== proposalId) {
      return { ...p, status: 'rejected' };
    }
    return p;
  });
  saveProposals(updatedProposals);

  // Update project status to 'In Progress' and assign the freelancer
  updateProject(targetProposal.projectId, {
    status: 'In Progress',
    assignedFreelancerId: targetProposal.freelancerId,
    assignedFreelancerName: targetProposal.freelancerName,
    progress: 10,
  });

  // Notify freelancer
  createNotification({
    userId: targetProposal.freelancerId,
    userRole: 'freelancer',
    title: 'Proposal Accepted! 🚀',
    message: `Congratulations! Your proposal for "${targetProposal.projectTitle}" was accepted. The project is now In Progress.`,
    time: 'Just now',
    link: `/work-verification?project=${targetProposal.projectId}`,
    type: 'proposal',
  });

  return targetProposal;
}

// Work Verification Workflow Helpers
export function updateProjectProgress(projectId, progress) {
  const p = Math.min(100, Math.max(0, Number(progress)));
  return updateProject(projectId, { progress: p });
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

  // Notify client
  createNotification({
    userId: project.clientId,
    userRole: 'client',
    title: 'Work Submitted for Review',
    message: `${freelancerUser.name} has submitted deliverables for "${project.title}". Please verify the work to approve or request revisions.`,
    time: 'Just now',
    link: `/work-verification?project=${projectId}`,
    type: 'verification',
  });

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

    // Update freelancer completed count and total earned
    if (project.assignedFreelancerId) {
      const freelancers = getFreelancers();
      const idx = freelancers.findIndex((f) => f.id === project.assignedFreelancerId);
      if (idx >= 0) {
        freelancers[idx].completedProjectsCount = (freelancers[idx].completedProjectsCount || 0) + 1;
        freelancers[idx].totalEarned = (freelancers[idx].totalEarned || 0) + (project.budget || 0);
        safeSet(KEYS.FREELANCERS, freelancers);
      }

      // Notify freelancer
      createNotification({
        userId: project.assignedFreelancerId,
        userRole: 'freelancer',
        title: 'Work Approved & Project Completed! 🎉',
        message: `${clientUser.name} approved your deliverables for "${project.title}". Payment of ₹${(project.budget || 0).toLocaleString('en-IN')} has been cleared.`,
        time: 'Just now',
        link: `/projects/${projectId}`,
        type: 'completion',
      });
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

    // Notify freelancer
    if (project.assignedFreelancerId) {
      createNotification({
        userId: project.assignedFreelancerId,
        userRole: 'freelancer',
        title: 'Revision Requested by Client',
        message: `${clientUser.name} requested changes on "${project.title}". Check feedback notes and submit revised work.`,
        time: 'Just now',
        link: `/work-verification?project=${projectId}`,
        type: 'revision',
      });
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
  return updated;
}

export function markAllNotificationsAsRead(userId) {
  const list = getNotifications();
  const updated = list.map((n) => (n.userId === userId ? { ...n, read: true } : n));
  safeSet(KEYS.NOTIFICATIONS, updated);
  return updated;
}

// Reset Demo Data helper
export function resetDemoData() {
  safeSet(KEYS.FREELANCERS, INITIAL_FREELANCERS);
  safeSet(KEYS.CLIENTS, INITIAL_CLIENTS);
  safeSet(KEYS.PROJECTS, INITIAL_PROJECTS);
  safeSet(KEYS.PROPOSALS, INITIAL_PROPOSALS);
  safeSet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  return true;
}
