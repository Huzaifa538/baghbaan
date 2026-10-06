import type { AskResponse, CalendarData, HealthResponse } from '../types'

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as T
}

/** Load the curated Karachi planting calendar (served relative to the page). */
export function fetchCalendar(): Promise<CalendarData> {
  return fetch('data/karachi-calendar.json').then(asJson<CalendarData>)
}

/** Ping the local model backend. */
export function fetchHealth(): Promise<HealthResponse> {
  return fetch('/api/health').then(asJson<HealthResponse>)
}

/** Ask Baghbaan a free-text question. */
export function askBaghbaan(question: string): Promise<AskResponse> {
  return fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  }).then(asJson<AskResponse>)
}
