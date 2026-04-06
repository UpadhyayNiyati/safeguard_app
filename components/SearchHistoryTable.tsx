'use client'

import { useEffect, useState } from 'react'
import { useSearchHistory } from '../hooks/useSearchHistory'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertCircle, Trash2, MapPin, Clock, Phone, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '../hooks/useAuth'

const SERVICE_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  police: { label: 'Police Station', icon: '🚔', color: 'bg-blue-100' },
  hospital: { label: 'Hospital', icon: '🏥', color: 'bg-red-100' },
  fire: { label: 'Fire Station', icon: '🚒', color: 'bg-orange-100' },
}

export function SearchHistoryTable() {
  const { isAuthenticated } = useAuth()
  const { records, loading, error, fetchHistory, deleteRecord } = useSearchHistory()
  const [filter, setFilter] = useState<'all' | 'police' | 'hospital' | 'fire'>('all')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory(filter === 'all' ? undefined : filter)
    }
  }, [isAuthenticated, filter, fetchHistory])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id)
      } catch (err) {
        console.error('Failed to delete record:', err)
      }
    }
  }

  const filteredRecords = records.filter((record) => {
    const matchesText =
      !searchText ||
      record.search_address?.toLowerCase().includes(searchText.toLowerCase()) ||
      record.found_service_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      record.found_service_address?.toLowerCase().includes(searchText.toLowerCase())

    return matchesText
  })

  if (!isAuthenticated) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Please log in to view your search history</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Search History</h2>
        <span className="text-sm text-gray-600">
          {filteredRecords.length} {filteredRecords.length === 1 ? 'search' : 'searches'}
        </span>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex gap-2">
          {['all', 'police', 'hospital', 'fire'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              className={
                filter === type
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'hover:bg-gray-100'
              }
              onClick={() => setFilter(type as typeof filter)}
            >
              {type === 'all' ? 'All' : SERVICE_TYPES[type]?.icon}{' '}
              {type === 'all' ? 'All' : SERVICE_TYPES[type]?.label}
            </Button>
          ))}
        </div>

        <Input
          placeholder="Search by address or service name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No searches found.</p>
          {records.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Start searching for emergency services to build your history.
            </p>
          )}
        </Card>
      ) : (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Searched From</TableHead>
                  <TableHead className="font-semibold">Service Found</TableHead>
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Distance</TableHead>
                  <TableHead className="font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const serviceType = SERVICE_TYPES[record.service_type]
                  const timestamp = new Date(record.timestamp)
                  const formattedDate = timestamp.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                  const formattedTime = timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  return (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${serviceType?.color || 'bg-gray-100'}`}>
                          {serviceType?.icon} {serviceType?.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            {record.search_location_name && (
                              <div className="font-medium text-sm text-gray-900">
                                {record.search_location_name}
                              </div>
                            )}
                            <div className="text-xs text-gray-600">
                              {record.search_address}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {record.found_service_name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {record.found_service_address}
                          </div>
                          {record.found_service_phone && (
                            <div className="flex items-center gap-1 text-xs text-indigo-600 mt-1">
                              <Phone className="h-3 w-3" />
                              {record.found_service_phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{formattedDate}</div>
                            <div className="text-xs text-gray-600">{formattedTime}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-900">
                          {record.distance_km ? `${record.distance_km.toFixed(1)} km` : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}