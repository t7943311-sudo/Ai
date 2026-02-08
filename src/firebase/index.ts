'use client';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseProvider, useFirebase } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';


function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  // Defer importing config until we are on the client
  const { firebaseConfig } = require('./config');

  if (getApps().length) {
    const app = getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore };
  }
  const app = initializeApp(firebaseConfig);
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
