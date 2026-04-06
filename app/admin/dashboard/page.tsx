// import { Users, Search, AlertCircle, TrendingUp } from 'lucide-react';

// export default function AdminDashboard() {
//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold">Admin Overview</h1>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="p-4 bg-white rounded-xl border shadow-sm">
//           <div className="flex justify-between items-start text-muted-foreground">
//             <span className="text-sm font-medium">Total Users</span>
//             <Users size={18} className="text-blue-500" />
//           </div>
//           <div className="text-2xl font-bold mt-2">1,284</div>
//         </div>
        
//         <div className="p-4 bg-white rounded-xl border shadow-sm">
//           <div className="flex justify-between items-start text-muted-foreground">
//             <span className="text-sm font-medium">SOS Alerts</span>
//             <AlertCircle size={18} className="text-red-500" />
//           </div>
//           <div className="text-2xl font-bold mt-2">12</div>
//         </div>
        
//         <div className="p-4 bg-white rounded-xl border shadow-sm">
//           <div className="flex justify-between items-start text-muted-foreground">
//             <span className="text-sm font-medium">Searches Today</span>
//             <Search size={18} className="text-green-500" />
//           </div>
//           <div className="text-2xl font-bold mt-2">450</div>
//         </div>

//         <div className="p-4 bg-white rounded-xl border shadow-sm">
//           <div className="flex justify-between items-start text-muted-foreground">
//             <span className="text-sm font-medium">Active Status</span>
//             <TrendingUp size={18} className="text-purple-500" />
//           </div>
//           <div className="text-2xl font-bold mt-2">Healthy</div>
//         </div>
//       </div>

//       {/* Placeholder for a Graph or Table */}
//       <div className="h-96 w-full bg-muted/30 rounded-2xl border-2 border-dashed flex items-center justify-center">
//         <p className="text-muted-foreground italic">User Search Analytics Graph Goes Here</p>
//       </div>
//     </div>
//   );
// }














// 'use client';
// import { Users, AlertTriangle, Map, Activity } from 'lucide-react';

// export default function AdminDashboard() {
//   const stats = [
//     { label: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-500' },
//     { label: 'Active Alerts', value: '12', icon: AlertTriangle, color: 'text-red-500' },
//     { label: 'Searches Today', value: '458', icon: Map, iconColor: 'text-green-500' },
//     { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-primary' },
//   ];

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">Platform Analytics</h1>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//         {stats.map((stat, i) => (
//           <div key={i} className="p-6 bg-card rounded-xl border border-border shadow-sm">
//             <stat.icon className={`mb-4 ${stat.color}`} size={28} />
//             <p className="text-muted-foreground text-sm">{stat.label}</p>
//             <p className="text-2xl font-bold">{stat.value}</p>
//           </div>
//         ))}
//       </div>
//       <div className="bg-card rounded-xl border border-border p-6 h-64 flex items-center justify-center text-muted-foreground">
//         [ Chart Placeholder: Alert Frequency Over Time ]
//       </div>
//     </div>
//   );
// }















// 'use client';

// import { Users, AlertTriangle, Map, Activity } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from 'recharts';

// export default function AdminDashboard() {
//   // State for dynamic chart data
//   const [data, setData] = useState([
//     { name: 'Police', searches: 0 },
//     { name: 'Hospitals', searches: 0 },
//     { name: 'Fire Stations', searches: 0 },
//   ]);

//   // Simulated API call to fetch analytics
//   useEffect(() => {
//     const fetchData = async () => {
//       // Logic for future API integration:
//       // const res = await fetch("/api/dashboard");
//       // const result = await res.json();

//       const result = {
//         police: 120,
//         hospitals: 200,
//         fire: 80,
//       };

//       setData([
//         { name: 'Police', searches: result.police },
//         { name: 'Hospitals', searches: result.hospitals },
//         { name: 'Fire Stations', searches: result.fire },
//       ]);
//     };

//     fetchData();
//   }, []);

//   const stats = [
//     { label: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-500' },
//     { label: 'Active Alerts', value: '12', icon: AlertTriangle, color: 'text-red-500' },
//     { label: 'Searches Today', value: '458', icon: Map, color: 'text-green-500' },
//     { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-primary' },
//   ];

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">Platform Analytics</h1>

