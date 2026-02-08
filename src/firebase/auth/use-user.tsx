'use client';

import { useId, useSyncExternalStore } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useFirebase } from '../provider';

type Value = {
  user: User | null;
  loading: boolean;
};

const listeners = new Map<string, () => void>();
let value: Value = {
  user: null,
  loading: true,
};

function subscribe(callback: () => void) {
  const { auth } = useFirebase();
  const id = useId();

  listeners.set(id, callback);

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    value = { user, loading: false };
    for (const listener of listeners.values()) {
      listener();
    }
  });

  return () => {
    listeners.delete(id);
    unsubscribe();
  };
}

function getSnapshot() {
  return value;
}

export function useUser() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
