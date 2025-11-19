import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const DashboardNavbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Debug logging
  console.log('DashboardNavbar - User state:', user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on dropdown buttons
      if (event.target.closest('.dropdown-menu')) {
        return;
      }
      
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        console.log('Clicking outside dropdown, closing...');
        setShowDropdown(false);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Test alert to confirm click is registering
    alert('Sign out button clicked - check console for details');
    
    console.log('Dashboard sign out clicked');
    console.log('Current user before sign out:', user);
    console.log('SignOut function available:', typeof signOut);
    
    setShowDropdown(false); // Close dropdown immediately
    
    try {
      console.log('Attempting to sign out...');
      const result = await signOut();
      console.log('Firebase signOut result:', result);
      console.log('Sign out completed successfully');
      
      // Force a small delay to ensure Firebase auth state updates
      setTimeout(() => {
        console.log('Navigating to home page...');
        navigate('/', { replace: true });
        // Force page reload to ensure clean state
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out: ' + error.message);
    }
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Dashboard button clicked');
    setShowDropdown(false);
    navigate('/dashboard');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 md:px-20 lg:px-32 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <img src={assets.logo} alt="Logo" className="h-8" />
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-700 hover:text-gray-900 transition hidden md:block"
          >
            Home
          </button>

          {/* User Profile Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                console.log('Dashboard user icon clicked, current dropdown state:', showDropdown);
                setShowDropdown(!showDropdown);
              }}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-3 py-2 transition"
            >
              <div className="w-9 h-9 bg-red-300 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block font-medium text-gray-700">
                {user?.displayName || 'Account'}
              </span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-[9999] dropdown-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b">
                  <p className="font-medium text-gray-900">{user?.displayName || 'User'}</p>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleDashboardClick}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition font-medium flex items-center gap-2"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-medium flex items-center gap-2"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
