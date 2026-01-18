import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';
import { likeService } from '../src/services/likeService';

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [interestsCount, setInterestsCount] = useState(0);

  useEffect(() => {
    // Only fetch if user is logged in
    if (!user) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch interests count on mount and when component updates
    const fetchInterestsCount = async () => {
      try {
        const result = await likeService.checkLikedProperties();
        setInterestsCount(result.count || 0);
      } catch (error) {
        console.error('Error fetching interests count:', error);
        setInterestsCount(0);
      }
    };

    // Initial fetch
    fetchInterestsCount();

    // Poll every 30 seconds instead of 5 to reduce load
    const interval = setInterval(fetchInterestsCount, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-20 lg:px-32">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              onClick={() => navigate('/dashboard')}
              className="text-2xl font-bold text-red-400 cursor-pointer hover:text-red-500 transition"
            >
              RealEstate
            </h1>
          </div>

          {/* Center Menu */}
          <div className="hidden md:flex gap-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:text-red-400 font-medium transition"
            >
              Properties
            </button>
            <button
              onClick={() => navigate('/add-property')}
              className="text-gray-700 hover:text-red-400 font-medium transition"
            >
              List Your Property
            </button>
          </div>

          {/* Right Side - User Info & Logout */}
          <div className="flex items-center gap-4">
            {/* Interests Button */}
            <button
              onClick={() => navigate('/interests')}
              className="relative p-2 text-gray-700 hover:text-red-400 transition"
              title="View your interests"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {interestsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {interestsCount > 9 ? '9+' : interestsCount}
                </span>
              )}
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-300 hover:bg-red-400 text-black font-medium rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
