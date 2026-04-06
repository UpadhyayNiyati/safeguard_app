// 'use client'

// import { useCallback, useState } from 'react'
// import { useAuth } from './useAuth'

// export interface SearchRecord {
//   id: number
//   service_type: 'police' | 'hospital' | 'fire'
//   search_location_name: string
//   user_lat: number
//   user_lon: number
//   search_address: string
//   found_service_name: string
//   found_service_type: string
//   found_service_lat: number
//   found_service_lon: number
//   found_service_phone: string
//   found_service_address: string
//   distance_km: number
//   search_results_count: number
//   timestamp: string
//   ip_address: string
//   device_info: string
// }

// export interface SearchStats {
//   total_searches: number
//   by_service_type: Record<string, number>
//   recent_searches: SearchRecord[]
// }

// interface UseSearchHistoryReturn {
//   records: SearchRecord[]
//   stats: SearchStats | null
//   loading: boolean
//   error: string | null
//   fetchHistory: (serviceType?: string, limit?: number, offset?: number) => Promise<void>
//   fetchStats: () => Promise<void>
//   recordSearch: (data: Partial<SearchRecord>) => Promise<void>
//   deleteRecord: (recordId: number) => Promise<void>
// }

// export function useSearchHistory(): UseSearchHistoryReturn {
//   const { token } = useAuth()
//   const [records, setRecords] = useState<SearchRecord[]>([])
//   const [stats, setStats] = useState<SearchStats | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

//   const getHeaders = useCallback(() => ({
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`,
//   }), [token])

//   const fetchHistory = useCallback(async (serviceType?: string, limit = 50, offset = 0) => {
//     if (!token) return

//     setLoading(true)
//     setError(null)

//     try {
//       const params = new URLSearchParams()
//       if (serviceType) params.append('service_type', serviceType)
//       params.append('limit', limit.toString())
//       params.append('offset', offset.toString())

//       const response = await fetch(`${API_BASE}/search-history?${params}`, {
//         method: 'GET',
//         headers: getHeaders(),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to fetch search history')
//       }

//       setRecords(data.records)
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch search history'
//       setError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }, [token, API_BASE, getHeaders])

//   const fetchStats = useCallback(async () => {
//     if (!token) return

//     setLoading(true)
//     setError(null)

//     try {
//       const response = await fetch(`${API_BASE}/search-stats`, {
//         method: 'GET',
//         headers: getHeaders(),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to fetch search stats')
//       }

//       setStats(data)
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch search stats'
//       setError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }, [token, API_BASE, getHeaders])

//   const recordSearch = useCallback(async (data: Partial<SearchRecord>) => {
//     if (!token) return

//     setLoading(true)
//     setError(null)

//     try {
//       const response = await fetch(`${API_BASE}/search-history`, {
//         method: 'POST',
//         headers: getHeaders(),
//         body: JSON.stringify(data),
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to record search')
//       }

//       setRecords((prev) => [result.record, ...prev])
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to record search'
//       setError(errorMessage)
//       throw err
//     } finally {
//       setLoading(false)
//     }
//   }, [token, API_BASE, getHeaders])

//   const deleteRecord = useCallback(async (recordId: number) => {
//     if (!token) return

//     setLoading(true)
//     setError(null)

//     try {
//       const response = await fetch(`${API_BASE}/search-history/${recordId}`, {
//         method: 'DELETE',
//         headers: getHeaders(),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to delete record')
//       }

//       setRecords((prev) => prev.filter((r) => r.id !== recordId))
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to delete record'
//       setError(errorMessage)
//       throw err
//     } finally {
//       setLoading(false)
//     }
//   }, [token, API_BASE, getHeaders])

//   return {
//     records,
//     stats,
//     loading,
//     error,
//     fetchHistory,
//     fetchStats,
//     recordSearch,
//     deleteRecord,
//   }
// }


'use client'

import { useCallback, useState , useEffect} from 'react'
import { useAuth } from './useAuth'

export interface SearchRecord {
  id: number
  service_type: 'police' | 'hospital' | 'fire'
  search_location_name: string
  user_lat: number
  user_lon: number
  search_address: string
  found_service_name: string
  found_service_type: string
  found_service_lat: number
  found_service_lon: number
  found_service_phone: string
  found_service_address: string
  distance_km: number
  search_results_count: number
  timestamp: string
  ip_address: string
  device_info: string
}

export interface SearchStats {
  total_searches: number
  by_service_type: Record<string, number>
  recent_searches: SearchRecord[]
}

interface UseSearchHistoryReturn {
  records: SearchRecord[]
  stats: SearchStats | null
  loading: boolean
  error: string | null
  fetchHistory: (serviceType?: string, limit?: number, offset?: number) => Promise<void>
  fetchStats: () => Promise<void>
  recordSearch: (data: Partial<SearchRecord>) => Promise<void>
  deleteRecord: (recordId: number) => Promise<void>
}

export function useSearchHistory(): UseSearchHistoryReturn {
  const { token } = useAuth()
  const [records, setRecords] = useState<SearchRecord[]>([])
  const [stats, setStats] = useState<SearchStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  // ✅ FIXED: Always return valid HeadersInit
  const getHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }, [token])

  const fetchHistory = useCallback(async (serviceType?: string, limit = 50, offset = 0) => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (serviceType) params.append('service_type', serviceType)
      params.append('limit', limit.toString())
      params.append('offset', offset.toString())

      const response = await fetch(`${API_BASE}/search-history?${params}`, {
        method: 'GET',
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch search history')
      }

      setRecords(data.records)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch search history'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [token, API_BASE, getHeaders])

  const fetchStats = useCallback(async () => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/search-stats`, {
        method: 'GET',
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch search stats')
      }

      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch search stats'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [token, API_BASE, getHeaders])

  useEffect(() => {
    if (token) {
      fetchHistory();
      fetchStats();
    }
  }, [token, fetchHistory, fetchStats]);

  const recordSearch = useCallback(async (data: Partial<SearchRecord>) => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/search-history`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to record search')
      }

      setRecords((prev) => [result.record, ...prev])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record search'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [token, API_BASE, getHeaders])

  const deleteRecord = useCallback(async (recordId: number) => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/search-history/${recordId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete record')
      }

      setRecords((prev) => prev.filter((r) => r.id !== recordId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete record'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [token, API_BASE, getHeaders])

  return {
    records,
    stats,
    loading,
    error,
    fetchHistory,
    fetchStats,
    recordSearch,
    deleteRecord,
  }
}