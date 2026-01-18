import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAuth } from "../src/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = ({ showMobileMenu, setShowMobileMenu, onOpenAuthModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  const scrollToSection = (id) => {
    setShowMobileMenu(false);
    setTimeout(() => {
      const section = document.querySelector(id);
      if (section) {
        window.scrollTo({ top: section.offsetTop - 60, behavior: "smooth" });
      }
    }, 100);
  };

  const handleSignInClick = () => {
    onOpenAuthModal();
  };

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
          <div className="hidden md:block">
            <button
              onClick={handleSignInClick}
              className="bg-white px-8 py-2 rounded-full hover:bg-red-300 transition duration-300"
            >
              Sign In
            </button>
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
