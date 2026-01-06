const KEY = "auth_v1";

function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}

export function getStoredAuth() {
  const data = safeParse(localStorage.getItem(KEY) || "");
  return data?.access_token ? data : null;
}

export function getAccessToken() {
  return getStoredAuth()?.access_token || null;
}

export function persistAuth({ access_token, user }) {
  localStorage.setItem(KEY, JSON.stringify({ access_token, user }));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}
