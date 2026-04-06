// // 'use client'

// // import { useState } from 'react'
// // import { useRouter } from 'next/navigation'
// // import { Button } from '@/components/ui/button'
// // import { Input } from '@/components/ui/input'
// // import { Card } from '@/components/ui/card'
// // import { KeyRound, Loader2, AlertCircle } from 'lucide-react'
// // import { Alert, AlertDescription } from '@/components/ui/alert'

// // export default function VerifyOTPPage() {
// //   const router = useRouter()
// //   const [otp, setOtp] = useState('')
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState('')

// //   const handleVerify = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setLoading(true)
// //     setError('')

// //     try {
// //       // Replace this with your actual verification API call
// //       // const res = await fetch('/api/auth/verify', { method: 'POST', body: JSON.stringify({ otp }) })
      
// //       console.log("Verifying OTP:", otp)
      
// //       // Simulate a successful verification
// //       setTimeout(() => {
// //         router.push('/dashboard')
// //       }, 1500)
      
// //     } catch (err) {
// //       setError("Invalid code. Please try again.")
// //     } finally {
// //       // We don't setLoading(false) here if we are redirecting
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
// //       <div className="w-full max-w-md">
// //         <Card className="border-0 shadow-2xl overflow-hidden">
// //           <div className="p-8 bg-white">
// //             <div className="mb-8 text-center">
// //               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
// //                 <KeyRound className="w-8 h-8 text-blue-600" />
// //               </div>
// //               <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
// //               <p className="text-gray-500">We've sent a 6-digit code to your inbox.</p>
// //             </div>

// //             {error && (
// //               <Alert variant="destructive" className="mb-6">
// //                 <AlertCircle className="h-4 w-4" />
// //                 <AlertDescription>{error}</AlertDescription>
// //               </Alert>
// //             )}

// //             <form onSubmit={handleVerify} className="space-y-6">
// //               <div>
// //                 <Input
// //                   type="text"
// //                   placeholder="0 0 0 0 0 0"
// //                   value={otp}
// //                   onChange={(e) => setOtp(e.target.value)}
// //                   className="text-center text-2xl tracking-[1em] font-bold h-14"
// //                   maxLength={6}
// //                   required
// //                 />
// //               </div>

// //               <Button
// //                 type="submit"
// //                 disabled={loading || otp.length < 4}
// //                 className="w-full bg-indigo-600 hover:bg-indigo-700 h-11"
// //               >
// //                 {loading ? (
// //                   <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
// //                 ) : (
// //                   'Verify Code'
// //                 )}
// //               </Button>
// //             </form>

// //             <button 
// //               onClick={() => router.back()}
// //               className="w-full mt-6 text-sm text-gray-500 hover:text-indigo-600 transition"
// //             >
// //               Back to login
// //             </button>
// //           </div>
// //         </Card>
// //       </div>
// //     </div>
// //   )
// // }
// // 'use client';
// // import AuthLogo from '@/components/AuthLogo';
// // import { useState, useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Card } from '@/components/ui/card';
// // import { KeyRound, Loader2, AlertCircle } from 'lucide-react';
// // import { Alert, AlertDescription } from '@/components/ui/alert';

// // export default function VerifyOTPPage() {
// //   const router = useRouter();

// //   const [otp, setOtp] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   // ✅ Load email from localStorage
// //   useEffect(() => {
// //     const storedEmail = localStorage.getItem('temp_login_email');

// //     if (!storedEmail) {
// //       setError('Session expired. Please login again.');
// //       return;
// //     }

// //     setEmail(storedEmail);
// //   }, []);

// //   const handleVerify = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!otp || otp.length < 4) {
// //       setError('Enter valid OTP');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ email, otp }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || 'Invalid OTP');
// //       }

// //       // ✅ Save auth data
// //       localStorage.setItem('auth_token', data.token);
// //       localStorage.setItem('auth_user', JSON.stringify(data.user));

// //       // ✅ Cleanup
// //       localStorage.removeItem('temp_login_email');