//       {/* 🔷 STATS CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//         {stats.map((stat, i) => (
//           <div
//             key={i}
//             className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition"
//           >
//             <stat.icon className={`mb-4 ${stat.color}`} size={28} />
//             <p className="text-muted-foreground text-sm">{stat.label}</p>
//             <p className="text-2xl font-bold">{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* 📊 CHART SECTION */}
//       <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
//         <h2 className="text-xl font-semibold mb-6">
//           Emergency Services Search Analytics
//         </h2>
        
//         <div className="h-64 w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
//               <XAxis 
//                 dataKey="name" 
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
//               />
//               <YAxis 
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
//               />
//               <Tooltip 
//                 cursor={{ fill: 'transparent' }}
//                 contentStyle={{ 
//                   backgroundColor: 'hsl(var(--card))', 
//                   borderRadius: '8px', 
//                   border: '1px solid hsl(var(--border))' 
//                 }}
//               />
//               <Bar 
//                 dataKey="searches" 
//                 fill="hsl(var(--primary))" 
//                 radius={[6, 6, 0, 0]} 
//                 barSize={60}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }
















'use client';

import { Users, AlertTriangle, Map, Activity, Loader2, RefreshCw, Globe } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface ChartDataItem { name: string; value: number; }
interface AnalyticsState { 
  total_users: number; 
  total_searches: number; 
  service_breakdown: Record<string, number>; 
  location_breakdown: { location: string; count: number }[];
  activeAlerts: number; 
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsState>({ 
    total_users: 0, 
    total_searches: 0, 
    service_breakdown: {}, 
    location_breakdown: [],
    activeAlerts: 0 
  });
  
