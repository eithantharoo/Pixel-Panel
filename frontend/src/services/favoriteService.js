import { apiRequest } from './api';

export function getFavorites(token) {
  return apiRequest('/favorites', { token });
}

export function addFavorite(storyId, token) {
  return apiRequest(`/favorites/${storyId}`, { method: 'POST', token });
}

export function removeFavorite(storyId, token) {
  return apiRequest(`/favorites/${storyId}`, { method: 'DELETE', token });
}
