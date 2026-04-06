// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { AdminAuthGuard } from '@/components/AdminAuthGuard'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Users, BarChart3, FileText, LogOut, Menu, X } from 'lucide-react'

// function AdminDashboardContent() {
//   const [stats, setStats] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [menuOpen, setMenuOpen] = useState(false)

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         )

//         if (!response.ok) throw new Error('Failed to fetch stats')

//         const data = await response.json()
//         setStats(data)
//       } catch (err: any) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStats()
//   }, [])

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     window.location.href = '/auth/login'
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Header */}
//       <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-white">SafeGuard Admin</h1>
//           <div className="hidden md:flex items-center gap-4">
//             <Link href="/dashboard">
//               <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
//                 User Dashboard
//               </Button>
//             </Link>
//             <Button
//               onClick={handleLogout}
//               variant="outline"
//               className="border-red-600/50 text-red-400 hover:bg-red-500/10"
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//           <button
//             className="md:hidden text-slate-300"
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {menuOpen && (
//           <div className="md:hidden border-t border-slate-700/50 bg-slate-800/50 px-4 py-4 space-y-2">
//             <Link href="/dashboard" className="block">
//               <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50">
//                 User Dashboard
//               </Button>
//             </Link>
//             <Button
//               onClick={handleLogout}
//               variant="outline"
//               className="w-full border-red-600/50 text-red-400 hover:bg-red-500/10"
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="space-y-12">
//           {/* Welcome Section */}
//           <div className="space-y-4">
//             <h2 className="text-4xl font-bold text-white">Welcome to Admin Dashboard</h2>
//             <p className="text-slate-300 text-lg">
//               Manage users, view search analytics, and generate reports
//             </p>
//           </div>

//           {/* Stats Cards */}
//           {loading ? (
//             <div className="text-center py-12">
//               <p className="text-slate-400">Loading statistics...</p>
//             </div>
//           ) : error ? (
//             <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
//               {error}
//             </div>
//           ) : stats ? (
//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-white">{stats.total_users}</div>
//                   <p className="text-xs text-slate-400 mt-1">
//                     {stats.regular_users} regular • {stats.admin_count} admin
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-slate-300">Total Searches</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-white">{stats.total_searches}</div>
//                   <p className="text-xs text-slate-400 mt-1">All service searches</p>
//                 </CardContent>
//               </Card>

//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-slate-300">Police Searches</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-cyan-400">
//                     {stats.service_breakdown?.police || 0}
//                   </div>
//                   <p className="text-xs text-slate-400 mt-1">Police stations</p>
//                 </CardContent>
//               </Card>

//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-slate-300">Hospital Searches</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-red-400">
//                     {stats.service_breakdown?.hospital || 0}
//                   </div>
//                   <p className="text-xs text-slate-400 mt-1">Hospitals</p>
//                 </CardContent>
//               </Card>
//             </div>
//           ) : null}

//           {/* Service Breakdown */}
//           {stats && (
//             <div className="grid md:grid-cols-3 gap-6">
//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader>
//                   <CardTitle className="text-white">Fire Station Searches</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-4xl font-bold text-yellow-500">
//                     {stats.service_breakdown?.fire || 0}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader>
//                   <CardTitle className="text-white">Avg Searches per User</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-4xl font-bold text-blue-400">
//                     {stats.total_users > 0 ? (stats.total_searches / stats.total_users).toFixed(1) : 0}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader>
//                   <CardTitle className="text-white">Peak Service Type</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-indigo-400 capitalize">
//                     {Object.entries(stats.service_breakdown || {})
//                       .sort(([, a]: any, [, b]: any) => b - a)[0]?.[0] || 'N/A'}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {/* Quick Actions */}
//           <div className="space-y-4">
//             <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
//             <div className="grid md:grid-cols-3 gap-6">
//               <Link href="/admin/users">
//                 <Card className="border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 cursor-pointer h-full">
//                   <CardHeader>
//                     <div className="flex items-center gap-3">
//                       <Users className="h-8 w-8 text-blue-400" />
//                       <CardTitle className="text-white">Manage Users</CardTitle>
//                     </div>
//                     <CardDescription className="text-slate-400">
//                       View all users and their contact information
//                     </CardDescription>
//                   </CardHeader>
//                 </Card>
//               </Link>

//               <Link href="/admin/search-analytics">
//                 <Card className="border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 cursor-pointer h-full">
//                   <CardHeader>
//                     <div className="flex items-center gap-3">
//                       <BarChart3 className="h-8 w-8 text-green-400" />
//                       <CardTitle className="text-white">Analytics</CardTitle>
//                     </div>
//                     <CardDescription className="text-slate-400">
//                       View search patterns and statistics
//                     </CardDescription>
//                   </CardHeader>
//                 </Card>
//               </Link>

//               <Link href="/admin/reports">
//                 <Card className="border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 cursor-pointer h-full">
//                   <CardHeader>
//                     <div className="flex items-center gap-3">
//                       <FileText className="h-8 w-8 text-purple-400" />
//                       <CardTitle className="text-white">Reports</CardTitle>
//                     </div>
//                     <CardDescription className="text-slate-400">
//                       Generate detailed reports
//                     </CardDescription>
//                   </CardHeader>
//                 </Card>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function AdminPage() {
//   return (
//     <AdminAuthGuard>
//       <AdminDashboardContent />
//     </AdminAuthGuard>
//   )
// }








'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminAuthGuard } from '@/components/AdminAuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BarChart3, FileText, LogOut, Menu, X } from 'lucide-react'

// 1. Internal Content Component
function DashboardView() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">SafeGuard Admin Dashboard</h1>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Your cards go here */}
           <Card className="bg-slate-800 border-slate-700">
             <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
             <CardContent>{stats?.total_users || 0}</CardContent>
           </Card>
        </div>
      )}
    </div>
  )
}

// 2. REQUIRED DEFAULT EXPORT
export default function Page() {
  return (
    <AdminAuthGuard>
      <DashboardView />
    </AdminAuthGuard>
  )
}