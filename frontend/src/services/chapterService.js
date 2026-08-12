import { apiRequest } from './api';

export function getChapters(storyId) {
  return apiRequest(`/stories/${storyId}/chapters`);
}

export function getChapter(storyId, number, token) {
  return apiRequest(`/stories/${storyId}/chapters/${number}`, { token });
}
