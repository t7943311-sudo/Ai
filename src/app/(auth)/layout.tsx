'use client';

import type { ReactNode } from 'react';
import { AppLogo } from '@/components/icons';
import Link from 'next/link';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Loader2 } from 'lucide-react';
import { useUser, useFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRedirectResult } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { getAuthErrorMessage } from '@/lib/firebase-error-handler';
import { upsertUserProfile } from '@/lib/auth-helpers';

export default function AuthLayout({ children }: { children: ReactNode }) {
  useAuthRedirect({ on: 'auth', to: '/dashboard' });
  const { user, loading: userLoading } = useUser();
  const { auth, firestore } = useFirebase();
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs once on mount to handle the redirect result from Google Sign-In.
    async function handleSignInRedirect() {
      // Don't run if Firebase isn't ready or if the user is already logged in.
      if (!auth || !firestore || user) {
        setIsProcessingRedirect(false);
        return;
      }

      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          // Create or update their profile in Firestore.
          await upsertUserProfile(firestore, result.user);
          // Redirect to the dashboard.
          router.replace('/dashboard');
          // We don't set isProcessingRedirect to false here because the page will navigate away.
        } else {
          // No redirect result, so we're not in the middle of a sign-in flow.
          setIsProcessingRedirect(false);
        }
      } catch (error) {
        // Handle any errors that occurred during the sign-in process.
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: getAuthErrorMessage(error),
        });
        setIsProcessingRedirect(false);
      }
    }

    handleSignInRedirect();
    // We only want this to run once when the layout mounts.
    // auth and firestore instances are stable.
  }, [auth, firestore, router, toast, user]);

  // Show a loader while we are processing the redirect or waiting for the initial user state.
  if (userLoading || isProcessingRedirect) {
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