// //       router.push('/dashboard');

// //     } catch (err: any) {
// //       setError(err.message || 'Verification failed');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
// //       <div className="w-full max-w-md">

// //         <Card className="p-6 bg-white">
// //           {/* <div className="text-center mb-6">
// //             <KeyRound className="mx-auto h-10 w-10 text-blue-600" />
// //             <h2 className="text-xl font-bold mt-2">Verify OTP</h2>
// //             <p className="text-sm text-gray-500">{email}</p>
// //           </div> */}

// //           {error && (
// //             <Alert variant="destructive" className="mb-4">
// //               <AlertCircle className="h-4 w-4" />
// //               <AlertDescription>{error}</AlertDescription>
// //             </Alert>
// //           )}

// //           <form onSubmit={handleVerify} className="space-y-4">
// //             <Input
// //               type="text"
// //               placeholder="Enter OTP"
// //               value={otp}
// //               onChange={(e) => setOtp(e.target.value)}
// //               maxLength={6}
// //               className="text-center text-lg"
// //             />

// //             <Button className="w-full" disabled={loading}>
// //               {loading ? <Loader2 className="animate-spin" /> : 'Verify'}
// //             </Button>
// //           </form>

// //           <button
// //             onClick={() => router.push('/login')}
// //             className="mt-4 text-sm text-gray-500 w-full"
// //           >
// //             Back to login
// //           </button>

// //         </Card>
// //       </div>
// //     </div>
// //   );
// // }


// 'use client';

// import AuthLogo from '@/components/AuthLogo';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import { Loader2, AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// export default function VerifyOTPPage() {
//   const router = useRouter();

//   const [otp, setOtp] = useState('');
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ✅ Load email from localStorage
//   useEffect(() => {
//     const storedEmail = localStorage.getItem('temp_login_email');

//     if (!storedEmail) {
//       setError('Session expired. Please login again.');
//       return;
//     }

//     setEmail(storedEmail);
//   }, []);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!otp || otp.length < 4) {
//       setError('Enter valid OTP');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Invalid OTP');
//       }

//       // ✅ Save auth data
//       localStorage.setItem('auth_token', data.token);
//       localStorage.setItem('auth_user', JSON.stringify(data.user));

//       // ✅ Cleanup
//       localStorage.removeItem('temp_login_email');

//       router.push('/main/dashboard');

//     } catch (err: any) {
//       setError(err.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
//       <div className="w-full max-w-md">

//         {/* ✅ LOGO */}
//         <AuthLogo />

//         {/* ✅ CARD */}
//         <Card className="p-6 bg-white border-indigo-200 shadow-xl shadow-indigo-100/50">

//           {/* ✅ HEADER */}
//           <div className="text-center mb-6">
//             <h2 className="text-xl font-bold">Verify OTP</h2>
//             <p className="text-sm text-muted-foreground">{email}</p>
//           </div>

//           {/* ✅ ERROR */}
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* ✅ FORM */}
//           <form onSubmit={handleVerify} className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="text-center text-lg border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
//             />

//             <Button 
//               className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
//               disabled={loading}
//             >
//               {loading ? <Loader2 className="animate-spin" /> : 'Verify'}
//             </Button>
//           </form>

//           {/* ✅ BACK BUTTON */}
//           <button
//             onClick={() => router.push('/auth/login')}
//             className="mt-4 text-sm text-muted-foreground w-full hover:text-indigo-600 transition"
//           >
//             Back to login
//           </button>

//         </Card>
//       </div>
//     </main>
//   );
// }





// 'use client';

// import AuthLogo from '@/components/AuthLogo';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import { Loader2, AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// export default function VerifyOTPPage() {
//   const router = useRouter();

//   const [otp, setOtp] = useState('');
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ✅ Load email from localStorage
//   useEffect(() => {
//     const storedEmail = localStorage.getItem('temp_login_email');

//     if (!storedEmail) {
//       setError('Session expired. Please login again.');
//       return;
//     }

