import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Safely verify if valid Firebase credentials exist
const isConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim() !== '' &&
    !firebaseConfig.apiKey.includes('YOUR_')
);

let app: any = null;
let auth: Auth | null = null;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization skipped or failed:', error);
    app = null;
    auth = null;
  }
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!auth) {
    alert(
      'Firebase Authentication is not fully configured.\nPlease verify NEXT_PUBLIC_FIREBASE_API_KEY in .env.local'
    );
    throw new Error('Firebase Auth not configured');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/popup-closed-by-user'
    ) {
      console.warn('Sign-in popup was closed or cancelled by the user.');
      return null;
    }
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  if (!auth) return;

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  try {
    return onAuthStateChanged(auth, callback);
  } catch (err) {
    console.warn('Auth listener error:', err);
    callback(null);
    return () => {};
  }
};

export { app, auth };
