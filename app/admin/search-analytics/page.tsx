// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { AdminAuthGuard } from '@/components/AdminAuthGuard'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { AlertCircle, ArrowLeft, Loader } from 'lucide-react'
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// interface AnalyticsData {
//   service_breakdown: Record<string, number>;
//   daily_searches_last_30_days: Record<string, number>;
//   total_users: number;
//   regular_users: number;
//   admin_count: number;
//   total_searches: number;
// }

// function SearchAnalyticsContent() {
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         )

//         if (!response.ok) throw new Error('Failed to fetch analytics')

//         const data = await response.json()
//         setAnalytics(data)
//       } catch (err: any) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchAnalytics()
//   }, [])

//   // Derived Data Calculations
//   const serviceChartData = analytics
//     ? Object.entries(analytics.service_breakdown || {}).map(([name, value]) => ({
//         name: name.charAt(0).toUpperCase() + name.slice(1),
//         value: value
//       }))
//     : []

//   const dailyChartData = analytics
//     ? Object.entries(analytics.daily_searches_last_30_days || {})
//         .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
//         .map(([date, count]) => ({
//           date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//           searches: count
//         }))
//     : []

//   // Get Top Service helper
//   const getTopService = () => {
//     if (!analytics?.service_breakdown) return { name: 'N/A', count: 0 };
//     const sorted = Object.entries(analytics.service_breakdown).sort(([, a], [, b]) => b - a);
//     return sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : { name: 'N/A', count: 0 };
//   }

//   const topService = getTopService();

//   const COLORS: Record<string, string> = {
//     police: '#06B6D4',
//     hospital: '#F87171',
//     fire: '#FBBF24'
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
//           <Link href="/admin">
//             <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50 p-2">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h1 className="text-2xl font-bold text-white">Search Analytics</h1>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="space-y-8">
//           {error && (
//             <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
//               <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//               <p className="text-red-400">{error}</p>
//             </div>
//           )}

//           {loading && (
//             <div className="text-center py-12">
//               <Loader className="h-8 w-8 text-blue-400 animate-spin mx-auto" />
//               <p className="text-slate-400 mt-4">Loading analytics...</p>
//             </div>
//           )}

