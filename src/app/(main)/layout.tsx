'use client';

import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useFirebase, useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { doc, getDoc } from 'firebase/firestore';

export default function MainLayout({ children }: { children: ReactNode }) {
  useAuthRedirect({ on: 'unauth', to: '/login' });
  const { user, loading } = useUser();
  const { firestore } = useFirebase();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (user && firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          const theme = docSnap.data().settings?.theme;
          if (theme && ['light', 'dark', 'system'].includes(theme)) {
            setTheme(theme);
          }
        }
      });
    }
  }, [user, firestore, setTheme]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
