'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminAuthGuard } from '@/components/AdminAuthGuard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Loader, Search, Download, Calendar } from 'lucide-react'

function AdminReportsContent() {
  const [searches, setSearches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('')
  const [filteredSearches, setFilteredSearches] = useState<any[]>([])

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/searches?limit=500`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!response.ok) throw new Error('Failed to fetch searches')

        const data = await response.json()
        setSearches(data.records || [])
        setFilteredSearches(data.records || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSearches()
  }, [])

  // Filter searches
  useEffect(() => {
    let filtered = searches

    if (serviceTypeFilter) {
      filtered = filtered.filter(s => s.service_type === serviceTypeFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.found_service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.search_address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredSearches(filtered)
  }, [searchQuery, serviceTypeFilter, searches])

  const handleExport = () => {
    const csv = [
      ['Date', 'User Email', 'Username', 'Service Type', 'Searched From', 'Service Found', 'Phone', 'Distance (km)'],
      ...filteredSearches.map(s => [
        new Date(s.timestamp).toLocaleString(),
        s.user?.email,
        s.user?.username,
        s.service_type,
        s.search_address,
        s.found_service_name,
        s.found_service_phone || 'N/A',
        s.distance_km?.toFixed(2) || 'N/A'
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `search-reports-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Search Reports</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Filters */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Filter Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Email, username, service, address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Service Type</label>
                  <select
                    value={serviceTypeFilter}
                    onChange={(e) => setServiceTypeFilter(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">All Services</option>
                    <option value="police">Police</option>
                    <option value="hospital">Hospital</option>
                    <option value="fire">Fire</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleExport}
                disabled={filteredSearches.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV ({filteredSearches.length})
              </Button>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="text-slate-300">
            Showing {filteredSearches.length} of {searches.length} searches
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader className="h-8 w-8 text-blue-400 animate-spin mx-auto" />
              <p className="text-slate-400 mt-4">Loading search reports...</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && filteredSearches.length > 0 && (
            <div className="space-y-4">
              {filteredSearches.map((search, index) => (
                <Card key={index} className="border-slate-700 bg-slate-800/30 backdrop-blur hover:bg-slate-800/50 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* User Info */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-400">User</p>
                          <p className="text-sm font-medium text-white">{search.user?.username}</p>
                          <p className="text-xs text-blue-400">{search.user?.email}</p>
                          {search.user?.phone && (
                            <p className="text-xs text-slate-400">Phone: {search.user.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Search Details */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-400">Service Type</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            search.service_type === 'police'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : search.service_type === 'hospital'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {search.service_type.toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Search Date</p>
                          <p className="text-sm text-white">
                            {new Date(search.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Location Info */}
                      <div className="space-y-2 md:col-span-2">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-400">Searched From</p>
                            <p className="text-sm text-white">{search.search_address || 'Unknown'}</p>
                            <p className="text-xs text-slate-500">
                              ({search.user_lat?.toFixed(4)}, {search.user_lon?.toFixed(4)})
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">Service Found</p>
                            <p className="text-sm text-white">{search.found_service_name || 'N/A'}</p>
                            {search.found_service_phone && (
                              <p className="text-xs text-blue-400">{search.found_service_phone}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 md:col-span-2">
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="p-2 bg-slate-700/30 rounded">
                            <p className="text-xs text-slate-400">Distance</p>
                            <p className="text-white font-medium">
                              {search.distance_km ? `${search.distance_km.toFixed(2)} km` : 'N/A'}
                            </p>
                          </div>
                          <div className="p-2 bg-slate-700/30 rounded">
                            <p className="text-xs text-slate-400">Results Count</p>
                            <p className="text-white font-medium">{search.search_results_count || 1}</p>
                          </div>
                          <div className="p-2 bg-slate-700/30 rounded">
                            <p className="text-xs text-slate-400">Device</p>
                            <p className="text-white font-medium text-xs truncate">{search.device_info || 'Unknown'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSearches.length === 0 && searches.length > 0 && (
            <Card className="border-slate-700 bg-slate-800/30 text-center py-12">
              <CardContent>
                <p className="text-slate-400">No searches match your filters.</p>
              </CardContent>
            </Card>
          )}

          {!loading && searches.length === 0 && (
            <Card className="border-slate-700 bg-slate-800/30 text-center py-12">
              <CardContent>
                <p className="text-slate-400">No search records found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminReportsPage() {
  return (
    <AdminAuthGuard>
      <AdminReportsContent />
    </AdminAuthGuard>
  )
}
