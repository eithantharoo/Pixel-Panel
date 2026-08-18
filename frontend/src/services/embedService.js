import { apiRequest } from './api';

export function checkEmbeddable(url, token) {
  return apiRequest(`/embed/check?url=${encodeURIComponent(url)}`, { token });
}
