// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Shield, PhoneCall, MapPin } from 'lucide-react';

// export default function HomePage() {
//   return (
//     <div className="space-y-20 pb-20">
//       {/* Hero Section */}
//       <section className="px-4 pt-16 md:pt-24 text-center max-w-4xl mx-auto">
//         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
//           Your Personal <span className="text-primary">Safety Companion</span>
//         </h1>
//         <p className="text-lg text-muted-foreground mb-8">
//           Instant access to emergency services, real-time location sharing, and 
//           verified safety resources at your fingertips.
//         </p>
//         <div className="flex flex-wrap justify-center gap-4">
//           <Link href="/register">
//             <Button size="lg" className="px-8">Get Started Free</Button>
//           </Link>
//           <Link href="/about">
//             <Button variant="outline" size="lg">Learn More</Button>
//           </Link>
//         </div>
//       </section>

//       {/* Quick Features */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
//         <div className="p-6 rounded-2xl border bg-card text-center">
//           <PhoneCall className="w-10 h-10 mx-auto mb-4 text-primary" />
//           <h3 className="font-bold mb-2">Instant SOS</h3>
//           <p className="text-sm text-muted-foreground">Alert emergency contacts with one tap.</p>
//         </div>
//         <div className="p-6 rounded-2xl border bg-card text-center">
//           <MapPin className="w-10 h-10 mx-auto mb-4 text-primary" />
//           <h3 className="font-bold mb-2">Hospital Finder</h3>
//           <p className="text-sm text-muted-foreground">Locate the nearest medical help instantly.</p>
//         </div>
//         <div className="p-6 rounded-2xl border bg-card text-center">
//           <Shield className="w-10 h-10 mx-auto mb-4 text-primary" />
//           <h3 className="font-bold mb-2">Verified Info</h3>
//           <p className="text-sm text-muted-foreground">Access 24/7 verified police and fire data.</p>
//         </div>
//       </section>
//     </div>
//   );
// }


import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, PhoneCall, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Your Personal <span className="text-primary">Safety Companion</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Instant access to emergency services, real-time location sharing, and 
          verified safety resources at your fingertips.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="px-10 h-12">Get Started Free</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="px-10 h-12">Learn More</Button>
          </Link>
        </div>
      </section>

      {/* Quick Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        <FeatureCard 
          icon={<PhoneCall className="w-10 h-10 text-primary" />}
          title="Instant SOS"
          desc="Alert emergency contacts with one tap."
        />
        <FeatureCard 
          icon={<MapPin className="w-10 h-10 text-primary" />}
          title="Hospital Finder"
          desc="Locate the nearest medical help instantly."
        />
        <FeatureCard 
          icon={<Shield className="w-10 h-10 text-primary" />}
          title="Verified Info"
          desc="Access 24/7 verified police and fire data."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl border bg-card hover:shadow-md transition-shadow text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}