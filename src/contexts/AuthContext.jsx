import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signUpWithEmail: async (email, password, displayName) => {
      // Simple validation
      if (!email || !password || !displayName) {
        throw new Error('Email, password, and name are required');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
      if (existingUsers[email]) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const newUser = {
        email,
        displayName,
        uid: Date.now().toString(),
      };

      // Store password (note: in production, never store plain passwords)
      existingUsers[email] = { password, ...newUser };
      localStorage.setItem('users', JSON.stringify(existingUsers));
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      return newUser;
    },
    signInWithEmail: async (email, password) => {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
      const userRecord = existingUsers[email];

      if (!userRecord || userRecord.password !== password) {
        throw new Error('Invalid email or password');
      }

      const loggedInUser = {
        email: userRecord.email,
        displayName: userRecord.displayName,
        uid: userRecord.uid,
      };

      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser;
    },
    signOut: async () => {
      localStorage.removeItem('user');
      setUser(null);
    },
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
