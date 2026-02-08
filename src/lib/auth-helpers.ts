'use client';

import {
  type Auth,
  GoogleAuthProvider,
  signInWithPopup,
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
 * Handles the Google sign-in process, creating or updating the user profile in Firestore,
 * and setting the theme in localStorage.
 * @param auth - The Firebase Auth instance.
 * @param firestore - The Firebase Firestore instance.
 * @returns The user object from the user credential.
 * @throws An error if the sign-in fails.
 */
export async function processGoogleSignIn(
  auth: Auth,
  firestore: Firestore
): Promise<User> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userRef = doc(firestore, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Existing user
      const userData = docSnap.data();
      if (userData?.settings?.theme) {
        localStorage.setItem('theme', userData.settings.theme);
      }
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
    return user;
}
