'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useFirebase } from '../provider';

export function useUser() {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Firebase might not be initialized yet. We'll wait for the auth object.
      // The loading state will remain true.
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // The cleanup function for the effect will unsubscribe from the listener.
    return () => unsubscribe();
  }, [auth]); // The effect depends on the auth object.

  return { user, loading };
}
