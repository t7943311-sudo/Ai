'use client';

import type { ReactNode } from 'react';
import { AppLogo } from '@/components/icons';
import Link from 'next/link';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

export default function AuthLayout({ children }: { children: ReactNode }) {
  useAuthRedirect({ on: 'auth', to: '/dashboard' });
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <AppLogo className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">
              CareerBoost AI
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
