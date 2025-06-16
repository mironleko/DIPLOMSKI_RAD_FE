/**
 * Get the stored token from localStorage (or null if not set).
 */
function getToken() {
  const stored = localStorage.getItem('user');
  if (!stored) return null;
  try {
    return JSON.parse(stored).token;
  } catch {
    return null;
  }
}

/**
 * A drop-in replacement for fetch() that automatically adds
 * Content-Type and Authorization headers.
 *
 * @param {string} url   – the endpoint (absolute or relative)
 * @param {object} opts  – same options object as fetch()
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, opts = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  const res = await fetch(url, {
    ...opts,
    headers,
  });

  return res;
}

/**
 * Helper function to extract error info and throw structured Error.
 */
async function parseAndThrow(res) {
  let message = `HTTP ${res.status}`;
  let data = null;

  try {
    data = await res.json();
    message = data.message || message;
  } catch {
    // nije JSON, ostavi default poruku
  }

  const error = new Error(message);
  error.status = res.status;
  error.response = { status: res.status, data };
  throw error;
}

/**
 * Helper to GET and parse JSON, throwing on HTTP errors.
 *
 * @param {string} url
 * @param {object} opts  – extra fetch options
 * @returns {Promise<any>}
 */
export async function getJSON(url, opts = {}) {
  const res = await apiFetch(url, { method: 'GET', ...opts });
  if (!res.ok) await parseAndThrow(res);
  return res.json();
}

/**
 * Helper to POST JSON and parse JSON, throwing on HTTP errors.
 *
 * @param {string} url
 * @param {object} body   – JS object to JSON-serialize
 * @param {object} opts   – extra fetch options
 * @returns {Promise<any>}
 */
export async function postJSON(url, body, opts = {}) {
  const res = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    ...opts,
  });

  if (!res.ok) await parseAndThrow(res);
  return res.json();
}

/**
 * Helper to PUT JSON and parse JSON, throwing on HTTP errors.
 *
 * @param {string} url
 * @param {object} body   – JS object to JSON-serialize
 * @param {object} opts   – extra fetch options
 * @returns {Promise<any>}
 */
export async function putJSON(url, body, opts = {}) {
  const res = await apiFetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...opts,
  });

  if (!res.ok) await parseAndThrow(res);
  return res.json();
}
