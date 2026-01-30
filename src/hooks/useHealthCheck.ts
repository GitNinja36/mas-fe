import { useState, useEffect } from 'react'

// Use ts-server as single API gateway (ping is served by ts-server)
const API_BASE = import.meta.env.VITE_TS_SERVER_BASE ?? import.meta.env.VITE_API_BASE ?? 'http://localhost:1556'
const HEALTH_CHECK_INTERVAL = 30000 // 30 seconds

export type HealthStatus = 'healthy' | 'unhealthy' | 'checking'

export function useHealthCheck() {
  const [status, setStatus] = useState<HealthStatus>('checking')

  const checkHealth = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${API_BASE}/ping`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        // Check if status is "ok" to determine if healthy
        if (data.status === 'ok') {
          setStatus('healthy')
        } else {
          setStatus('unhealthy')
        }
      } else {
        setStatus('unhealthy')
        console.warn(`[Health Check] Server responded with status ${response.status}`)
      }
    } catch (error: any) {
      // Network errors, timeouts, etc.
      if (error.name === 'AbortError' || error.name === 'AbortSignal') {
        console.warn(`[Health Check] Timeout connecting to ${API_BASE} - server may be slow or unreachable`)
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.message?.includes('Load failed')) {
        console.warn(`[Health Check] Cannot reach server at ${API_BASE}`)
        console.warn(`[Health Check] Make sure the server is running. Test with: curl ${API_BASE}/ping`)
      } else {
        console.error('[Health Check] Error:', error)
      }
      setStatus('unhealthy')
    }
  }

  useEffect(() => {
    // Initial check
    checkHealth()

    // Set up polling interval (30 seconds)
    const interval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return status
}
