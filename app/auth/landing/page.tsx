// 'use client'

// import Link from 'next/link'
// import { ShieldCheck, MapPin, Zap, Heart, ArrowRight } from 'lucide-react'
// import { Button } from '@/components/ui/button'

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col min-h-screen bg-white">

//       {/* Navbar */}
//       <nav className="flex justify-between px-8 py-6 border-b">
//         <div className="flex items-center gap-2">
//           <ShieldCheck className="text-indigo-600 w-8 h-8" />
//           <span className="text-2xl font-bold">SafeGuard</span>
//         </div>

//         <div className="flex gap-4">
//           <Link href="/auth/login">
//             <Button variant="ghost">Login</Button>
//           </Link>
//           <Link href="/auth/register">
//             <Button className="bg-indigo-600 text-white">Sign Up</Button>
//           </Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
//         <h1 className="text-5xl font-bold mb-6">
//           Emergency Help <span className="text-indigo-600">Instantly</span>
//         </h1>

//         <Link href="/auth/register">
//           <Button className="bg-indigo-600 text-white px-8 py-4 rounded-full">
//             Get Started <ArrowRight />
//           </Button>
//         </Link>
//       </section>
//     </div>
//   )
// }


















// import Link from 'next/link'
// import { ArrowRight } from 'lucide-react'
// import { Button } from '@/components/ui/button'

// export default function LandingPage() {
//   return (
//     <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
//       <h1 className="text-5xl font-bold mb-6">
//         Emergency Help <span className="text-indigo-600">Instantly</span>
//       </h1>
      
//       {/* Secondary CTA */}
//       <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//         Your safety companion - instant emergency services, nearby hospitals, police stations, and AI-powered assistance.
//       </p>
      
//       <div className="space-y-4">
//         <Link href="/auth/login">
//           <Button className="bg-indigo-600 text-white px-12 py-6 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all">
//             Get Started <ArrowRight className="ml-2" />
//           </Button>
//         </Link>
//         <Link href="/auth/register" className="text-indigo-600 hover:underline text-lg font-medium">
//           Already have an account? Login
//         </Link>
//       </div>
//     </section>
//   )
// }











import Link from 'next/link'
import { ArrowRight, ShieldAlert, MapPin, BrainCircuit, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
        
        {/* Urgent Badge */}
        <div className="mb-6 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide uppercase">
          Reliable 24/7 Assistance
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900">
          Emergency Help <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Instantly.</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate safety companion. Connect with emergency services, locate nearby help, and use AI-powered guidance when seconds count.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/auth/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-7 rounded-2xl text-xl shadow-lg hover:shadow-indigo-200 transition-all duration-300">
              Secure Your Account <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" className="px-10 py-7 rounded-2xl text-xl border-2 hover:bg-gray-50">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <FeatureCard 
            icon={<ShieldAlert className="text-red-500" />}
            title="Panic Response"
            description="One-tap SOS triggers alerts to your emergency contacts and local authorities."
          />
          <FeatureCard 
            icon={<MapPin className="text-blue-500" />}
            title="Smart Locator"
            description="Real-time routing to the nearest hospitals, pharmacies, and police stations."
          />
          <FeatureCard 
            icon={<BrainCircuit className="text-purple-500" />}
            title="AI Medical Guide"
            description="Instant first-aid instructions powered by AI for critical situations."
          />
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-y bg-gray-50/50 py-8">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-12 opacity-50 grayscale">
          <span className="font-bold text-2xl tracking-tighter text-gray-400 italic">911-INTEGRATED</span>
          <span className="font-bold text-2xl tracking-tighter text-gray-400 italic">SECURE-DATA</span>
          <span className="font-bold text-2xl tracking-tighter text-gray-400 italic">GLOBAL-ACCESS</span>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}