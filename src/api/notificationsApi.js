import { apiRequest } from './apiClient';

export function normalizeNotification(n) {
  if (!n) return null;
  return {
    id: n.notificationId,
    notificationId: n.notificationId,
    userId: n.userId,
    title: n.title,
    message: n.message,
    link: n.link || '',
    type: n.type || 'system',
    read: n.isRead,
    time: formatTimeAgo(n.createdAt),
    createdAt: n.createdAt,
  };
}

function formatTimeAgo(dateString) {
  if (!dateString) return 'Just now';
  const now = new Date();
  const past = new Date(dateString);
  const diffMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export async function fetchNotifications() {
  const res = await apiRequest('/notifications');
  return (res || []).map(normalizeNotification);
}

export async function markNotificationAsReadApi(id) {
  return await apiRequest(`/notifications/${id}/read`, {
    method: 'PUT',
  });
}

export async function markAllNotificationsAsReadApi() {
  return await apiRequest('/notifications/read-all', {
    method: 'PUT',
  });
}
