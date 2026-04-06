// // frontend/src/app/admin/manage-admins/page.tsx
// 'use client'

// import { useState } from 'react'
// import { AdminAuthGuard } from '@/components/AdminAuthGuard'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
// import { Loader, UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
// import Link from 'next/link'

// export default function ManageAdminsPage() {
//   const [email, setEmail] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

//   const handleInvite = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setStatus(null)

//     const token = localStorage.getItem('access_token') || localStorage.getItem('token')

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/invite-admin`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email })
//       })

//       const data = await res.json()

//       if (!res.ok) throw new Error(data.error || 'Failed to invite admin')

//       setStatus({ type: 'success', msg: data.message })
//       setEmail('')
//     } catch (err: any) {
//       setStatus({ type: 'error', msg: err.message })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <AdminAuthGuard>
//       <div className="min-h-screen bg-slate-900 p-8 text-white">
//         <div className="max-w-2xl mx-auto">
//           <Link href="/main/dashboard" className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
//             <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
//           </Link>

//           <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="text-2xl flex items-center gap-2 text-white">
//                 <UserPlus className="h-6 w-6 text-blue-500" />
//                 Add New Administrator
//               </CardTitle>
//               <CardDescription className="text-slate-400">
//                 Enter the email of an existing user to grant them admin privileges. They will receive an email notification.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleInvite} className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-300">User Email Address</label>
//                   <Input 
//                     type="email" 
//                     placeholder="example@safeguard.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="bg-slate-900 border-slate-700 text-white focus:ring-blue-500"
//                   />
//                 </div>

//                 {status && (
//                   <div className={`p-4 rounded-lg flex items-center gap-3 ${
//                     status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
//                   }`}>
//                     {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
//                     <p className="text-sm">{status.msg}</p>
//                   </div>
//                 )}

//                 <Button 
//                   type="submit" 
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
//                   disabled={loading}
//                 >
//                   {loading ? <Loader className="h-5 w-5 animate-spin" /> : 'Grant Admin Access'}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </AdminAuthGuard>
//   )
// }



// frontend/src/app/admin/manage-admins/page.tsx
'use client'

import { useState } from 'react'
import { AdminAuthGuard } from '@/components/AdminAuthGuard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Loader, UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ManageAdminsPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    // Ensure we pick up whichever token key your app is currently using
    const token = localStorage.getItem('token') || localStorage.getItem('access_token')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/invite-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to invite admin')

      setStatus({ 
        type: 'success', 
        msg: `Success! ${email} has been promoted and notified with a login link.` 
      })
      setEmail('')
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-900 p-8 text-white">
        <div className="max-w-2xl mx-auto">
          {/* Changed link to /admin/dashboard to stay in admin context */}
          <Link href="/admin/dashboard" className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Panel
          </Link>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-white">
                <UserPlus className="h-6 w-6 text-blue-500" />
                Invite Administrator
              </CardTitle>
              <CardDescription className="text-slate-400">
                Type the email of a registered user. They will be granted full access to the analytics and user management tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Registered Email</label>
                  <Input 
                    type="email" 
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 h-12"
                  />
                </div>

                {status && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                    status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {status.type === 'success' ? <CheckCircle2 className="h-5 w-5 mt-0.5" /> : <AlertCircle className="h-5 w-5 mt-0.5" />}
                    <p className="text-sm">{status.msg}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 transition-all"
                  disabled={loading}
                >
                  {loading ? <Loader className="h-5 w-5 animate-spin" /> : 'Confirm & Send Invitation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAuthGuard>
  )
}