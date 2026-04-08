// // 'use client';

// // import Link from 'next/link';
// // import { useState } from 'react';
// // import { Menu, X, Shield } from 'lucide-react';
// // import { Button } from '@/components/ui/button';

// // export default function Navbar() {
// //   const [isOpen, setIsOpen] = useState(false);

// //   return (
// //     <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex justify-between items-center h-20">
// //           {/* Logo */}
// //           <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
// //             <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg">
// //               <Shield className="w-5 h-5 text-white" />
// //             </div>
// //             <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
// //               SafeGuard
// //             </span>
// //           </Link>

// //           {/* Desktop Navigation */}
// //           <div className="hidden md:flex items-center gap-1">
// //             <Link href="/">
// //               <Button variant="ghost" size="sm">Home</Button>
// //             </Link>
// //             <Link href="/about">
// //               <Button variant="ghost" size="sm">About</Button>
// //             </Link>
// //             <Link href="/emergency-contacts">
// //               <Button variant="ghost" size="sm">Contacts</Button>
// //             </Link>
// //             <Link href="/support">
// //               <Button variant="ghost" size="sm">Support</Button>
// //             </Link>
// //             <Link href="/contact">
// //               <Button variant="ghost" size="sm">Contact Us</Button>
// //             </Link>
// //             <div className="ml-2 border-l border-border pl-2">
// //               <Link href="/emergency-contacts">
// //                 <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white" onClick={() => setIsOpen(false)}>
// //                   Get Started
// //                 </Button>
// //               </Link>
// //             </div>
// //           </div>

// //           {/* Mobile Menu Button */}
// //           <button
// //             className="md:hidden p-2 hover:bg-muted rounded-lg transition"
// //             onClick={() => setIsOpen(!isOpen)}
// //             aria-label="Toggle menu"
// //           >
// //             {isOpen ? <X size={24} /> : <Menu size={24} />}
// //           </button>
// //         </div>

// //         {/* Mobile Navigation */}
// //         {isOpen && (
// //           <div className="md:hidden border-t border-border bg-card/80 backdrop-blur">
// //             <div className="flex flex-col p-4 gap-2">
// //               <Link href="/" onClick={() => setIsOpen(false)}>
// //                 <Button variant="ghost" className="w-full justify-start">Home</Button>
// //               </Link>
// //               <Link href="/about" onClick={() => setIsOpen(false)}>
// //                 <Button variant="ghost" className="w-full justify-start">About</Button>
// //               </Link>
// //               <Link href="/emergency-contacts" onClick={() => setIsOpen(false)}>
// //                 <Button variant="ghost" className="w-full justify-start">Contacts</Button>
// //               </Link>
// //               <Link href="/support" onClick={() => setIsOpen(false)}>
// //                 <Button variant="ghost" className="w-full justify-start">Support</Button>
// //               </Link>
// //               <Link href="/contact" onClick={() => setIsOpen(false)}>
// //                 <Button variant="ghost" className="w-full justify-start">Contact Us</Button>
// //               </Link>
// //               <Link href="/emergency-contacts" onClick={() => setIsOpen(false)}>
// //                 <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
// //                   Get Started
// //                 </Button>
// //               </Link>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // }


// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import { Menu, X, Shield } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   // Hide navbar on landing page
//   if (pathname === '/') {
//     return null;
//   }

//   return (
//     <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
          
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
//             <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg">
//               <Shield className="w-5 h-5 text-white" />
//             </div>
//             <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               SafeGuard
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-1">
//             <Link href="/main/dashboard">
//               <Button variant="ghost" size="sm">Home</Button>
//             </Link>
//             <Link href="/main/about">
//               <Button variant="ghost" size="sm">About</Button>
//             </Link>
//             {/* Added Search Report Link here */}
//             <Link href="/dashboard/history">
//               <Button variant="ghost" size="sm">Search Report</Button>
//             </Link>
//             <Link href="/dashboard_2/emergency-contacts">
//               <Button variant="ghost" size="sm">Contacts</Button>
//             </Link>
//             <Link href="/main/support">
//               <Button variant="ghost" size="sm">Support</Button>
//             </Link>
//             <Link href="/main/contact">
//               <Button variant="ghost" size="sm">Contact Us</Button>
//             </Link>

//             <div className="ml-2 border-l border-border pl-2">
//               <Link href="/emergency-contacts">
//                 <Button
//                   className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Get Started
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2 hover:bg-muted rounded-lg transition"
//             onClick={() => setIsOpen(!isOpen)}
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden border-t border-border bg-card/80 backdrop-blur">
//             <div className="flex flex-col p-4 gap-2">
              
