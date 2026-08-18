import { API_BASE } from './api';

// Raw fetch (not apiRequest) — a multipart/form-data body must NOT have a
// manually-set Content-Type; the browser generates the boundary itself.
export async function uploadChapterPdf(file, token) {
  const formData = new FormData();
  formData.append('pdf', file);

  const res = await fetch(`${API_BASE}/admin/chapters/pdf`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'PDF upload failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

// Fetches the PDF as an authenticated Blob and returns an object URL the
// browser's native PDF viewer can render in an <iframe> — GET requests via
// iframe `src` can't carry an Authorization header, so this is done as a
// real fetch first. Caller is responsible for revoking the returned URL
// (via URL.revokeObjectURL) when it's no longer needed.
export async function fetchChapterPdfObjectUrl(fileId, token) {
  const res = await fetch(`${API_BASE}/chapters/pdf/${fileId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    throw new Error('Failed to load PDF');
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
