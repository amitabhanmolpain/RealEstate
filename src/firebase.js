// Firebase initialization for Vite + React
// Fill the .env values (VITE_FIREBASE_*) before running
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard against missing envs to help early debugging
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(`[Firebase] Missing env for ${key}. Did you set VITE_FIREBASE_* in .env?`);
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
