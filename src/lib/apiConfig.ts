/**
 * Get the API base URL based on environment
 * In production (Vercel), use the proxy endpoint to avoid CORS issues
 * In development, use the direct API URL
 */
export function getApiBase(): string {
  // If explicitly set via environment variable
  const envApiBase = import.meta.env.VITE_API_BASE
  
  if (envApiBase) {
    // If it's a localhost URL, use it directly (for local dev)
    if (envApiBase.startsWith('http://127.0.0.1') || envApiBase.startsWith('http://localhost')) {
      return envApiBase
    }
    // If it's a remote URL and we're in production, use proxy
    // Otherwise use the direct URL
    if (import.meta.env.PROD && !envApiBase.includes('localhost') && !envApiBase.includes('127.0.0.1')) {
      return '/api'
    }
    return envApiBase
  }
  
  // In production, use proxy to avoid CORS
  if (import.meta.env.PROD) {
    return '/api'
  }
  
  // Default to localhost for development
  return 'http://127.0.0.1:8000'
}
