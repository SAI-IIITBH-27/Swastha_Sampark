// Centralized API client that attaches JWT token and handles JSON parsing/errors
const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:8000';

async function apiFetch(path, { method = 'GET', body = null, headers = {}, skipJson = false } = {}) {
  const token = localStorage.getItem('token');
  const opts = { method, headers: { ...headers } };

  if (body != null) {
    // allow FormData passthrough
    if (body instanceof FormData) {
      opts.body = body;
    } else {
      opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
      opts.body = JSON.stringify(body);
    }
  }

  if (token) opts.headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, opts);

  if (skipJson) return res;

  let data;
  try {
    data = await res.json();
  } catch {
    if (!res.ok) throw new Error('Network error');
    return null;
  }

  if (!res.ok) {
    // if server sent structured error
    const msg = data && (data.message || data.error || JSON.stringify(data));
    const err = new Error(msg || `Request failed: ${res.status}`);
    // attach status for callers to handle specific codes (e.g., 401)
    err.status = res.status;
    throw err;
  }

  return data;
}

const get = (path, opts = {}) => apiFetch(path, { method: 'GET', ...opts });
const post = (path, body, opts = {}) => apiFetch(path, { method: 'POST', body, ...opts });
const put = (path, body, opts = {}) => apiFetch(path, { method: 'PUT', body, ...opts });
const del = (path, opts = {}) => apiFetch(path, { method: 'DELETE', ...opts });

export { apiFetch, get, post, put, del, API_BASE };
