import { apiRequest } from './api';

export function getContinueReading(token) {
  return apiRequest('/progress', { token });
}

export function getReadingHistory(token) {
  return apiRequest('/progress/history', { token });
}

export function saveProgress({ storyId, chapterNumber, progress }, token) {
  return apiRequest('/progress', {
    method: 'POST',
    body: { storyId, chapterNumber, progress },
    token,
  });
}

export function getProgressForStory(storyId, token) {
  return apiRequest(`/progress/${storyId}`, { token });
}
