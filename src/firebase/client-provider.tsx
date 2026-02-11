'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';
import type { FirebaseContextValue } from './provider';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase configuration is missing or incomplete. Please update the placeholder values in src/firebase/config.ts');
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebaseContext, setFirebaseContext] = useState<FirebaseContextValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setFirebaseContext(initializeFirebase());
    } catch (e: any) {
      console.error("Firebase initialization failed:", e);
      setError(e.message || 'An unknown error occurred during Firebase initialization.');
    }
  }, []); 

  if (error) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertTitle>Application Configuration Error</AlertTitle>
            <AlertDescription>
              Could not connect to backend services. This is likely a missing configuration in your environment.
              <p className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                <strong>Error details:</strong> {error}
              </p>
            </AlertDescription>
          </Alert>
       </div>
    );
  }

  if (!firebaseContext) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <FirebaseProvider value={firebaseContext}>{children}</FirebaseProvider>;
}
