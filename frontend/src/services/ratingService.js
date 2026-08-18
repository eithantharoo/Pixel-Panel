import { apiRequest } from './api';

export function getMyRating(storyId, token) {
  return apiRequest(`/ratings/${storyId}`, { token });
}

export function rateStory(storyId, value, token) {
  return apiRequest(`/ratings/${storyId}`, { method: 'PUT', body: { value }, token });
}

export function removeRating(storyId, token) {
  return apiRequest(`/ratings/${storyId}`, { method: 'DELETE', token });
}
