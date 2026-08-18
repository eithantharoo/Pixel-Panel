import { apiRequest } from './api';

export function getTrendingStories() {
  return apiRequest('/stories/trending');
}

export function getNewReleases() {
  return apiRequest('/stories/new-releases');
}

export function getPopularStories() {
  return apiRequest('/stories/popular');
}

export function getForYou(token) {
  return apiRequest('/stories/for-you', { token });
}

// Paginated envelope ({ stories, page, totalPages, total }) — returned as-is
// for callers (e.g. the admin story list) that need the pagination metadata,
// unlike getStoriesByGenre below which unwraps it.
export function getAllStories({ page, limit } = {}, token) {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  const qs = params.toString();
  return apiRequest(`/stories${qs ? `?${qs}` : ''}`, { token });
}

// Unlike the other endpoints, GET /stories returns a paginated envelope
// ({ stories, page, totalPages, total }) rather than a bare array —
// unwrap it here so every function in this module returns Story[].
export async function getStoriesByGenre(genre, { limit = 50 } = {}) {
  const data = await apiRequest(`/stories?genre=${encodeURIComponent(genre)}&limit=${limit}`);
  return data.stories;
}

export function searchStories(q) {
  return apiRequest(`/stories/search?q=${encodeURIComponent(q)}`);
}

// Fire-and-forget: bumps the story's view count, which drives trending.
export function recordStoryView(id) {
  return apiRequest(`/stories/${id}/view`, { method: 'POST' });
}

export function createStory(story, token) {
  return apiRequest('/stories', { method: 'POST', body: story, token });
}

export function updateStory(id, story, token) {
  return apiRequest(`/stories/${id}`, { method: 'PUT', body: story, token });
}

export function deleteStory(id, token) {
  return apiRequest(`/stories/${id}`, { method: 'DELETE', token });
}
