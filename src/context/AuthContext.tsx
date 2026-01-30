import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { isAuthenticated, logout as logoutUser, getCreditSummary, refreshAccessToken, type CreditSummary } from '../lib/authApi'

interface AuthContextType {
  isAuthenticated: boolean
  user: { id: string; email: string; username: string } | null
  credits: CreditSummary | null
  login: (email: string, username?: string) => void
  logout: () => void
  refreshCredits: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean
    user: { id: string; email: string; username: string } | null
  }>({
    isAuthenticated: false,
    user: null,
  })
  const [credits, setCredits] = useState<CreditSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [creditFetchTimeout, setCreditFetchTimeout] = useState<NodeJS.Timeout | null>(null)

  const fetchCredits = async () => {
    if (!isAuthenticated()) {
      setCredits(null)
      return
    }
    
    try {
      const creditData = await getCreditSummary()
      setCredits(creditData)
    } catch (error: any) {
      // Handle rate limit errors gracefully
      if (error.message?.includes('429') || error.message?.includes('rate limit') || error.message?.includes('Too many requests')) {
        console.warn('Rate limit reached for credits, will retry later')
        // Don't update credits on rate limit - keep existing values
        return
      }
      // Silently handle connection errors - server might be down
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Load failed')) {
        console.warn('Credit service unavailable')
        setCredits({
          totalCredits: 0,
          usedCredits: 0,
          availableCredits: 0
        })
      } else {
        console.error('Failed to fetch credits:', error)
        setCredits(null)
      }
    }
  }

  // Debounced credit refresh to prevent excessive API calls
  const debouncedRefreshCredits = () => {
    if (creditFetchTimeout) {
      clearTimeout(creditFetchTimeout)
    }
    const timeout = setTimeout(() => {
      fetchCredits()
    }, 500) // Wait 500ms before fetching
    setCreditFetchTimeout(timeout)
  }

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
        try {
          // Get valid token (may refresh if expired)
          const { getValidAccessToken } = await import('../lib/authApi')
          let token = await getValidAccessToken()
          
          if (token) {
            try {
              // Decode JWT payload (simple base64 decode)
              const payload = JSON.parse(atob(token.split('.')[1]))
              
              // Check if token is still valid (not expired)
              if (payload.exp && payload.exp * 1000 > Date.now()) {
                setAuthState({
                  isAuthenticated: true,
                  user: {
                    id: payload.id || '',
                    email: payload.email || '',
                    username: payload.username || '',
                  },
                })
                // Fetch credits after authentication is confirmed
                await fetchCredits()
              } else {
                // Token expired, try to refresh
                const refreshed = await refreshAccessToken()
                
                if (refreshed?.accessToken) {
                  const newPayload = JSON.parse(atob(refreshed.accessToken.split('.')[1]))
                  setAuthState({
                    isAuthenticated: true,
                    user: {
                      id: newPayload.id || refreshed.user?.id || '',
                      email: newPayload.email || refreshed.user?.email || '',
                      username: newPayload.username || refreshed.user?.username || '',
                    },
                  })
                  await fetchCredits()
                } else {
                  // Refresh failed, clear auth
                  setAuthState({ isAuthenticated: false, user: null })
                  setCredits(null)
                }
              }
            } catch (e) {
              // If token is invalid, try to refresh
              const refreshed = await refreshAccessToken()
              
              if (refreshed?.accessToken) {
                const newPayload = JSON.parse(atob(refreshed.accessToken.split('.')[1]))
                setAuthState({
                  isAuthenticated: true,
                  user: {
                    id: newPayload.id || refreshed.user?.id || '',
                    email: newPayload.email || refreshed.user?.email || '',
                    username: newPayload.username || refreshed.user?.username || '',
                  },
                })
                await fetchCredits()
              } else {
                // Refresh failed, clear auth
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                setAuthState({ isAuthenticated: false, user: null })
                setCredits(null)
              }
            }
          } else {
            // No token available
            setAuthState({ isAuthenticated: false, user: null })
            setCredits(null)
          }
      } catch (error) {
        console.error('Auth check error:', error)
        setAuthState({ isAuthenticated: false, user: null })
        setCredits(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    
    // Listen for storage changes (e.g., login from another tab)
    const handleStorageChange = () => {
      checkAuth()
    }
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = async (email: string, username?: string) => {
    setAuthState({
      isAuthenticated: true,
      user: { id: '', email, username: username || '' },
    })
    // Fetch credits after login
    await fetchCredits()
  }

  const logout = () => {
    logoutUser()
    setAuthState({
      isAuthenticated: false,
      user: null,
    })
    setCredits(null)
  }

  const refreshCredits = async () => {
    // For immediate refresh (e.g., after survey completion), call fetchCredits directly
    // For dropdown opens, use debounced version
    await fetchCredits()
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (creditFetchTimeout) {
        clearTimeout(creditFetchTimeout)
      }
    }
  }, [creditFetchTimeout])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        credits,
        login,
        logout,
        refreshCredits,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
