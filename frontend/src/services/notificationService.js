import { apiRequest } from './api';

export function getNotifications({ page, limit } = {}, token) {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  const qs = params.toString();
  return apiRequest(`/notifications${qs ? `?${qs}` : ''}`, { token });
}

export function getUnreadCount(token) {
  return apiRequest('/notifications/unread-count', { token });
}

export function markNotificationRead(id, token) {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH', token });
}

export function markAllNotificationsRead(token) {
  return apiRequest('/notifications/read-all', { method: 'PATCH', token });
}