  const [view, setView] = useState<'service' | 'location'>('service');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const fetchRealTimeData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setIsRefreshing(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      if (!token) throw new Error("No authorization token found");

      const response = await fetch(`${API_URL}/api/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error(`Analytics Fetch Failed: ${response.status}`);
      const result = await response.json();
      console.log("BACKEND DATA:", result); // <-- ADD THIS


      setAnalytics({ 
        total_users: result.total_users || 0, 
        total_searches: result.total_searches || 0, 
        service_breakdown: result.service_breakdown || {},
        location_breakdown: result.location_breakdown || [],
        activeAlerts: result.activeAlerts || 0 
      });

      updateChart(view, result);

    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [view]);

  // const updateChart = (currentView: 'service' | 'location', data: any) => {
  //   if (currentView === 'service') {
  //     const formatted = Object.entries(data.service_breakdown || {}).map(([name, count]) => ({
  //       name: name.charAt(0).toUpperCase() + name.slice(1),
  //       value: Number(count) || 0,
  //     }));
  //     setChartData(formatted);
  //   } else {
  //     const formatted = (data.location_breakdown || []).map((item: any) => ({
  //       name: item.location.length > 15 ? item.location.substring(0, 12) + "..." : item.location,
  //       value: item.count,
  //     }));
  //     setChartData(formatted);
  //   }
  // };

//   const updateChart = (currentView: 'service' | 'location', data: any) => {
//   if (currentView === 'service') {
//     const rawServices = data.service_breakdown || {};
//     const mergedData: Record<string, number> = {};

//     Object.entries(rawServices).forEach(([name, count]) => {
//       // Normalize name: lowercase and handle 'fire_station'
//       // let normalizedName = name.toLowerCase();

//       let normalizedName = name.toLowerCase().replace('_', ' ');
//       // if (normalizedName === 'fire_station' || normalizedName === 'fire') {
//       //   normalizedName = 'Fire';
//       // } else {
//       //   // Capitalize others
//       //   normalizedName = normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
//       // }
//       if (normalizedName.includes('fire')) {
//     normalizedName = 'Fire';
// } else {
//     normalizedName = normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
// }

//       // Add to existing value or create new
//       mergedData[normalizedName] = (mergedData[normalizedName] || 0) + (Number(count) || 0);
//     });

//     const formatted = Object.entries(mergedData).map(([name, value]) => ({
//       name,
//       value,
//     }));
    
//     setChartData(formatted);
//   } else {
//     // Location Logic: Ensure item.location exists
//   //   const formatted = (data.location_breakdown || []).map((item: any) => ({
//   //     // Fallback to 'Unknown' if location is missing to prevent empty names
//   //     name: (item.location || 'Unknown').length > 15 
//   //       ? (item.location || 'Unknown').substring(0, 12) + "..." 
//   //       : (item.location || 'Unknown'),
//   //     value: Number(item.count) || 0,
//   //   }));
//   //   setChartData(formatted);
//   // }
//   const formatted = (data.location_breakdown || []).map((item: any) => {
//     const rawName = item.location || item._id || item.name || 'Unknown';
    
//     return {
//       name: rawName.length > 15 
//         ? rawName.substring(0, 12) + "..." 
//         : rawName,
//       value: Number(item.count || item.total || 0), // Handle different count keys
//     };
//   });
  
//   console.log("Final Chart Data (Location):", formatted);
//   setChartData(formatted);
// }
// };
const updateChart = (currentView: 'service' | 'location', data: any) => {
    if (currentView === 'service') {
      const rawServices = data.service_breakdown || {};
      const mergedData: Record<string, number> = {};

      Object.entries(rawServices).forEach(([name, count]) => {
        let normalizedName = name.toLowerCase().replace('_', ' ');
        
        if (normalizedName.includes('fire')) {
          normalizedName = 'Fire';
        } else {
          normalizedName = normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
        }

        mergedData[normalizedName] = (mergedData[normalizedName] || 0) + (Number(count) || 0);
      });

      const formatted = Object.entries(mergedData).map(([name, value]) => ({
        name,
        value,
      }));

      setChartData(formatted);
    } else {
      // APPLY THE NEW LOGIC HERE
      const rawLocations = data.location_breakdown || [];

      const formatted = rawLocations.map((item: any) => {
        // Use the location key or fallbacks for robustness
        const rawName = item.location || item._id || item.name || 'Unknown';

        return {
          name: rawName.length > 15 
            ? rawName.substring(0, 12) + "..." 
            : rawName,
          value: Number(item.count || item.total || 0),
        };
      });

      console.log("Final Chart Data (Location):", formatted);
      setChartData(formatted);
    }
  };

  useEffect(() => {
    fetchRealTimeData(true);
    const interval = setInterval(() => fetchRealTimeData(false), 15000);
    return () => clearInterval(interval);
  }, [fetchRealTimeData]);

  // Update chart when toggle changes without full refetch
  // useEffect(() => {
  //   updateChart(view, analytics);
  // }, [view]);
  useEffect(() => {

    updateChart(view, analytics);
}, [view]);

  const stats = [
    { label: 'Total Registered', value: analytics.total_users.toLocaleString(), icon: Users, color: 'text-blue-500' },
    { label: 'Security Searches', value: analytics.total_searches.toLocaleString(), icon: Map, color: 'text-green-500' },
    { label: 'Safety Alerts', value: analytics.activeAlerts.toLocaleString(), icon: AlertTriangle, color: 'text-red-500' },
    { label: 'System Health', value: 'Live', icon: Activity, color: 'text-purple-500' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">SafeGuard Command Center</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time monitoring and emergency analytics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchRealTimeData(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          >
            <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <div className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-600">Server Connected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <stat.icon className={`mb-4 ${stat.color}`} size={28} />
            <p className="text-gray-500 text-sm font-semibold uppercase">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? "..." : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
                {view === 'service' ? 'Emergency Service Trends' : 'Search Activity by Location'}
            </h2>
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                    onClick={() => setView('service')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'service' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                    Services
                </button>
                <button 
                    onClick={() => setView('location')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'location' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                    Locations
                </button>
            </div>
        </div>

        <div className="h-96 w-full">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>Establishing secure connection...</p>
             </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                   cursor={{ fill: '#f3f4f6', radius: 8 }} 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                  {chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
              <Activity size={48} className="mb-2 opacity-10" />
              <p>No activity logs found for current period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}