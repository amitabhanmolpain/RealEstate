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
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'




const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <BrowserRouter>
      <div className='w-full overflow-hidden'>
        <ToastContainer/>
        <Routes>
          <Route path='/' element={
            <>
              <Header onOpenAuthModal={() => setShowAuthModal(true)} />
              <About/>
              <Projects/>
              <Testimonials/>
              <Contact/>
              <Footer/>
            </>
          } />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </BrowserRouter>
  )
}

export default App
