import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAuth } from "../src/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = ({ showMobileMenu, setShowMobileMenu, onOpenAuthModal }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Debug logging
  console.log('Navbar render - User state:', user);
  console.log('Navbar render - User exists:', !!user);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  const scrollToSection = (id) => {
    setShowMobileMenu(false); // Close menu first
    setTimeout(() => {
      const section = document.querySelector(id);
      if (section) {
        window.scrollTo({ top: section.offsetTop - 60, behavior: "smooth" });
      }
    }, 100);
  };

  const handleUserIconClick = () => {
    console.log('User icon clicked, current dropdown state:', showUserDropdown);
    setShowUserDropdown(!showUserDropdown);
  };

  const handleDashboardClick = () => {
    console.log('Dashboard button clicked');
    navigate('/dashboard');
    setShowUserDropdown(false);
  };

  const handleSignOut = async () => {
    console.log('Sign out button clicked');
    try {
      await signOut();
      setShowUserDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignInClick = () => {
    console.log('Sign in button clicked');
    onOpenAuthModal();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  return (
    <div className={`absolute top-0 left-0 w-full z-10 transition-all duration-300 ${
      showMobileMenu ? "bg-white" : "bg-transparent"
    }`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32">
        <img src={assets.logo} alt="Logo" className={`${showMobileMenu ? "hidden" : "block"}`} />

        {/* Desktop Navigation */}
        <ul className={`hidden md:flex gap-7 text-white ${showMobileMenu ? "hidden" : "flex"}`}>
          {["Home", "About", "Buy", "Testimonials", "Contact Us"].map((item, index) => {
            const sectionIds = ["#Header", "#About", "#Projects", "#Testimonials", "#Contact"];
            return (
              <li key={index}>
                <a
                  onClick={() => scrollToSection(sectionIds[index])}
                  className="cursor-pointer hover:text-gray-400 transition duration-300"
                >
                  {item}
                </a>
              </li>
            );
          })}
        </ul>

        {!showMobileMenu && (
          <div className="hidden md:block relative user-dropdown-container">
            {user ? (
              <div className="relative">
                <button
                  onClick={handleUserIconClick}
                  className="flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-gray-100 transition duration-300"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-2 z-[9999]">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleDashboardClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignInClick}
                className="bg-white px-8 py-2 rounded-full hover:bg-red-300 transition duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMobileMenu(true)}
          src={assets.menu_icon}
          className={`md:hidden w-7 cursor-pointer ${showMobileMenu ? "hidden" : "block"}`}
          alt="Menu"
        />
      </div>

      {/* ----- Mobile Menu ----- */}
      <div
        className={`md:hidden fixed top-0 right-0 w-full h-full bg-white transition-transform ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6 cursor-pointer">
          <img src={assets.cross_icon} className="w-6" alt="Close" onClick={() => setShowMobileMenu(false)} />
        </div>

        <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium">
          {user && (
            <li className="mb-4 text-center">
              <div className="flex flex-col items-center gap-2 p-4 border-b border-gray-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <p className="text-sm font-medium">{user.displayName || user.email}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleDashboardClick();
                      setShowMobileMenu(false);
                    }}
                    className="px-3 py-1 bg-red-300 text-white rounded text-sm hover:bg-red-400"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowMobileMenu(false);
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </li>
          )}
          {!user && (
            <li className="mb-4">
              <button
                onClick={() => {
                  handleSignInClick();
                  setShowMobileMenu(false);
                }}
                className="bg-red-300 px-6 py-2 rounded-full text-white hover:bg-red-400"
              >
                Sign In
              </button>
            </li>
          )}
          {["Home", "About", "Buy", "Testimonials", "Contact Us"].map((item, index) => {
            const sectionIds = ["#Header", "#About", "#Projects", "#Testimonials", "#Contact"];
            return (
              <li key={index}>
                <a
                  onClick={() => scrollToSection(sectionIds[index])}
                  className="cursor-pointer hover:text-gray-400 transition duration-300 px-4 py-2 rounded-full inline-block"
                >
                  {item}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
