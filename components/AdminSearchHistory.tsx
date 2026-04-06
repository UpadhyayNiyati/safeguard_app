'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Search, Ambulance, Shield, Flame, MapPin, User, Clock } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface SearchRecord {
  id: number
  service_type: string
  search_location_name: string
  found_service_name: string
  found_service_type: string
  distance_km: number
  timestamp: string
  user: {
    id: number
    email: string
    username: string
    phone: string
    city: string
  }
}

const getServiceIcon = (type: string) => {
  switch (type) {
    case 'hospital':
      return <Ambulance className="h-4 w-4 text-red-600" />
    case 'police':
      return <Shield className="h-4 w-4 text-blue-600" />
    case 'fire':
      return <Flame className="h-4 w-4 text-orange-600" />
    default:
      return null
  }
}

const getServiceColor = (type: string) => {
  switch (type) {
    case 'hospital':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'police':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'fire':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export default function AdminSearchHistory() {
  const [searches, setSearches] = useState<SearchRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [totalSearches, setTotalSearches] = useState(0)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const token = localStorage.getItem('token')
        const query = serviceType ? `&service_type=${encodeURIComponent(serviceType)}` : ''
        const response = await fetch(`${API_URL}/api/admin/searches?limit=50&offset=${offset}${query}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) throw new Error('Failed to load searches')

        const data = await response.json()
        setSearches(data.records)
        setTotalSearches(data.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading searches')
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchSearches, 300)
    return () => clearTimeout(debounce)
  }, [serviceType, offset])

  if (loading) return <div className="text-center py-8">Loading searches...</div>

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Search Records</CardTitle>
          <CardDescription>System-wide search history and analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={serviceType}
              onChange={(e) => {
                setServiceType(e.target.value)
                setOffset(0)
              }}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Services</option>
              <option value="hospital">Hospital</option>
              <option value="police">Police Station</option>
              <option value="fire">Fire Station</option>
            </select>
          </div>

          {/* Search Records List */}
          <div className="space-y-3">
            {searches.map((search) => (
              <div key={search.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left column - Search details */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Service Searched</p>
                      <div className="flex items-center gap-2">
                        {getServiceIcon(search.service_type)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getServiceColor(search.service_type)}`}>
                          {search.service_type.charAt(0).toUpperCase() + search.service_type.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Searched From</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{search.search_location_name || 'Location'}</p>
                          <p className="text-xs text-gray-500">{search.distance_km?.toFixed(1) || '0'} km away</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Service Found</p>
                      <p className="text-sm font-semibold text-gray-900">{search.found_service_name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{search.found_service_type || 'Unknown type'}</p>
                    </div>
                  </div>

                  {/* Right column - User & Time */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Searched By</p>
                      <div className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="font-semibold text-sm text-gray-900">{search.user.username}</p>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p>Email: {search.user.email}</p>
                          {search.user.phone && <p>Phone: {search.user.phone}</p>}
                          {search.user.city && <p>City: {search.user.city}</p>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">When</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(search.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getTimeAgo(new Date(search.timestamp))}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Record</p>
                      <p className="text-sm font-mono text-gray-600">ID: {search.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {searches.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No search records found
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {offset + 1}-{Math.min(offset + 50, totalSearches)} of {totalSearches} searches
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(Math.max(0, offset - 50))}
                disabled={offset === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(offset + 50)}
                disabled={offset + 50 >= totalSearches}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}
