// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { AdminAuthGuard } from '@/components/AdminAuthGuard'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { AlertCircle, ArrowLeft, Mail, Phone, MapPin, User, Loader, Search } from 'lucide-react'

// function AdminUsersContent() {
//   const [users, setUsers] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [filteredUsers, setFilteredUsers] = useState<any[]>([])

//   // useEffect(() => {
//   //   const fetchUsers = async () => {
//   //     try {
//   //       //const token = localStorage.getItem('token')
//   //       const token = localStorage.getItem('token') || localStorage.getItem('access_token');
//   //       const response = await fetch(
//   //         `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?limit=1000`,
//   //         { headers: { Authorization: `Bearer ${token}` } }
//   //       )

//   //       if (!response.ok) throw new Error('Failed to fetch users')

//   //       const data = await response.json()
//   //       setUsers(data.users || [])
//   //       setFilteredUsers(data.users || [])
//   //     } catch (err: any) {
//   //       setError(err.message)
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }

//   //   fetchUsers()
//   // }, [])

//   useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       // Standardize token check
//       const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
//       if (!token) {
//         setError('No authentication token found');
//         return;
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?limit=1000`,
//         { 
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           } 
//         }
//       )

//       if (response.status === 401) {
//           throw new Error('Session expired or unauthorized');
//       }

//       if (!response.ok) throw new Error('Failed to fetch users')

//       const data = await response.json()
//       setUsers(data.users || [])
//       setFilteredUsers(data.users || [])
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   fetchUsers()
// }, [])

//   // Filter users based on search query
//   useEffect(() => {
//     const filtered = users.filter(user =>
//       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.city?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     setFilteredUsers(filtered)
//   }, [searchQuery, users])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Header */}
//       <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
//           <Link href="/admin">
//             <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50 p-2">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h1 className="text-2xl font-bold text-white">User Management</h1>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="space-y-6">
//           {/* Search Bar */}
//           <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//             <CardHeader>
//               <CardTitle className="text-white">Search Users</CardTitle>
//               <CardDescription className="text-slate-400">
//                 Find users by email, username, phone, or city
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
//                 <Input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pl-10"
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Users Count */}
//           <div className="text-slate-300">
//             Showing {filteredUsers.length} of {users.length} users
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
//               <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//               <p className="text-red-400">{error}</p>
//             </div>
//           )}

//           {/* Loading State */}
//           {loading && (
//             <div className="text-center py-12">
//               <Loader className="h-8 w-8 text-blue-400 animate-spin mx-auto" />
//               <p className="text-slate-400 mt-4">Loading users...</p>
//             </div>
//           )}

//           {/* Users Grid */}
//           {!loading && filteredUsers.length > 0 && (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredUsers.map((user) => (
//                 <Card key={user.id} className="border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300">
//                   <CardHeader className="pb-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3 flex-1">
//                         <div className="bg-blue-500/10 border border-blue-500/30 rounded-full p-2">
//                           <User className="h-5 w-5 text-blue-400" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-white text-lg">{user.username}</CardTitle>
//                           <p className="text-xs text-slate-400">ID: {user.id}</p>
//                         </div>
//                       </div>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         user.role === 'admin'
//                           ? 'bg-purple-500/20 text-purple-300'
//                           : 'bg-blue-500/20 text-blue-300'
//                       }`}>
//                         {user.role}
//                       </span>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="space-y-3">
//                     {/* Email */}
//                     <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
//                       <Mail className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
//                       <div className="min-w-0">
//                         <p className="text-xs text-slate-400">Email</p>
//                         <a href={`mailto:${user.email}`} className="text-sm text-blue-400 hover:text-blue-300 break-all">
//                           {user.email}
//                         </a>
//                       </div>
//                     </div>

//                     {/* Phone */}
//                     {user.phone && (
//                       <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
//                         <Phone className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <p className="text-xs text-slate-400">Phone</p>
//                           <a href={`tel:${user.phone}`} className="text-sm text-blue-400 hover:text-blue-300">
//                             {user.phone}
//                           </a>
//                         </div>
//                       </div>
//                     )}

//                     {/* City */}
//                     {user.city && (
//                       <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
//                         <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <p className="text-xs text-slate-400">City</p>
//                           <p className="text-sm text-slate-300">{user.city}</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Searches */}
//                     <div className="p-3 bg-slate-700/30 rounded-lg">
//                       <p className="text-xs text-slate-400">Total Searches</p>
//                       <p className="text-lg font-bold text-blue-400">{user.search_count || 0}</p>
//                     </div>

//                     {/* Account Info */}
//                     <div className="flex justify-between text-xs text-slate-400 pt-2">
//                       <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
//                       <span className={user.is_active ? 'text-emerald-400' : 'text-red-400'}>
//                         {user.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && filteredUsers.length === 0 && users.length > 0 && (
//             <Card className="border-slate-700 bg-slate-800/30 text-center py-12">
//               <CardContent>
//                 <p className="text-slate-400">No users match your search.</p>
//               </CardContent>
//             </Card>
//           )}

//           {!loading && users.length === 0 && (
//             <Card className="border-slate-700 bg-slate-800/30 text-center py-12">
//               <CardContent>
//                 <p className="text-slate-400">No users found.</p>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function AdminUsersPage() {
//   return (
//     <AdminAuthGuard>
//       <AdminUsersContent />
//     </AdminAuthGuard>
//   )
// }



'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminAuthGuard } from '@/components/AdminAuthGuard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Mail, Phone, MapPin, User, Loader, Search } from 'lucide-react'

function AdminUsersContent() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // Use standard token retrieval
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        
        if (!token) {
          setError('Authentication token missing.')
          return
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        )

        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized: Admin access required.')
        }

        if (!response.ok) throw new Error('Failed to retrieve user database.')

        const data = await response.json()
        setUsers(data.users || [])
        setFilteredUsers(data.users || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search query
  useEffect(() => {
    const filtered = users.filter(user =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/main/dashboard">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white text-xl">Search Directory</CardTitle>
              <CardDescription className="text-slate-400">
                Filter registered users by name, email, or system role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 pl-10 h-12"
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-24">
              <Loader className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Synchronizing User Data...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-slate-700 bg-slate-800/40 backdrop-blur hover:border-blue-500/50 transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500/20 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-base">{user.name}</CardTitle>
                          <p className="text-[10px] text-slate-500 font-mono">UID: {user.id}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex items-center gap-3 text-sm text-slate-300">
                          <Mail className="h-4 w-4 text-slate-500" />
                          <span className="truncate">{user.email}</span>
                       </div>
                       {user.phone && (
                         <div className="flex items-center gap-3 text-sm text-slate-300">
                            <Phone className="h-4 w-4 text-slate-500" />
                            <span>{user.phone}</span>
                         </div>
                       )}
                    </div>
                    <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Joined: {user.created_at}</span>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-blue-400 hover:text-blue-300">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <AdminAuthGuard>
      <AdminUsersContent />
    </AdminAuthGuard>
  )
}