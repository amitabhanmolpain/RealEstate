import React, { useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import header_img from "../assets/header_img.png";

const Header = ({ onOpenAuthModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Smooth scroll function
  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`relative min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden transition-all duration-300 ${
        showMobileMenu ? "bg-white" : ""
      }`}
      style={{ backgroundImage: showMobileMenu ? "none" : `url(${header_img})` }}
      id="Header"
    >
      {/* Black Hover Effect */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isHovered ? "opacity-30" : "opacity-0"
        }`}
      ></div>

  {/* Pass down the showMobileMenu state */}
  <Navbar showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} onOpenAuthModal={onOpenAuthModal} />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        className={`relative z-10 container text-center mx-auto py-4 px-6 md:px-20 lg:px-32 text-white transition-all duration-300 ${
          showMobileMenu ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <h2
          className="text-5xl sm:text-6xl md:text-[82px] inline-block max-w-3xl font-semibold pt-20 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Your Trusted Partner in Real Estate
        </h2>
        <div className="space-x-6 mt-16">
          <button
            onClick={() => scrollToSection("#Projects")}
            className="border border-white px-8 py-3 rounded transition duration-300 hover:text-white"
          >
            Projects
          </button>

          {/* Hide "Contact Us" button when mobile menu is open */}
          {!showMobileMenu && (
            <button
              onClick={() => scrollToSection("#Contact")}
              className="bg-red-300 px-8 py-3 rounded transition duration-300 hover:bg-red-400"
            >
              Contact Us
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Header;
