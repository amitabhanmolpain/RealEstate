import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='pt-10 px-4 md:px-20 lg:px-32 bg-gray-900 w-full overflow-hidden' id='Footer'>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
        
        {/* Logo & About Section */}
        <div className='w-full md:w-1/3 mb-8 md:mb-0'>
          <img src={assets.logo_dark} alt="Logo" />
          <p className='text-gray-400 mt-4'>
          At Estate  we are revolutionizing the way people make real estate decisions. Our cutting-edge Real Estate House Predictor System combines data-driven analytics, AI-powered insights, and market trends to provide precise property value predictions, helping buyers, sellers, and investors make informed choices. </p>
        </div>

        {/* Links & Subscription Section */}
        <div className='w-full md:w-2/3 flex flex-col md:flex-row justify-between'>

          {/* Navigation Links */}
          <div className='w-full md:w-1/2 mb-8 md:mb-0'>
            <h3 className='text-white text-lg font-bold mb-4'>Company</h3>
            <ul className='flex flex-col gap-2 text-gray-400'>
              <a href="#Header" className='hover:text-white'>Home</a>
              <a href="#About" className='hover:text-white'>About</a>
              <a href="#Contact" className='hover:text-white'>Contact us</a>
              <a href="#" className='hover:text-white'>Privacy policy</a>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className='w-full md:w-1/2'>
            <h3 className='text-white text-lg font-bold mb-4'>Subscribe to our newsletter</h3>
            <p className='text-gray-400 mb-4'>The latest news, articles, and resources, sent to your inbox weekly.</p>
            <div className='flex items-center gap-2'>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className='p-2 rounded bg-gray-800 text-gray-400 border border-gray-700 focus:outline-none flex-grow' 
              />
              <button className='py-2 px-4 rounded bg-red-300 text-white whitespace-nowrap hover:bg-red-400'>Subscribe</button>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Section */}
      <div className='border-t border-gray-700 py-4 mt-10 text-center text-gray-500'>
        <p>Copyright {new Date().getFullYear()} &copy; Estate. All Rights Reserved.</p> 
      </div>
    </div>
  );
}

export default Footer;