//     setEmail(storedEmail);
//   }, []);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!otp || otp.length < 4) {
//       setError('Enter valid OTP');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Invalid OTP');
//       }

//       // ✅ AFTER OTP SUCCESS (YOUR REQUIRED LOGIC)
//       localStorage.setItem('auth_token', data.token);   // Store token
//       localStorage.setItem('auth_user', JSON.stringify(data.user)); // optional (keep if needed)

//       localStorage.removeItem('temp_login_email');      // Cleanup

//       // ✅ REDIRECT (guard will handle further routing)
//       router.push('/main/dashboard');

//     } catch (err: any) {
//       setError(err.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
//       <div className="w-full max-w-md">

//         {/* ✅ LOGO */}
//         <AuthLogo />

//         {/* ✅ CARD */}
//         <Card className="p-6 bg-white border-indigo-200 shadow-xl shadow-indigo-100/50">

//           {/* ✅ HEADER */}
//           <div className="text-center mb-6">
//             <h2 className="text-xl font-bold">Verify OTP</h2>
//             <p className="text-sm text-muted-foreground">{email}</p>
//           </div>

//           {/* ✅ ERROR */}
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* ✅ FORM */}
//           <form onSubmit={handleVerify} className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="text-center text-lg border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
//             />

//             <Button 
//               type="submit"
//               className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 'Verify'
//               )}
//             </Button>
//           </form>

//           {/* ✅ BACK BUTTON */}
//           <button
//             onClick={() => router.push('/auth/login')}
//             className="mt-4 text-sm text-muted-foreground w-full hover:text-indigo-600 transition"
//           >
//             Back to login
//           </button>

//         </Card>
//       </div>
//     </main>
//   );
// }

















// 'use client';

// import AuthLogo from '@/components/AuthLogo';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import { Loader2, AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// export default function VerifyOTPPage() {
//   const router = useRouter();

//   const [otp, setOtp] = useState('');
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ✅ Load email from localStorage
//   useEffect(() => {
//     const storedEmail = localStorage.getItem('temp_login_email');

//     if (!storedEmail) {
//       setError('Session expired. Please login again.');
//       return;
//     }

//     setEmail(storedEmail);
//   }, []);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!otp || otp.length < 4) {
//       setError('Enter valid OTP');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || data.message || 'Invalid OTP');
//       }

//       // 1. Log the data to your browser console to see what the backend is actually sending
//       console.log("Backend Response:", data);

//       // 2. Map the token correctly (check if it's data.token or data.access_token)
//       const tokenToStore = data.token || data.access_token;

//       if (tokenToStore) {
//         // 3. Save to LocalStorage
//         localStorage.setItem('auth_token', tokenToStore);
//         if (data.user) {
//           localStorage.setItem('auth_user', JSON.stringify(data.user));
//         }
//         localStorage.removeItem('temp_login_email');

//         // 4. Force a tiny wait to ensure LocalStorage is written before redirect
//         setTimeout(() => {
//           router.push('/main/dashboard');
//         }, 100);
//       } else {
//         setError("Login succeeded but no token was found in the response.");
//       }

//     } catch (err: any) {
//       setError(err.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
//       <div className="w-full max-w-md">

//         {/* ✅ LOGO */}
//         <AuthLogo />

//         {/* ✅ CARD */}
//         <Card className="p-6 bg-white border-indigo-200 shadow-xl shadow-indigo-100/50">

//           {/* ✅ HEADER */}
//           <div className="text-center mb-6">
//             <h2 className="text-xl font-bold">Verify OTP</h2>
//             <p className="text-sm text-muted-foreground">{email}</p>
//           </div>

//           {/* ✅ ERROR */}
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* ✅ FORM */}
//           <form onSubmit={handleVerify} className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="text-center text-lg border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
//             />

//             <Button 
//               type="submit"
//               className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 'Verify'
//               )}
//             </Button>
//           </form>

