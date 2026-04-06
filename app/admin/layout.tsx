// import { Sidebar } from "../../components/admin/Sidebar"; // You'll need to create this

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen bg-slate-950">
//       {/* Sidebar stays fixed on the left */}
//       <Sidebar /> 
      
//       <main className="flex-1 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   );
// }

// import Link from "next/link";

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <aside className="w-64 bg-slate-900 text-white p-6">
//         <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
//         <nav className="flex flex-col space-y-4">
//           <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
//           <Link href="/search-history" className="hover:text-blue-400">Search Logs</Link>
//           <Link href="/" className="pt-10 text-sm text-gray-400">← Back to Site</Link>
//         </nav>
//       </aside>
//       <main className="flex-1 p-10">{children}</main>
//     </div>
//   );
// }


// import Link from 'next/link';
// import { ShieldAlert, LayoutDashboard, History, LogOut } from 'lucide-react';

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-background">
//       <aside className="w-64 border-r border-border bg-card p-6 flex flex-col">
//         <div className="flex items-center gap-2 font-bold mb-10 text-primary">
//           <ShieldAlert /> Admin Panel
//         </div>
//         <nav className="flex-1 space-y-2">
//           <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted font-medium">
//             <LayoutDashboard size={20} /> Dashboard
//           </Link>
//           <Link href="/admin/search-analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted font-medium">
//             <History size={20} /> Search Logs
//           </Link>
//           <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted font-medium">
//             <History size={20} /> User Management
//           </Link>
//         </nav>
//         <Link href="/" className="flex items-center gap-3 p-3 text-destructive font-medium">
//           <LogOut size={20} /> Exit Admin
//         </Link>
//       </aside>
//       <main className="flex-1 p-10">{children}</main>
//     </div>
//   );
// }


'use client'

import Link from 'next/link';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  History, 
  LogOut, 
  Users, 
  UserPlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Function to handle invite (can be connected to a modal or a new route)
  const handleInviteClick = () => {
    // Example: window.location.href = '/admin/invite' 
    // or trigger a state for a popup modal
    console.log("Invite Admin Clicked");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col sticky top-0 h-screen">
        
        {/* Branding/Header */}
        <div className="flex items-center gap-2 font-bold mb-10 text-primary text-lg">
          <ShieldAlert className="text-blue-500" /> 
          <span>Admin Panel</span>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 space-y-2">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted font-medium transition-colors"
          >
            <LayoutDashboard size={20} className="text-slate-400" /> 
            Dashboard
          </Link>

          <Link 
            href="/admin/search-analytics" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted font-medium transition-colors"
          >
            <History size={20} className="text-slate-400" /> 
            Search Logs
          </Link>

          <Link 
            href="/admin/users" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted font-medium transition-colors"
          >
            <Users size={20} className="text-slate-400" /> 
            User Management
          </Link>
        </nav>

        {/* Action Section (Invite & Exit) */}
        <div className="pt-4 border-t border-border space-y-2">
          <Link href="/admin/manage-admins">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 border-dashed border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
            >
              <UserPlus size={18} />
              Invite Admin
            </Button>
          </Link>

          <Link 
            href="/main/dashboard" 
            className="flex items-center gap-3 p-3 text-slate-400 hover:text-destructive font-medium transition-colors mt-2"
          >
            <LogOut size={20} /> 
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950/20">
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}