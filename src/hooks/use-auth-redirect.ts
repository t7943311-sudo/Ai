'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

type RedirectOptions = {
  on: 'auth' | 'unauth';
  to: string;
};

export function useAuthRedirect({ on, to }: RedirectOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (on === 'auth' && user) {
      router.replace(to);
    }

    if (on === 'unauth' && !user && pathname !== '/') {
      router.replace(to);
    }
  }, [user, loading, router, on, to, pathname]);
}
