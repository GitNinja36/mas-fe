const TS_SERVER_BASE = import.meta.env.VITE_TS_SERVER_BASE ?? 'http://localhost:1556'

export interface LoginRequest {
  email: string
}

export interface SignupRequest {
  email: string
  username: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    username: string
    isEmailVerified: boolean
    status: string
  }
}

export async function login(email: string): Promise<{ message: string; email: string }> {
  try {
    const response = await fetch(`${TS_SERVER_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || data.data?.message || `Login failed: ${response.status}`)
    }

    const result = await response.json()
    // Handle both { success: true, data: {...} } and direct response formats
    return result.data || result
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function signup(email: string, username: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${TS_SERVER_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || data.data?.message || `Signup failed: ${response.status}`)
    }

    const result = await response.json()
    const authData = result.data || result
    // Store tokens if provided (signup returns tokens immediately)
    if (authData.accessToken) {
      localStorage.setItem('accessToken', authData.accessToken)
      localStorage.setItem('refreshToken', authData.refreshToken)
    }
    return authData
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

export async function verifyOtp(email: string, otp: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${TS_SERVER_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || data.data?.message || `OTP verification failed: ${response.status}`)
    }

    const result = await response.json()
    const authData = result.data || result
    // Store tokens
    if (authData.accessToken) {
      localStorage.setItem('accessToken', authData.accessToken)
      localStorage.setItem('refreshToken', authData.refreshToken)
    }
    return authData
  } catch (error) {
    console.error('OTP verification error:', error)
    throw error
  }
}

export async function resendOtp(email: string): Promise<{ message: string; isNewOtp: boolean }> {
  try {
    const response = await fetch(`${TS_SERVER_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || data.data?.message || `Resend OTP failed: ${response.status}`)
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Resend OTP error:', error)
    throw error
  }
}

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '/login'
}

// Check if a JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.exp) return true
    // Check if token expires in less than 5 minutes (refresh early)
    return payload.exp * 1000 < Date.now() + 5 * 60 * 1000
  } catch {
    return true
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(): Promise<AuthResponse | null> {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      return null
    }

    const response = await fetch(`${TS_SERVER_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      // Refresh token is invalid or expired
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return null
    }

    const result = await response.json()
    const authData = result.data || result
    
    if (authData.accessToken) {
      localStorage.setItem('accessToken', authData.accessToken)
      localStorage.setItem('refreshToken', authData.refreshToken)
      return authData
    }
    
    return null
  } catch (error) {
    console.error('Token refresh error:', error)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return null
  }
}

// Get valid access token, refreshing if necessary
export async function getValidAccessToken(): Promise<string | null> {
  let accessToken = localStorage.getItem('accessToken')
  
  if (!accessToken) {
    return null
  }

  // Check if token is expired or about to expire
  if (isTokenExpired(accessToken)) {
    // Try to refresh
    const refreshed = await refreshAccessToken()
    if (refreshed?.accessToken) {
      return refreshed.accessToken
    }
    return null
  }

  return accessToken
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('accessToken')
  if (!token) return false
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Token exists but is expired - we'll try to refresh on next API call
    // For now, return true if refresh token exists
    return !!localStorage.getItem('refreshToken')
  }
  
  return true
}

export interface CreditSummary {
  totalCredits: number
  usedCredits: number
  availableCredits: number
}

export async function getCreditSummary(): Promise<CreditSummary> {
  try {
    // Get valid token (will refresh if expired)
    const token = await getValidAccessToken()
    if (!token) {
      throw new Error('Authentication required. Please login.')
    }

    const response = await fetch(`${TS_SERVER_BASE}/credit/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be invalid, try refreshing once
        const refreshed = await refreshAccessToken()
        if (refreshed?.accessToken) {
          // Retry with new token
          const retryResponse = await fetch(`${TS_SERVER_BASE}/credit/summary`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshed.accessToken}`
            },
          })
          if (retryResponse.ok) {
            const result = await retryResponse.json()
            return result.data || result
          }
        }
        throw new Error('Authentication required. Please login.')
      }
      if (response.status === 429) {
        // Try to get message from response, but don't fail if parsing fails
        try {
          const data = await response.json()
          throw new Error(data.message || 'Rate limit exceeded. Please wait a moment and try again.')
        } catch (parseError) {
          // If JSON parsing fails, use default message
          throw new Error('Rate limit exceeded. Please wait a moment and try again.')
        }
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to fetch credits: ${response.status}`)
    }

    const result = await response.json()
    return result.data || result
  } catch (error: any) {
    // Don't log connection errors as errors - server might be down
    if (error.message?.includes('Failed to fetch') || error.message?.includes('Load failed')) {
      console.warn('Credit service unavailable - ts_server may not be running')
      // Return default credits instead of throwing
      return {
        totalCredits: 0,
        usedCredits: 0,
        availableCredits: 0
      }
    }
    console.error('Get credit summary error:', error)
    throw error
  }
}
