// components/dashboard-nav.tsx
'use client'

export default function DashboardNav() {
  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-semibold">SafeGuard</h1>
      <button className="bg-red-500 text-white px-3 py-1 rounded">
        Logout
      </button>
    </div>
  )
}