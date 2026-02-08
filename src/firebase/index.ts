'use client';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseProvider, useFirebase } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';
import { firebaseConfig } from './config';

function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "PASTE_YOUR_API_KEY_HERE") {
    throw new Error('Firebase configuration is missing or incomplete. Please update the placeholder values in src/firebase/config.ts');
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseClientProvider,
  FirebaseProvider,
  useFirebase,
  useUser,
};
