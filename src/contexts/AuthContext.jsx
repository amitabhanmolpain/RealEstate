import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signUpWithEmail: async (email, password, displayName) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      return cred.user;
    },
    signInWithEmail: async (email, password) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    },
    signInWithGoogle: async () => {
      const cred = await signInWithPopup(auth, googleProvider);
      return cred.user;
    },
    signOut: async () => firebaseSignOut(auth),
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
