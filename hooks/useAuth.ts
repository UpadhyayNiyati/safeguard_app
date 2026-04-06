// 'use client'

// import { useCallback, useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// export interface User {
//   id: number
//   email: string
//   username: string
//   phone?: string
//   city?: string
//   created_at?: string
// }

// interface AuthContextType {
//   user: User | null
//   token: string | null
//   loading: boolean
//   error: string | null
//   register: (email: string, username: string, password: string, phone?: string, city?: string) => Promise<void>
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
//   isAuthenticated: boolean
// }

// export function useAuth(): AuthContextType {
//   const [user, setUser] = useState<User | null>(null)
//   const [token, setToken] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

//   // Initialize from localStorage
//   useEffect(() => {
//     const storedToken = localStorage.getItem('auth_token')
//     const storedUser = localStorage.getItem('auth_user')
    
//     if (storedToken && storedUser) {
//       setToken(storedToken)
//       try {
//         setUser(JSON.parse(storedUser))
//       } catch (e) {
//         localStorage.removeItem('auth_user')
//         localStorage.removeItem('auth_token')
//       }
//     }
//     setLoading(false)
//   }, [])

//   const register = useCallback(async (email: string, username: string, password: string, phone?: string, city?: string) => {
//     setLoading(true)
//     setError(null)
    
//     try {
//       const response = await fetch(`${API_BASE}/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           username,
//           password,
//           phone,
//           city,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Registration failed')
//       }

//       setUser(data.user)
//       setToken(data.token)
//       localStorage.setItem('auth_token', data.token)
//       localStorage.setItem('auth_user', JSON.stringify(data.user))
      
//       router.push('/home')
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Registration failed'
//       setError(errorMessage)
//       throw err
//     } finally {
//       setLoading(false)
//     }
//   }, [API_BASE, router])

//   const login = useCallback(async (email: string, password: string) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await fetch(`${API_BASE}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Login failed')
//       }

//       setUser(data.user)
//       setToken(data.token)
//       localStorage.setItem('auth_token', data.token)
//       localStorage.setItem('auth_user', JSON.stringify(data.user))
      
//       router.push('/home')
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Login failed'
//       setError(errorMessage)
//       throw err
//     } finally {
//       setLoading(false)
//     }
//   }, [API_BASE, router])

//   const logout = useCallback(() => {
//     setUser(null)
//     setToken(null)
//     setError(null)
//     localStorage.removeItem('auth_token')
//     localStorage.removeItem('auth_user')
//     router.push('/login')
//   }, [router])

//   return {
//     user,
//     token,
//     loading,
//     error,
//     register,
//     login,
//     logout,
//     isAuthenticated: !!token,
//   }
// }


'use client'

import { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: number
  email: string
  username: string
  phone?: string
  city?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  register: (email: string, username: string, password: string, phone?: string, city?: string) => Promise<void>
  login: (email: string, password: string) => Promise<boolean> // Changed to return boolean for OTP flow
  logout: () => void
  isAuthenticated: boolean
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
      }
    }
    setLoading(false)
  }, [])

  const register = useCallback(async (email: string, username: string, password: string, phone?: string, city?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, phone, city }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Registration usually logs you in directly or sends to login
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      
      router.push('/home')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [API_BASE, router])

  /**
   * Updated Login Logic:
   * Returns true if OTP was sent successfully.
   * Does NOT set user/token yet, as verification is required.
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed')
      }

      // If the server says "OK", it means the OTP was sent to the email.
      // We return true so the LoginPage knows it's safe to redirect to /verify-otp
      return true
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      return false // Return false so the UI knows the call failed
    } finally {
      setLoading(false)
    }
  }, [API_BASE])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    router.push('/login')
  }, [router])

  return {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  }
}