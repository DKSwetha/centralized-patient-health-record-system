// Central Axios/fetch wrapper — all API calls go through here.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: Bearer  } : {}),
    ...(options.headers as Record<string, string>),
  }
  const res = await fetch(${BASE_URL}, { ...options, headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
