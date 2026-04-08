'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.replace('/main/dashboard');
    } else {
      router.replace('/auth/landing');
    }
  }, [router]);

  // Render nothing while redirecting
  return null;
}