//           {!loading && analytics && (
//             <>
//               {/* Service Type Breakdown Chart */}
//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader>
//                   <CardTitle className="text-white">Searches by Service Type</CardTitle>
//                   <CardDescription className="text-slate-400">
//                     Distribution of searches across police, hospital, and fire services
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {serviceChartData.length > 0 ? (
//                     <div className="h-[300px] w-full">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={serviceChartData}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             label={({ name, value }) => `${name}: ${value}`}
//                             outerRadius={100}
//                             fill="#8884d8"
//                             dataKey="value"
//                           >
//                             {serviceChartData.map((entry, index) => (
//                               <Cell
//                                 key={`cell-${index}`}
//                                 fill={COLORS[entry.name.toLowerCase()] || '#6B7280'}
//                               />
//                             ))}
//                           </Pie>
//                           <Tooltip
//                             contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '0.5rem' }}
//                             labelStyle={{ color: '#F1F5F9' }}
//                           />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   ) : (
//                     <p className="text-slate-400 text-center py-8">No search data available</p>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Daily Searches Chart */}
//               <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//                 <CardHeader>
//                   <CardTitle className="text-white">Daily Searches (Last 30 Days)</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {dailyChartData.length > 0 ? (
//                     <div className="h-[300px] w-full">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={dailyChartData}>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
//                           <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
//                           <YAxis stroke="#94A3B8" fontSize={12} />
//                           <Tooltip
//                             contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '0.5rem' }}
//                             itemStyle={{ color: '#F1F5F9' }}
//                           />
//                           <Bar dataKey="searches" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   ) : (
//                     <p className="text-slate-400 text-center py-8">No data available for the last 30 days</p>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Summary Stats */}
//               <div className="grid md:grid-cols-3 gap-6">
//                 <Card className="border-slate-700 bg-slate-800/50">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold text-white">{analytics.total_users}</div>
//                     <p className="text-xs text-slate-400 mt-1">
//                       {analytics.regular_users} regular • {analytics.admin_count} admin
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-slate-700 bg-slate-800/50">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-sm font-medium text-slate-300">Total Searches</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold text-white">{analytics.total_searches}</div>
//                     <p className="text-xs text-slate-400 mt-1">
//                       {analytics.total_users > 0 ? (analytics.total_searches / analytics.total_users).toFixed(1) : 0} searches/user
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-slate-700 bg-slate-800/50">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-sm font-medium text-slate-300">Most Searched Service</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold text-blue-400 capitalize">
//                       {topService.name}
//                     </div>
//                     <p className="text-xs text-slate-400 mt-1">
//                       {topService.count} total searches
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function SearchAnalyticsPage() {
//   return (
//     <AdminAuthGuard>
//       <SearchAnalyticsContent />
//     </AdminAuthGuard>
//   )
// }










'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminAuthGuard } from '@/components/AdminAuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Loader, RefreshCw } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface AnalyticsData {
  service_breakdown: Record<string, number>;
  daily_searches_last_30_days: Record<string, number>;
  total_users: number;
  total_searches: number;
  activeAlerts: number;
}

function SearchAnalyticsContent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const COLORS: Record<string, string> = {
    police: '#06B6D4',
    hospital: '#F87171',
    fire: '#FBBF24',
    fire_station: '#FBBF24',
    emergency: '#E11D48'
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    // ✅ Use access_token as prioritized by your backend verify_otp route
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Handle common API issues
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Admin privileges required.')
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned an invalid response format.");
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
      setError('') 
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  // ✅ Data Formatting for Charts
  const serviceChartData = analytics?.service_breakdown 
    ? Object.entries(analytics.service_breakdown).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
        originalName: name.toLowerCase(),
        value: value
      }))
    : []

  const dailyChartData = analytics?.daily_searches_last_30_days
    ? Object.entries(analytics.daily_searches_last_30_days)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, count]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          searches: count
        }))
    : []

  const topService = analytics?.service_breakdown 
    ? Object.entries(analytics.service_breakdown).sort(([, a], [, b]) => b - a)[0]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/main/dashboard">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50 p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Search Analytics</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchAnalytics}
            disabled={loading}
            className="text-slate-400 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {error && (
            <Card className="border-red-500/50 bg-red-500/10">
              <CardContent className="pt-6 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-medium">Authentication Error</p>
                  <p className="text-red-300/80 text-sm">{error}</p>
                  <Button variant="link" className="text-red-400 p-0 h-auto mt-2" onClick={() => window.location.href = '/auth/login'}>
                    Back to login
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading && !analytics ? (
            <div className="text-center py-20">
              <Loader className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400 animate-pulse">Fetching latest search metrics...</p>
            </div>
          ) : analytics && (
            <>
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-800/40 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-slate-400">Lifetime Searches</CardDescription>
                    <CardTitle className="text-2xl text-white">{analytics.total_searches}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-slate-800/40 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-slate-400">Registered Users</CardDescription>
                    <CardTitle className="text-2xl text-white">{analytics.total_users}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-slate-800/40 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-slate-400">Peak Demand</CardDescription>
                    <CardTitle className="text-2xl text-white capitalize">{topService ? topService[0].replace('_', ' ') : 'N/A'}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-slate-800/40 border-slate-700 border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-slate-400">Security Alerts</CardDescription>
                    <CardTitle className="text-2xl text-white">{analytics.activeAlerts}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/40 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-200">Daily Volume (30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{fill: '#334155'}}
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} 
                        />
                        <Bar dataKey="searches" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/40 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-200">Service Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={serviceChartData} 
                          cx="50%" cy="50%" 
                          innerRadius={70} 
                          outerRadius={100} 
                          paddingAngle={8} 
                          dataKey="value"
                          stroke="none"
                        >
                          {serviceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.originalName] || '#6366f1'} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchAnalyticsPage() {
  return (
    <AdminAuthGuard>
      <SearchAnalyticsContent />
    </AdminAuthGuard>
  )
}