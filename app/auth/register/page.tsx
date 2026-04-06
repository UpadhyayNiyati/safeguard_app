'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, AlertCircle, User, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError('Please enter your name'), false;
    if (!formData.email.trim()) return setError('Please enter your email'), false;
    if (formData.password.length < 6) return setError('Password must be at least 6 characters'), false;
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match'), false;
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // FIX: Ensure API URL is clean
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, ""); 
      
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('temp_login_email', formData.email);
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/verify-otp');
        }, 2000);
      } else {
        setError(data.error || data.message || 'Registration failed.');
      }

    } catch (err) {
      console.error("Registration Error:", err);
      setError('Connection failed. Please ensure the backend server is running and CORS is enabled.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS UI STATE
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-blue-100 p-4">
        <Card className="w-full max-w-md border-indigo-200 shadow-xl shadow-indigo-100/50">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg shadow-green-200">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Verification Email Sent!</h2>
            <p className="text-muted-foreground mb-6">
              An OTP has been sent to <strong>{formData.email}</strong>. 
              Redirecting you to the verification page...
            </p>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          </CardContent>
        </Card>
      </main>
    );
  }

  // MAIN REGISTRATION UI
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-blue-100 p-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full mb-4 shadow-lg shadow-indigo-300">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-600 bg-clip-text text-transparent">
            SafeGuard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Your safety companion</p>
        </div>

        <Card className="border-indigo-200 shadow-xl shadow-indigo-100/50">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Sign up to receive your verification OTP</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  <Input id="name" name="name" placeholder="John Doe" className="pl-11 h-12 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400" onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-11 h-12 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400" onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  <Input id="phone" name="phone" type="tel" placeholder="+91 9876543210" className="pl-11 h-12 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400" onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-11 pr-11 h-12 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400" onChange={handleChange} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-11 pr-11 h-12 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400" onChange={handleChange} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-base shadow-lg shadow-indigo-300/50 transition-all mt-2" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Register & Send OTP'}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-indigo-200" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-muted-foreground">Or</span></div>
              </div>
              <p className="text-center mt-6 text-muted-foreground">
                Already have an account? <Link href="/auth/login" className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline">Sign in</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-xs text-muted-foreground">
          By signing up, you agree to our <Link href="/terms" className="underline hover:text-indigo-600">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-indigo-600">Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}