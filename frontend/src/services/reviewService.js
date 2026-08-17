import { apiRequest } from './api';

export function getReviews(storyId) {
  return apiRequest(`/stories/${storyId}/reviews`);
}

export function getMyReview(storyId, token) {
  return apiRequest(`/stories/${storyId}/reviews/me`, { token });
}

export function saveReview(storyId, { rating, text }, token) {
  return apiRequest(`/stories/${storyId}/reviews`, {
    method: 'POST',
    body: { rating, text },
    token,
  });
}

export function deleteReview(storyId, token) {
  return apiRequest(`/stories/${storyId}/reviews`, { method: 'DELETE', token });
}
