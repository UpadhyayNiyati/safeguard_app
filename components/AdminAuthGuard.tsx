// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent } from '@/components/ui/card'
// import { Loader, AlertCircle } from 'lucide-react'

// interface AdminAuthGuardProps {
//   children: React.ReactNode
// }

// export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
//   const router = useRouter()
//   const [isAuthorized, setIsAuthorized] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     const checkAdminAccess = async () => {
//       try {
//         // ✅ FIX 1: Check BOTH keys
//         const token =
//           localStorage.getItem('token') ||
//           localStorage.getItem('access_token')

//         if (!token) {
//           setError('No session found')
//           setTimeout(() => router.push('/auth/login'), 1500)
//           return
//         }

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         )

//         if (!response.ok) {
//           localStorage.removeItem('token')
//           localStorage.removeItem('access_token')

//           setError('Session expired. Please login again.')
//           setTimeout(() => router.push('/auth/login'), 1500)
//           return
//         }

//         const data = await response.json()
//         console.log("Auth Guard Data:", data);

//         // ✅ FIX 2: Safe role check
//         if (!data?.user || data.user.role !== 'admin') {
//           setError('Admin access required')
//           setTimeout(() => router.push('/main/dashboard'), 1500)
//           return
//         }

//         // ✅ SUCCESS
//         setIsAuthorized(true)
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : 'Authentication failed'
//         )
//         setTimeout(() => router.push('/auth/login'), 1500)
//       } finally {
//         setLoading(false)
//       }
//     }

//     checkAdminAccess()
//   }, [router])

//   // ✅ Loading UI (unchanged)
//   if (loading && !error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <Loader className="h-12 w-12 text-blue-400 animate-spin mx-auto" />
//           <p className="text-slate-300">Verifying access...</p>
//         </div>
//       </div>
//     )
//   }

//   // ✅ Error UI (unchanged)
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
//         <Card className="w-full max-w-md border-red-500/30 bg-red-500/10">
//           <CardContent className="pt-6">
//             <div className="text-center space-y-4">
//               <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
//               <p className="text-red-400">{error}</p>
//               <p className="text-sm text-slate-400">Redirecting...</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return isAuthorized ? <>{children}</> : null
// }


'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Loader, AlertCircle } from 'lucide-react'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Standardize: Look for 'token' first as per your backend verify_otp response
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');

        if (!token) {
          setError('No active session found. Please login.')
          setTimeout(() => router.push('/auth/login'), 2000)
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          // If 401, token is invalid/expired. Clean up.
          // localStorage.removeItem('token')
          localStorage.removeItem('access_token')
          setError('Session expired. Please login again.')
          setTimeout(() => router.push('/auth/login'), 2000)
          return
        }

        const data = await response.json()

        // Match backend structure: data.user.role
        if (!data?.user || data.user.role !== 'admin') {
          setError('Admin access required.')
          setTimeout(() => router.push('/main/dashboard'), 2000)
          return
        }

        setIsAuthorized(true)
      } catch (err) {
        setError('Authentication service unavailable.')
        setTimeout(() => router.push('/auth/login'), 2000)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  if (loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="h-12 w-12 text-blue-400 animate-spin mx-auto" />
          <p className="text-slate-300 font-medium">Verifying Admin Credentials...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500/30 bg-red-500/10 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
              <p className="text-red-400 font-semibold">{error}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Redirecting...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}