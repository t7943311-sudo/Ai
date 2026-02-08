'use client';

import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: { [key: string]: string } = {
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'The password you entered is incorrect.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/email-already-in-use':
    'An account already exists with this email address.',
  'auth/weak-password': 'Your password must be at least 6 characters long.',
  'auth/too-many-requests':
    'Too many requests from this device. Please try again later.',
  'auth/popup-closed-by-user': 'The sign-in window was closed before completing the process. Please try again.',
  'auth/account-exists-with-different-credential': 'An account with this email already exists. Please sign in using the original method.',
  'auth/cancelled-popup-request': 'The sign-in process was cancelled. Only one sign-in request can be made at a time.',
  'auth/popup-blocked': 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.',
  'auth/operation-not-allowed': 'Sign-in with this method is not enabled. Please contact support.',
  'auth/unauthorized-domain': 'This domain is not authorized for authentication. Please add it to the list of authorized domains in your Firebase project settings.',
};

const DEFAULT_AUTH_ERROR =
  'An unexpected authentication error occurred. Please try again.';

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] || error.message || DEFAULT_AUTH_ERROR;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return DEFAULT_AUTH_ERROR;
}
