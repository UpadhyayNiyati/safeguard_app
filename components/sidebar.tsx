// // components/sidebar.tsx
// 'use client'

// export default function Sidebar() {
//   return (
//     <div className="w-64 bg-white shadow-md h-screen p-4">
//       <h2 className="text-xl font-bold mb-6">Dashboard</h2>

//       <ul className="space-y-3">
//         <li><a href="/dashboard" className="block">Home</a></li>
//         <li><a href="/dashboard_2/search-report" className="block">Search Report</a></li>
//         {/* <li><a href="/dashboard_2/emergency-contacts" className="block">Contacts</a></li> */}
//         <li><a href="/dashboard_2/admin-history" className="block">Admin History</a></li>
//       </ul>
//     </div>
//   )
// }

'use client'
import Link from 'next/link' // Add this

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md h-screen p-4 border-r">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-3">
        <li>
          <Link href="/main/dashboard" className="block p-2 hover:bg-gray-100 rounded">Home</Link>
        </li>
        {/* <li>
          <Link href="/admin/search-report" className="block p-2 hover:bg-gray-100 rounded">Search Report</Link>
        </li>
        <li>
          <Link href="/admin/admin-history" className="block p-2 hover:bg-gray-100 rounded">Admin History</Link>
        </li> */}
        <li>
          <Link href="/admin/search-analytics" className="block p-2 hover:bg-gray-100 rounded">Search Analytics</Link>
        </li>
        <li>
          <Link href="/admin/users" className="block p-2 hover:bg-gray-100 rounded">User Management</Link>
        </li>
        <li>
          <Link href="/admin/manage-admins" className="block p-2 hover:bg-gray-100 rounded">Manage Admins</Link>
        </li>
      </ul>
    </div>
  )
}