import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: { [key: string]: string } = {
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'The password you entered is incorrect.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/email-already-in-use':
    'An account already exists with this email address.',
  'auth/weak-password': 'Your password must be at least 6 characters long.',
  'auth/too-many-requests':
    'Too many attempts. Please try again later.',
};

const DEFAULT_AUTH_ERROR =
  'An unexpected error occurred. Please try again.';

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] || DEFAULT_AUTH_ERROR;
  }
  return DEFAULT_AUTH_ERROR;
}
