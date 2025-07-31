import React, { useState, useEffect } from 'react';
import { assets, projectsData } from '../assets/assets';
import { motion } from 'framer-motion';

const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(1);

    useEffect(() => {
        const updateCardsToShow = () => {
            if (window.innerWidth >= 1024) {
                setCardsToShow(projectsData.length + 1); // Include "See More" card
            } else {
                setCardsToShow(1);
            }
        };
        updateCardsToShow();

        window.addEventListener('resize', updateCardsToShow);
        return () => window.removeEventListener('resize', updateCardsToShow);
    }, []);

    const nextProject = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (projectsData.length + 1)); // Include "See More"
    };

    const prevProject = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? projectsData.length : prevIndex - 1));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -200 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className='relative container mx-auto py-4 pt-20 px-6 md:px-20 lg:px-32 my-20 w-full overflow-hidden'
            id='Projects'
        >
            <h1 className='text-2xl sm:text-4xl font-bold mb-2 text-center'>
                Featured 
                <span className="underline underline-offset-4 decoration-1 font-light"> Sales</span>
            </h1>
            <p className='text-center text-gray-500 mb-8 max-w-80 mx-auto'>
                Crafting Spaces, Building Legacies - Explore Our Portfolio
            </p>

            {/* Wrapper for Slider & Buttons */}
            <div className='relative flex items-center justify-center group'>

                {/* Left Arrow Button */}
                <button 
                    onClick={prevProject}
                    className='absolute left-0 md:-left-16 top-1/2 transform -translate-y-1/2 bg-red-300 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-400'
                    aria-label='Previous Project'
                >
                    <img src={assets.left_arrow} alt="Previous" className="w-5 h-5 filter brightness-0 invert" />
                </button>

                {/* Project Slider Container */}
                <div className='overflow-hidden w-full'>
                    <div className='flex gap-8 transition-transform duration-500 ease-in-out'
                        style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}>

                        {projectsData.map((project, index) => (
                            <div key={index} className='relative flex-shrink-0 w-full sm:w-1/4'>
                                {/* Image */}
                                <img src={project.image} alt={project.title} className='w-full h-auto mb-16' />

                                {/* Project Info */}
                                <div className='absolute left-0 right-0 bottom-2 flex justify-center'>
                                    <div className='inline-block bg-white w-3/4 px-4 py-2 shadow-md'>
                                        <h2 className='text-xl font-semibold text-gray-800'>
                                            {project.title}
                                        </h2>
                                        <p className='text-gray-500 text-sm'>
                                            {project.price} <span className='px-1'>|</span> {project.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* See More Card (Shifted Left) */}
                        <div 
                            className='relative flex-shrink-0 w-full sm:w-1/4 h-80 flex items-center justify-center bg-red-300 text-white text-xl font-semibold cursor-pointer ml-[-20px]'
                            onClick={() => alert('Development in process')}
                        >
                            <motion.p 
                                className='text-2xl'
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                See More →
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* Right Arrow Button */}
                <button 
                    onClick={nextProject}
                    className='absolute right-0 md:-right-16 top-1/2 transform -translate-y-1/2 bg-red-300 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-400'
                    aria-label='Next Project'
                >
                    <img src={assets.right_arrow} alt="Next" className="w-5 h-5 filter brightness-0 invert" />
                </button>

            </div>
        </motion.div>
    );
};

export default Projects;
