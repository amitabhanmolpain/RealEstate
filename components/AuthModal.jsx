import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAttemptsRemaining(null);
    setIsLocked(false);
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
      setEmail('');
      setPassword('');
      setName('');
      navigate('/dashboard');
    } catch (err) {
      const message = err?.message || 'Something went wrong';
      setError(message);
      
      // Extract attempts remaining from message
      if (message.includes('attempt')) {
        const match = message.match(/(\d+)\s+attempt/);
        if (match) {
          setAttemptsRemaining(parseInt(match[1]));
        }
      }
      
      if (message.includes('locked')) {
        setIsLocked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError('');
    setLoading(true);
    try {
  alert('Google sign-in has been disabled');
    } catch (err) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{mode === 'signup' ? 'Create account' : 'Welcome back'}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-black">✕</button>
        </div>

        {/* Toggle */}
        <div className="grid grid-cols-2 rounded-full bg-gray-100 p-1 mb-5">
          <button
            onClick={() => setMode('signup')}
            className={`py-2 text-sm rounded-full ${mode === 'signup' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`py-2 text-sm rounded-full ${mode === 'signin' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}
          >
            Sign In
          </button>
        </div>

        {error && (
          <div className={`mb-4 p-4 rounded-lg border ${isLocked ? 'bg-red-100 border-red-400' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-3">
              <div className="text-xl">
                {isLocked ? '🔒' : '⚠️'}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${isLocked ? 'text-red-800' : 'text-red-700'}`}>{error}</p>
                {attemptsRemaining !== null && !isLocked && (
                  <div className="mt-2 space-y-2">
                    <p className={`text-sm ${isLocked ? 'text-red-700' : 'text-red-600'}`}>
                      <span className="font-semibold">{attemptsRemaining}</span> attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                    </p>
                    <div className="w-full bg-red-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-600 h-1.5 rounded-full transition-all" 
                        style={{ width: `${(attemptsRemaining / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {isLocked && (
                  <p className="text-sm text-red-700 mt-2">Your account is locked. Please try again in 15 minutes.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-300 hover:bg-red-400 disabled:opacity-60 text-black font-medium py-2.5 rounded-lg"
          >
            {loading ? 'Please wait…' : (mode === 'signup' ? 'Create account' : 'Sign in')}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px bg-gray-200 w-full" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px bg-gray-200 w-full" />
        </div>

        <button
          onClick={onGoogle}
          disabled={loading}
          className="w-full border hover:bg-gray-50 disabled:opacity-60 font-medium py-2.5 rounded-lg"
        >
          Continue with Google
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
