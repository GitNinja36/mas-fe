/**
 * Get the API base URL based on environment
 * Uses environment variable or defaults to localhost for development
 */
export function getApiBase(): string {
  // Use environment variable if set
  const envApiBase = import.meta.env.VITE_API_BASE
  
  if (envApiBase) {
    return envApiBase
  }
  
  // Default to localhost for development
  return 'http://127.0.0.1:8000'
}
