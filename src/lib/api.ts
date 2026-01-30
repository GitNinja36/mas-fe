export type CohortCountRequest = {
  message: string
}

export type CohortCountResponse = {
  cohort_query: string
  user_count: number
  source: string
}

// Use ts-server as single API gateway (proxies /imint/cohort-count to Python)
const API_BASE = import.meta.env.VITE_TS_SERVER_BASE ?? import.meta.env.VITE_API_BASE ?? 'http://localhost:1556'

export async function queryCohort(req: CohortCountRequest): Promise<CohortCountResponse> {
  try {
    const res = await fetch(`${API_BASE}/imint/cohort-count`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    })

    if (!res.ok) {
      let detail = ''
      try {
        const data = await res.json()
        detail = data?.detail || data?.message || JSON.stringify(data)
      } catch {
        try { detail = await res.text() } catch {}
      }
      const suffix = detail ? ` - ${detail.slice(0, 200)}` : ''
      throw new Error(`Cohort count API error: ${res.status}${suffix}`)
    }

    return res.json()
  } catch (err: any) {
    if (err?.name === 'TypeError' || /Failed to fetch/i.test(String(err?.message))) {
      throw new Error('Network error: cannot reach cohort count API. Is the server running?')
    }
    throw err
  }
}
