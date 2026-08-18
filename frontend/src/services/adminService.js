import { apiRequest } from './api';

export function getDashboardStats(token) {
  return apiRequest('/admin/stats', { token });
}

export function listUsers(params = {}, token) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
  ).toString();
  return apiRequest(`/admin/users${query ? `?${query}` : ''}`, { token });
}

export function getUser(id, token) {
  return apiRequest(`/admin/users/${id}`, { token });
}

export function updateUserStatus(id, patch, token) {
  return apiRequest(`/admin/users/${id}`, { method: 'PATCH', body: patch, token });
}

export function getAdminChapters(storyId, token) {
  return apiRequest(`/admin/stories/${storyId}/chapters`, { token });
}

export function updateChapter(chapterId, patch, token) {
  return apiRequest(`/admin/chapters/${chapterId}`, { method: 'PUT', body: patch, token });
}

export function deleteChapter(chapterId, token) {
  return apiRequest(`/admin/chapters/${chapterId}`, { method: 'DELETE', token });
}
