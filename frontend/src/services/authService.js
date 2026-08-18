import { apiRequest } from './api';

export function registerUser({ name, email, password }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

export function loginUser({ email, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function saveInterests(interests, token) {
  return apiRequest('/users/interests', {
    method: 'PUT',
    body: { interests },
    token,
  });
}