//               <Link href="/" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Home</Button>
//               </Link>

//               <Link href="/about" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">About</Button>
//               </Link>

//               {/* Added Search Report Link for Mobile */}
//               <Link href="/dashboard/history" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Search Report</Button>
//               </Link>

//               <Link href="/emergency-contacts" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Contacts</Button>
//               </Link>

//               <Link href="/support" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Support</Button>
//               </Link>

//               <Link href="/contact" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Contact Us</Button>
//               </Link>

//               <Link href="/emergency-contacts" onClick={() => setIsOpen(false)}>
//                 <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
//                   Get Started
//                 </Button>
//               </Link>

//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

// 'use client';

// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { Menu, X, Shield } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     const stored = localStorage.getItem('auth_user');
//     if (stored) {
//       setUser(JSON.parse(stored));
//     }
//   }, []);

//   // ONLY hide on auth pages now, allowing it on "/"
//   if (pathname.startsWith('/auth')) {
//     return null;
//   }

//   const isAdmin = user?.role === 'admin';

//   const handleLogout = () => {
//     localStorage.clear();
//     router.push('/auth/login');
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
          
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
//             <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg">
//               <Shield className="w-5 h-5 text-white" />
//             </div>
//             <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               SafeGuard
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-1">
//             <Link href="/">
//               <Button variant="ghost" size="sm">Home</Button>
//             </Link>
            
//             {/* Show these only if user is logged in */}
//             {user && (
//               <>
//                 <Link href="/dashboard_2/emergency-contacts">
//                   <Button variant="ghost" size="sm">Contacts</Button>
//                 </Link>
//                 {isAdmin && (
//                   <Link href="/dashboard_2/admin-history">
//                     <Button variant="ghost" size="sm">Search Report</Button>
//                   </Link>
//                 )}
//               </>
//             )}

//             <Link href="/main/about">
//               <Button variant="ghost" size="sm">About</Button>
//             </Link>
//             <Link href="/main/support">
//               <Button variant="ghost" size="sm">Support</Button>
//             </Link>

//             <div className="ml-2 border-l border-border pl-2">
//               {user ? (
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   className="bg-red-500 hover:bg-red-600 text-white"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </Button>
//               ) : (
//                 <Link href="/auth/login">
//                   <Button size="sm">Login</Button>
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2 hover:bg-muted rounded-lg transition"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden border-t border-border bg-background pb-4">
//             <div className="flex flex-col p-4 gap-2">
//               <Link href="/" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Home</Button>
//               </Link>
//               {user ? (
//                 <Button onClick={handleLogout} className="w-full bg-red-500 text-white">Logout</Button>
//               ) : (
//                 <Link href="/auth/login"><Button className="w-full">Login</Button></Link>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }


// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { Menu, X, Shield } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
//             <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg">
//               <Shield className="w-5 h-5 text-white" />
//             </div>
//             <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               SafeGuard
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-1">
//             <Link href="/main/dashboard">
//               <Button variant="ghost" size="sm">Home</Button>
//             </Link>
//             <Link href="/main/about">
//               <Button variant="ghost" size="sm">About</Button>
//             </Link>
//             <Link href="/main/emergency-contacts">
//               <Button variant="ghost" size="sm">Contacts</Button>
//             </Link>
//             <Link href="/main/support">
//               <Button variant="ghost" size="sm">Support</Button>
//             </Link>
//             <Link href="/main/contact">
//               <Button variant="ghost" size="sm">Contact Us</Button>
//             </Link>
//             <Link href="/admin/dashboard">
//               <Button variant="ghost" size="sm">Admin</Button>
//             </Link>

//             <div className="ml-2 border-l border-border pl-2">
//               <Link href="/main/emergency-contacts">
//                 {/* <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white" onClick={() => setIsOpen(false)}>
//                   Get Started
//                 </Button> */}
//                 <Button
//   className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
//   onClick={() => {
//     localStorage.removeItem("token");
//     window.location.href = "/auth/login";
//   }}
// >
//   Logout
// </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2 hover:bg-muted rounded-lg transition"
//             onClick={() => setIsOpen(!isOpen)}
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden border-t border-border bg-card/80 backdrop-blur">
//             <div className="flex flex-col p-4 gap-2">
//               <Link href="/" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Home</Button>
//               </Link>
//               <Link href="/main/about" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">About</Button>
//               </Link>
//               <Link href="/main/emergency-contacts" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Contacts</Button>
//               </Link>
//               <Link href="/main/support" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Support</Button>
//               </Link>
//               <Link href="/main/contact" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Contact Us</Button>
//               </Link>
//               <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Admin</Button>
//               </Link>
//               <Link href="/main/emergency-contacts" onClick={() => setIsOpen(false)}>
//                 <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
//                   Get Started
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }














// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { Menu, X, Shield } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     // 1. Clear all possible auth keys
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("token");
//     localStorage.removeItem("user_name");
//     localStorage.removeItem("user_email");
//     localStorage.removeItem("auth_user");
//     localStorage.removeItem("user");

//     // 2. Redirect to login
//     window.location.href = "/auth/login";
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
//             <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg">
//               <Shield className="w-5 h-5 text-white" />
//             </div>
//             <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               SafeGuard
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-1">
//             <Link href="/main/dashboard">
//               <Button variant="ghost" size="sm">Home</Button>
//             </Link>
//             <Link href="/main/about">
//               <Button variant="ghost" size="sm">About</Button>
//             </Link>
//             <Link href="/main/emergency-contacts">
//               <Button variant="ghost" size="sm">Contacts</Button>
//             </Link>
//             <Link href="/main/support">
//               <Button variant="ghost" size="sm">Support</Button>
//             </Link>
//             <Link href="/main/contact">
//               <Button variant="ghost" size="sm">Contact Us</Button>
//             </Link>
//             <Link href="/admin/dashboard">
//               <Button variant="ghost" size="sm">Admin</Button>
//             </Link>

//             {/* Desktop Logout - Fixed */}
//             <div className="ml-2 border-l border-border pl-2">
//               <Button
//                 className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </Button>
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2 hover:bg-muted rounded-lg transition"
//             onClick={() => setIsOpen(!isOpen)}
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden border-t border-border bg-card/80 backdrop-blur">
//             <div className="flex flex-col p-4 gap-2">
//               <Link href="/" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Home</Button>
//               </Link>
//               <Link href="/main/about" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">About</Button>
//               </Link>
//               <Link href="/main/emergency-contacts" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Contacts</Button>
//               </Link>
//               <Link href="/main/support" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Support</Button>
//               </Link>
//               <Link href="/main/contact" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Contact Us</Button>
//               </Link>
//               <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
//                 <Button variant="ghost" className="w-full justify-start">Admin</Button>
//               </Link>
              
//               {/* Mobile Logout - Fixed */}
//               <div className="pt-2 border-t border-border mt-2">
//                 <Button 
//                   className="w-full bg-gradient-to-r from-primary to-secondary text-white"
//                   onClick={() => {
//                     setIsOpen(false);
//                     handleLogout();
//                   }}
//                 >
//                   Logout
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }




'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Get the user object from localStorage
    const userData = localStorage.getItem("auth_user") || localStorage.getItem("user");
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // 2. Check if the role is 'admin'
        if (user.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");

    // Revoke the token server-side
    if (token) {
      try {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // If backend is unreachable, still clear client-side
      }
    }

    // Clear all auth data from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    window.location.href = "/auth/login";
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
            <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SafeGuard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/main/dashboard">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
            <Link href="/main/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <Link href="/main/emergency-contacts">
              <Button variant="ghost" size="sm">Contacts</Button>
            </Link>
            <Link href="/main/support">
              <Button variant="ghost" size="sm">Support</Button>
            </Link>
            <Link href="/main/contact">
              <Button variant="ghost" size="sm">Contact Us</Button>
            </Link>

            {/* CONDITIONAL ADMIN LINK */}
            {isAdmin && (
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-primary font-semibold">Admin</Button>
              </Link>
            )}

            {/* Desktop Logout */}
            <div className="ml-2 border-l border-border pl-2">
              <Button
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-card/80 backdrop-blur">
            <div className="flex flex-col p-4 gap-2">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Home</Button>
              </Link>
              <Link href="/main/about" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">About</Button>
              </Link>
              <Link href="/main/emergency-contacts" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Contacts</Button>
              </Link>
              <Link href="/main/support" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Support</Button>
              </Link>
              <Link href="/main/contact" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Contact Us</Button>
              </Link>

              {/* CONDITIONAL ADMIN LINK MOBILE */}
              {isAdmin && (
                <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-primary font-semibold">Admin</Button>
                </Link>
              )}
              
              {/* Mobile Logout */}
              <div className="pt-2 border-t border-border mt-2">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}