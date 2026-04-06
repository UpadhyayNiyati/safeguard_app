'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Mail, Phone, MapPin, Shield, User, Search } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface AdminUser {
  id: number
  email: string
  username: string
  phone: string
  city: string
  role: string
  is_active: boolean
  created_at: string
  search_count: number
}

export default function AdminUsersList() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [totalUsers, setTotalUsers] = useState(0)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const query = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
        const response = await fetch(`${API_URL}/api/admin/users?limit=50&offset=${offset}${query}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) throw new Error('Failed to load users')

        const data = await response.json()
        setUsers(data.users)
        setTotalUsers(data.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading users')
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchUsers, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, offset])

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) throw new Error('Failed to update role')

      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating role')
    }
  }

  if (loading) return <div className="text-center py-8">Loading users...</div>

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
          <CardTitle>Users Management</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email, username, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setOffset(0)
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">User</th>
                  <th className="text-left p-3 font-semibold">Contact</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-left p-3 font-semibold">Role</th>
                  <th className="text-left p-3 font-semibold">Searches</th>
                  <th className="text-left p-3 font-semibold">Joined</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-semibold text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500"># {user.id}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="h-4 w-4" />
                          <span className="text-xs break-all">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="h-4 w-4" />
                            <span className="text-xs">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {user.city && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4" />
                          <span className="text-xs">{user.city}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <Shield className="h-4 w-4 text-blue-600" />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                        {user.search_count}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs border rounded p-1 cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {offset + 1}-{Math.min(offset + 50, totalUsers)} of {totalUsers} users
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
                disabled={offset + 50 >= totalUsers}
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
