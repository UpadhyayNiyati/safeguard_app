'use client';

import { ShieldCheck } from 'lucide-react';

export default function AuthLogo() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full mb-4 shadow-lg shadow-indigo-300">
        <ShieldCheck className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-600 bg-clip-text text-transparent">
        SafeGuard
      </h1>

      <p className="text-muted-foreground mt-2 text-lg">
        Your safety companion
      </p>
    </div>
  );
}