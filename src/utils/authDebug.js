// Debug helper to clear auth state
export const clearAuthState = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  console.log('✓ Auth state cleared');
};

export const getAuthState = () => {
  return {
    user: localStorage.getItem('user'),
    token: localStorage.getItem('token'),
  };
};

// Call this in browser console to reset: clearAuthState()
if (typeof window !== 'undefined') {
  window.clearAuthState = clearAuthState;
  window.getAuthState = getAuthState;
}
