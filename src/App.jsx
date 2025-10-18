import React, { useState } from 'react'
import About from '../components/About.jsx'
import Projects from '../components/Projects.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Contact from '../components/Contact.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import AuthModal from '../components/AuthModal.jsx'




const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <div className='w-full overflow-hidden'>
      <ToastContainer/>
      <Header onOpenAuthModal={() => setShowAuthModal(true)} />
      <About/>
      <Projects/>
      <Testimonials/>
      <Contact/>
      <Footer/>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
  )
}

export default App
