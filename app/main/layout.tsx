// import Link from "next/link";

// export default function MainLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* <nav className="bg-white border-b p-4 flex justify-between items-center"> */}
//         {/* <Link href="/" className="font-bold text-xl">BrandLogo</Link> */}
//         {/* <div className="space-x-6">
//           <Link href="/about">About</Link>
//           <Link href="/support">Support</Link>
//           <Link href="/emergency-contacts">Emergency</Link>
//           <Link href="/contact">Contact</Link>
//         </div> */}
//       {/* </nav> */}
//       <main className="flex-grow p-8">{children}</main>
//       <footer className="p-4 border-t text-center text-gray-500">
//         © 2026 Your Company
//       </footer>
//     </div>
//   );
// }

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}