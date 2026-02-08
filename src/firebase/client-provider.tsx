'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import type { FirebaseContextValue } from './provider';
import { Loader2 } from 'lucide-react';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebaseContext, setFirebaseContext] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after the initial server render.
    // This ensures that Firebase is initialized in the browser environment
    // where the `NEXT_PUBLIC_` environment variables are available.
    setFirebaseContext(initializeFirebase());
  }, []); // The empty dependency array ensures this runs only once.

  if (!firebaseContext) {
    // Render a loading indicator while Firebase is initializing.
    // This prevents children from attempting to use Firebase before it's ready.
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <FirebaseProvider value={firebaseContext}>{children}</FirebaseProvider>;
}
