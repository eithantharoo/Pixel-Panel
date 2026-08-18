const AUTH_STORAGE_KEY = 'pixel-panel-auth';

export function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuth({ user, token }) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
  } catch {
    /* noop */
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function isAuthenticated() {
  return Boolean(loadAuth()?.token);
}

const PROFILE_STORAGE_KEY = 'pixel-panel-profile';

// Seeds the display name HomeHeader shows, so it reflects the real account
// instead of staying on its hardcoded default after a real login/signup.
export function seedProfileName(name) {
  if (!name) return;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : {};
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({ ...current, name, isLoggedIn: true })
    );
  } catch {
    /* noop */
  }
}
