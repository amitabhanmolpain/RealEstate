import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useAuth = () => useContext(AuthContext);

const normalizeUser = (rawUser) => ({
  id: rawUser?.id,
  email: rawUser?.email,
  displayName: rawUser?.name || rawUser?.displayName || rawUser?.email?.split('@')[0],
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only restore user if we have BOTH token AND user in storage
    // This prevents stale login states
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        // Invalid stored data, clear everything
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      // Clear partial/invalid session
      if (!token || !storedUser) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const clearSession = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const persistSession = (token, nextUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const postJson = async (path, body) => {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || `Request failed with status ${res.status}`);
      }
      return data;
    } catch (error) {
      console.error(`Error calling ${path}:`, error);
      throw error;
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    signUpWithEmail: async (email, password, displayName) => {
      try {
        const payload = { name: displayName, email, password };
        const data = await postJson('/auth/register', payload);
        const nextUser = normalizeUser(data.user);
        persistSession(data.token, nextUser);
        return nextUser;
      } catch (error) {
        clearSession();
        throw error;
      }
    },
    signInWithEmail: async (email, password) => {
      try {
        const payload = { email, password };
        const data = await postJson('/auth/login', payload);
        const nextUser = normalizeUser(data.user);
        persistSession(data.token, nextUser);
        return nextUser;
      } catch (error) {
        clearSession();
        throw error;
      }
    },
    signOut: async () => {
      clearSession();
    },
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
