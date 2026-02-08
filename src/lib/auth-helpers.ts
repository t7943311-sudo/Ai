'use client';

import {
  type Auth,
  GoogleAuthProvider,
  signInWithRedirect,
  type User,
} from 'firebase/auth';
import {
  type Firestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Creates or updates a user profile in Firestore. This is called after any
 * successful sign-in or sign-up.
 * @param firestore - The Firebase Firestore instance.
 * @param user - The Firebase User object.
 */
export async function upsertUserProfile(firestore: Firestore, user: User) {
  const userRef = doc(firestore, 'users', user.uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    // Existing user
    const userData = docSnap.data();
    if (userData?.settings?.theme) {
      localStorage.setItem('theme', userData.settings.theme);
    }
    // Update name/email from provider and timestamp
    await setDoc(
      userRef,
      {
        name: user.displayName,
        email: user.email,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } else {
    // New user
    localStorage.setItem('theme', 'system');
    await setDoc(
      userRef,
      {
        name: user.displayName,
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        settings: {
          theme: 'system',
          onboardingCompleted: false,
        },
      },
      { merge: true }
    );
  }
}

/**
 * Initiates the Google sign-in process by redirecting to Google's sign-in page.
 * The result is handled in the `AuthLayout`.
 * @param auth - The Firebase Auth instance.
 */
export async function processGoogleSignIn(auth: Auth) {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
}
