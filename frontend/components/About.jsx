import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const About = () => {
  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [sqFt, setSqFt] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const aboutRef = useRef(null);

  const animateNumber = (setter, end) => {
    let start = 0;
    const duration = 2000; // Animation duration in ms
    const increment = (end - start) / (duration / 50); // Updates every 50ms

    let current = start;
    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      setter(Math.round(current));
    }, 50);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          animateNumber(setYears, 10);
          animateNumber(setProjects, 12);
          animateNumber(setSqFt, 20);
          animateNumber(setOngoing, 25);
        }
      },
      { threshold: 0.5 } // Triggers when 50% of the section is visible
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={aboutRef}
      initial={{ opacity: 0, x: 200 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      className="flex flex-col items-center justify-center container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden"
      id="About"
    >
      <h1 className="text-2xl sm:text-4xl font-bold mb-2">
        About <span className="underline underline-offset-4 decoration-1 font-light">Our Brand</span>
      </h1>
      <p className="text-gray-500 max-w-80 text-center mb-8">
        Passionate about Properties, Dedicated to our Vision
      </p>

      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-20">
        <img src={assets.brand_img} alt="" className="w-full sm:w-1/2 max-w-lg" />

        <div className="flex flex-col items-center md:items-start mt-10 text-gray-600">
          <div className="grid grid-cols-2 gap-6 md:gap-10 w-full pr-28">
            {/* Animated Number Counters */}
            <div>
              <p className="text-4xl font-medium text-gray-800">{years}+</p>
              <p>Years of Excellence</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-gray-800">{projects}+</p>
              <p>Projects Completed</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-gray-800">{sqFt}+</p>
              <p>Mn. Sq. Ft. Delivered</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-gray-800">{ongoing}+</p>
              <p>Ongoing Projects</p>
            </div>
          </div>

          <p className="my-10 max-w-lg">
          At Elysian Estates, we are revolutionizing the way people make real estate decisions. Our cutting-edge Real Estate House Predictor System combines data-driven analytics, AI-powered insights, and market trends to provide precise property value predictions, helping buyers, sellers, and investors make informed choices.
          </p>

          <button className="bg-red-300 text-white px-8 py-2 rounded hover:bg-red-400">
            Learn more
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
