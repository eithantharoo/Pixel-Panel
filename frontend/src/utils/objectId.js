const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

// True when a value looks like a real MongoDB ObjectId — used to tell a
// real backend-sourced book/story apart from the still-mock data (numeric
// ids from data/home_data.js) that a few flows haven't been wired up yet.
export function isRealStoryId(id) {
  return OBJECT_ID_RE.test(String(id ?? ''));
}
