// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center bg-muted/50">
//       {/* You can add a small "Back to Home" link here if you want */}
//       {children}
//     </div>
//   )
// }


// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     // min-h-screen ensures the background covers the full height
//     // flex and items-center/justify-center keep your login card perfectly centered
//     <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      
//       {/* Optional: Add a "Back to Home" link here if needed */}
      
//       <main className="w-full h-full flex items-center justify-center p-4">
//         {children}
//       </main>
      
//       {/* Optional: Add a footer here if needed */}
      
//     </div>
//   )
// }



// import { ShieldCheck } from 'lucide-react';
// import Link from 'next/link';

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-100 to-indigo-200 flex flex-col">

//       {/* HEADER */}
//       {/* <div className="flex flex-col items-center pt-4 pb-2">
//         <Link href="/" className="flex flex-col items-center hover:opacity-80 transition">
//           <div className="bg-indigo-600 p-3 rounded-2xl shadow-md mb-3">
//             <ShieldCheck className="h-10 w-10 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900">SafeGuard</h1>
//           <p className="text-gray-600 text-sm">Your safety companion</p>
//         </Link>
//       </div> */}

//       {/* MAIN CONTENT */}
//       <main className="flex-grow flex items-start justify-center px-4 pt-4">
//         <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
//           {children}
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="text-center text-gray-500 text-xs pb-2
//   ">
//         &copy; {new Date().getFullYear()} SafeGuard Emergency Systems
//       </footer>
//     </div>
//   );
// }


// import { ShieldCheck } from 'lucide-react';
// import Link from 'next/link';

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     // 'min-h-screen' is great. 
//     // Added 'selection:bg-indigo-200' so highlighted text looks branded.
//     <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-100 to-indigo-200 flex flex-col selection:bg-indigo-200">

//       {/* HEADER (Uncommented and simplified for a clean Auth look) */}
//       <header className="pt-8 pb-4">
//         <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
//           <div className="bg-indigo-600 p-2 rounded-xl shadow-lg mb-2">
//             <ShieldCheck className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SafeGuard</h1>
//         </Link>
//       </header>

//       {/* MAIN CONTENT */}
//       {/* Changed 'items-start' to 'items-center' if you want the login box 
//           perfectly centered vertically on the screen. */}
//       <main className="flex-grow flex items-center justify-center px-4">
//         <div className="w-full max-w-md">
//           {children}
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="py-6 text-center text-gray-500 text-xs">
//         &copy; {new Date().getFullYear()} SafeGuard Emergency Systems
//       </footer>
//     </div>
//   );
// }


// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-container">
      {children} 
      {/* NOTICE: No Navbar or Footer here! */}
    </div>
  );
}