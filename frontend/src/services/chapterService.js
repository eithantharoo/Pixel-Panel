import { apiRequest } from './api';

export function getChapters(storyId) {
  return apiRequest(`/stories/${storyId}/chapters`);
}

export function getChapter(storyId, number, token) {
  return apiRequest(`/stories/${storyId}/chapters/${number}`, { token });
}

export function createChapter(storyId, chapter, token) {
  return apiRequest(`/stories/${storyId}/chapters`, { method: 'POST', body: chapter, token });
}
