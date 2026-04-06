// 'use client'

// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { LayoutDashboard, Users, FileText, LogOut, ShieldCheck } from 'lucide-react'

// const navItems = [
//   { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
//   { name: 'User Management', href: '/admin/users', icon: Users },
//   { name: 'Search Reports', href: '/admin/reports', icon: FileText },
// ]

// export function Sidebar() {
//   const pathname = usePathname()

//   return (
//     <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
//       <div className="p-6 flex items-center gap-3">
//         <ShieldCheck className="h-8 w-8 text-blue-500" />
//         <span className="text-xl font-bold text-white">Admin Panel</span>
//       </div>

//       <nav className="flex-1 px-4 space-y-2">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                 isActive 
//                   ? 'bg-blue-600 text-white' 
//                   : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
//               }`}
//             >
//               <item.icon className="h-5 w-5" />
//               <span className="font-medium">{item.name}</span>
//             </Link>
//           )
//         })}
//       </nav>

//       <div className="p-4 border-t border-slate-800">
//         <button 
//           onClick={() => {/* Add logout logic here */}}
//           className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
//         >
//           <LogOut className="h-5 w-5" />
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </div>
//   )
// }


'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  UserPlus, 
  LogOut, 
  ShieldCheck,
  Search
} from 'lucide-react'

// Updated navigation items to include Analytics and Admin Management
const navItems = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    name: 'User Management', 
    href: '/admin/users', 
    icon: Users 
  },
  { 
    name: 'Search Analytics', 
    href: '/admin/search-analytics', 
    icon: BarChart3 
  },
  { 
    name: 'Manage Admins', 
    href: '/admin/manage-admins', 
    icon: UserPlus 
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Redirect to login page
    router.push('/auth/login')
  }

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-blue-500" />
        <span className="text-xl font-bold text-white">Admin Panel</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group"
        >
          <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}