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

export function getStoryById(storyId) {
  return apiRequest(`/stories/${storyId}`);
}