//           {/* ✅ BACK BUTTON */}
//           <button
//             onClick={() => router.push('/auth/login')}
//             className="mt-4 text-sm text-muted-foreground w-full hover:text-indigo-600 transition"
//           >
//             Back to login
//           </button>

//         </Card>
//       </div>
//     </main>
//   );
// }











// 'use client';

// import AuthLogo from '@/components/AuthLogo';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import { Loader2, AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// export default function VerifyOTPPage() {
//   const router = useRouter();

//   const [otp, setOtp] = useState('');
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ✅ Load email from localStorage
//   useEffect(() => {
//     const storedEmail = localStorage.getItem('temp_login_email');

//     if (!storedEmail) {
//       setError('Session expired. Please login again.');
//       return;
//     }

//     setEmail(storedEmail);
//   }, []);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!otp || otp.length < 4) {
//       setError('Enter valid OTP');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || data.message || 'Invalid OTP');
//       }

//       // Look for 'token' based on your screenshot
//       const tokenToStore = data.token;

//       if (tokenToStore) {
//         // ✅ 1. Clear any existing messy data
//         localStorage.clear(); 

//         // ✅ 2. Save new data
//         localStorage.setItem('auth_token', tokenToStore);
//         if (data.user) {
//           localStorage.setItem('auth_user', JSON.stringify(data.user));
//         }

//         // ✅ 3. DEBUG: Check immediately if it's there
//         const verifyStorage = localStorage.getItem('auth_token');
//         console.log("LocalStorage Check after write:", verifyStorage);

//         if (!verifyStorage) {
//             throw new Error("Browser failed to write to LocalStorage.");
//         }

//         // ✅ 4. Use window.location instead of router.push for a "harder" navigation
//         // This ensures the page fully reloads and grabs the new storage.
//         localStorage.removeItem('temp_login_email');
//         window.location.href = '/main/dashboard';
        
//       } else {
//         setError("Token was missing from the server response object.");
//       }

//     } catch (err: any) {
//       console.error("Storage Error:", err);
//       setError(err.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
//       <div className="w-full max-w-md">

//         {/* ✅ LOGO */}
//         <AuthLogo />

//         {/* ✅ CARD */}
//         <Card className="p-6 bg-white border-indigo-200 shadow-xl shadow-indigo-100/50">

//           {/* ✅ HEADER */}
//           <div className="text-center mb-6">
//             <h2 className="text-xl font-bold">Verify OTP</h2>
//             <p className="text-sm text-muted-foreground">{email}</p>
//           </div>

//           {/* ✅ ERROR */}
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* ✅ FORM */}
//           <form onSubmit={handleVerify} className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="text-center text-lg border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
//             />

//             <Button 
//               type="submit"
//               className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 'Verify'
//               )}
//             </Button>
//           </form>

//           {/* ✅ BACK BUTTON */}
//           <button
//             onClick={() => router.push('/auth/login')}
//             className="mt-4 text-sm text-muted-foreground w-full hover:text-indigo-600 transition"
//           >
//             Back to login
//           </button>

//         </Card>
//       </div>
//     </main>
//   );
// }










// 'use client';

// import AuthLogo from '@/components/AuthLogo';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import { Loader2, AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// export default function VerifyOTPPage() {
//   const router = useRouter();

//   const [otp, setOtp] = useState('');
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const storedEmail = localStorage.getItem('temp_login_email');
//     if (!storedEmail) {
//       setError('Session expired. Please login again.');
//       return;
//     }
//     setEmail(storedEmail);
//   }, []);

//   const handleVerify = async (e: React.FormEvent) => {
//     // Prevent natural form submission immediately
//     e.preventDefault();
//     console.log("Submit clicked. OTP:", otp, "Email:", email);

//     if (!otp || otp.length < 4) {
//       setError('Enter valid OTP');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       console.log("Attempting fetch to backend...");
//       const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp }),
//       });

//       console.log("Fetch finished. Status:", res.status);
//       const data = await res.json();
//       console.log("Data received:", data);

