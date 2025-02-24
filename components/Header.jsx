import React, { useState } from 'react';
import Navbar from './Navbar';
import { motion } from "framer-motion";
import header_img from '../assets/header_img.png';

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className='relative min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden'
      style={{ backgroundImage: `url(${header_img})` }} 
      id='Header'
    >
      {/* Black Hover Effect (Only appears when heading is hovered) */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'opacity-30' : 'opacity-0'}`}></div>

      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        className='relative z-10 container text-center mx-auto py-4 px-6 md:px-20 lg:px-32 text-white'
      >
        <h2 
          className='text-5xl sm:text-6xl md:text-[82px] inline-block max-w-3xl font-semibold pt-20 cursor-pointer'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Your Trusted Partner in Real Estate
        </h2>
        <div className='space-x-6 mt-16'>
          <a href="#Projects" className='border border-white px-8 py-3 rounded transition duration-300 hover:text-white'>
            Projects
          </a>
          <a href="#Contact" className='bg-red-300 px-8 py-3 rounded transition duration-300 hover:bg-red-400'>
            Contact Us
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Header;
