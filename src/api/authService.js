// src/api/authService.js
const API_URL = '/api/v1/';

export async function login(email, password) {
  const res = await fetch(API_URL + 'login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    // prefer the backend’s `error` field, then `message`, then HTTP status text
    const err = (data && (data.error || data.message)) || res.statusText;
    return Promise.reject(err);
  }

  // backend returns { token: "…" }
  localStorage.setItem('user', JSON.stringify({ token: data.token }));
  return data;
}

export function logout() {
  localStorage.removeItem('user');
}

export function authHeader() {
  const stored = localStorage.getItem('user');
  if (!stored) return {};
  const { token } = JSON.parse(stored);
  return token ? { Authorization: 'Bearer ' + token } : {};
}