//       if (!res.ok) {
//         throw new Error(data.error || data.message || 'Invalid OTP');
//       }

//       // Check if 'token' exists (based on your previous screenshot)
//       const tokenToStore = data.token || data.access_token;

//       if (tokenToStore) {
//         console.log("Token found. Writing to LocalStorage...");
        
//         // Use multiple keys to ensure the Dashboard can find it
//         localStorage.setItem('auth_token', tokenToStore);
//         localStorage.setItem('token', tokenToStore);

//         if (data.user) {
//           localStorage.setItem('auth_user', JSON.stringify(data.user));
//           localStorage.setItem('user', JSON.stringify(data.user));
//         }



//         // Verify the write worked
//         const verify = localStorage.getItem('auth_token');
//         console.log("Verified LocalStorage:", verify ? "SUCCESS" : "FAILED");

//         localStorage.removeItem('temp_login_email');

//         // Navigate
//         console.log("Redirecting to dashboard...");
//         router.push('/main/dashboard');
//       } else {
//         throw new Error("No token returned from server.");
//       }

//     } catch (err: any) {
//       console.error("CRITICAL ERROR:", err);
//       setError(err.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
//       <div className="w-full max-w-md">
//         <AuthLogo />

//         <Card className="p-6 bg-white border-indigo-200 shadow-xl shadow-indigo-100/50">
//           <div className="text-center mb-6">
//             <h2 className="text-xl font-bold">Verify OTP</h2>
//             <p className="text-sm text-muted-foreground">{email}</p>
//           </div>

//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleVerify} className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="text-center text-lg border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
//             />

//             <Button 
//               type="submit" 
//               className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
//               disabled={loading}
//             >
//               {loading ? <Loader2 className="animate-spin mr-2" /> : null}
//               {loading ? 'Verifying...' : 'Verify'}
//             </Button>
//           </form>

//           <button
//             type="button"
//             onClick={() => router.push('/auth/login')}
//             className="mt-4 text-sm text-muted-foreground w-full hover:text-indigo-600 transition"
//           >
//             Back to login
//           </button>
//         </Card>
//       </div>
//     </main>
//   );
// }











'use client';

import AuthLogo from '@/components/AuthLogo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyOTPPage() {
  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('temp_login_email');
    if (!storedEmail) {
      setError('Session expired. Please login again.');
      return;
    }
    setEmail(storedEmail);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      setError('Enter valid OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Invalid OTP');
      }

      const tokenToStore = data.token || data.access_token;

      if (tokenToStore) {
        // 1. Store the Tokens
         localStorage.setItem('auth_token', tokenToStore);
         localStorage.setItem('token', tokenToStore);
        // const role = localStorage.getItem('role')
        // localStorage.setItem('access_token', tokenToStore);
        // localStorage.setItem('refresh_token', tokenToStore);


        // if (data.refresh_token) {
        //   localStorage.setItem('refresh_token', data.refresh_token);
        // }
        // 2. 🔥 THE FIX: Store the Name and Email specifically for the Dashboard
        if (data.user) {
          // Store the whole object as you were doing
          localStorage.setItem('auth_user', JSON.stringify(data.user));
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Store individual strings so Dashboard doesn't have to parse JSON
          if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
          if (data.user.name) {
            localStorage.setItem('user_name', data.user.name);
          }
          if (data.user.email) {
            localStorage.setItem('user_email', data.user.email);
          }
          if (data.user?.role) {
            localStorage.setItem('role', data.user.role);
          }
        }

        localStorage.removeItem('temp_login_email');

        // 3. Navigate to Dashboard
        router.push('/main/dashboard');
      } else {
        throw new Error("No token returned from server.");
      }

    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <AuthLogo />

        <Card className="p-6 bg-white border-indigo-200 shadow-xl shadow-indigo-100/50">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">Verify OTP</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center text-lg border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="mt-4 text-sm text-muted-foreground w-full hover:text-indigo-600 transition"
          >
            Back to login
          </button>
        </Card>
      </div>
    </main>
  );
}