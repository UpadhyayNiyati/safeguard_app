

// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import './globals.css'
// import Navbar from '@/components/navbar'
// import Footer from '@/components/footer'

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: 'SafeGuard - Emergency Safety App',
//   description: 'Access emergency services, locate nearby hospitals, police stations, and fire departments instantly. Keep your loved ones safe with our comprehensive emergency response platform.',
//   generator: 'v0.app',
//   viewport: {
//     width: 'device-width',
//     initialScale: 1,
//     maximumScale: 1,
//     userScalable: true,
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className="font-sans antialiased bg-background text-foreground">
//         <Navbar />
//         {children}
//         <Footer />
//         <Analytics />
//       </body>
//     </html>
//   )
// }


// app/layout.tsx
// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import Navbar from '@/components/navbar'
// import Footer from '@/components/footer'
// import './globals.css'

// const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
// const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// export const metadata: Metadata = {
//   title: 'SafeGuard - Emergency Safety App',
//   description: 'Access emergency services, locate nearby hospitals...',
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       {/* Added the font variables to the body */}
//       <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
//         {children} {/* No Navbar or Footer here! */}
//         <Analytics />
//       </body>
//     </html>
//   )
// }

// import "./globals.css";
// import { Inter } from "next/font/google";
// import  Navbar  from "@/components/navbar";
// import  Footer  from "@/components/footer";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "SafeGuard App",
//   description: "Next.js 14+ Route Group Structure",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} flex flex-col min-h-screen`}>
        
//         {/* Navbar */}
//         <Navbar />

//         {/* Main Content */}
//         <main className="flex-grow">
//           {children}
//         </main>

//         {/* Footer */}
//         <Footer />

//       </body>
//     </html>
//   );
// }


"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
// import "./globals.css"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] });

// Note: In Next.js, you cannot export 'metadata' from a Client Component.
// If you need SEO metadata, move this layout logic to a sub-layout 
// or keep this as is if SEO isn't a priority for this specific file.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if the current route starts with /auth (e.g., /auth/login, /auth/register)
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        
        {/* Only show Navbar if NOT an auth page */}
        {!isAuthPage && <Navbar />}

        {/* Main Content - flex-grow ensures footer stays at bottom */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Only show Footer if NOT an auth page */}
        {!isAuthPage && <Footer />}
        
      </body>
    </html>
  );
}