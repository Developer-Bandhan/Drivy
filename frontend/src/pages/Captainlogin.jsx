import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'
import drivyImg from '../assets/Drivy-5.png'
import { gsap } from 'gsap'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()
  
  // Refs for GSAP animations
  const formRef = useRef()
  const logoRef = useRef()
  const inputsRef = useRef([])
  const buttonRef = useRef()
  const footerRef = useRef()

  // Add input to ref array
  const addToInputsRef = (el) => {
    if (el && !inputsRef.current.includes(el)) {
      inputsRef.current.push(el)
    }
  }

  useEffect(() => {
    // Initial animations
    gsap.from(logoRef.current, {
      duration: 0.8,
      y: -50,
      opacity: 0,
      ease: "power3.out"
    })
    
    gsap.from(formRef.current, {
      duration: 0.8,
      y: 30,
      opacity: 0,
      delay: 0.3,
      ease: "power3.out"
    })
    
    gsap.from(inputsRef.current, {
      duration: 0.6,
      x: -20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.6,
      ease: "back.out"
    })
    
    gsap.from([buttonRef.current, footerRef.current], {
      duration: 0.5,
      y: 20,
      opacity: 0,
      delay: 1,
      ease: "power2.out"
    })
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password
    }

    try {
      // Button click animation
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      })

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        
        // Success animation before navigation
        gsap.to(formRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => navigate('/captain-home')
        })
      }
    } catch (error) {
      // Error shake animation
      gsap.from(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power1.out"
      })
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100'>
      <div>
        <img
          ref={logoRef}
          className='w-20 mb-8 transform transition-transform hover:scale-105'
          src={drivyImg}
          alt="Drivy Logo"
        />

        <form 
          ref={formRef}
          onSubmit={submitHandler}
          className='bg-white rounded-2xl p-6 shadow-lg'
        >
          <h1 className='text-2xl font-bold mb-6 text-gray-800'>Captain Login</h1>
          
          <div className='mb-6' ref={addToInputsRef}>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 w-full text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all'
              type="email"
              placeholder='email@example.com'
            />
          </div>

          <div className='mb-8' ref={addToInputsRef}>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
            <input
              className='bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 w-full text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              type="password"
              placeholder='Enter your password'
            />
          </div>

          <button
            ref={buttonRef}
            className='bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl px-4 py-3 w-full text-lg transition-colors duration-300 shadow-md hover:shadow-lg'
          >
            Login
          </button>
        </form>
        
        <p className='text-center mt-4 text-gray-600'>
          Join a fleet? <Link to='/captain-signup' className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>Register as a Captain</Link>
        </p>
      </div>
      
      <div ref={footerRef}>
        <Link
          to='/login'
          className='bg-black hover:bg-gray-800 text-white font-bold rounded-xl px-4 py-3 w-full text-lg block text-center transition-colors duration-300'
        >
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default CaptainLogin