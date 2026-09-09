const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Thin fetch wrapper: attaches the auth token, always sends/expects JSON,
// and throws a plain Error with the backend's message on non-2xx so
// callers can just try/catch instead of checking res.ok everywhere.
async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // Non-JSON response body — fall through with data left null.
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

export const api = {
  get: (path, token) => request(path, { method: 'GET', token }),
  post: (path, body, token) => request(path, { method: 'POST', body, token }),
  put: (path, body, token) => request(path, { method: 'PUT', body, token }),
}
