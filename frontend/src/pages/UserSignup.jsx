import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import drivyImg from '../assets/Drivy-5.png'
import { gsap } from 'gsap'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const formRef = useRef()
  const logoRef = useRef()
  const inputsRef = useRef([])
  const buttonRef = useRef()
  const footerRef = useRef()

  const addToInputsRef = (el) => {
    if (el && !inputsRef.current.includes(el)) {
      inputsRef.current.push(el)
    }
  }

  useEffect(() => {
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
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email: email,
        password: password
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        gsap.to(formRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            const data = response.data
            setUser(data.user)
            localStorage.setItem('token', data.token)
            navigate('/home')
          }
        })
      }
    } catch (err) {
      gsap.from(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power1.out"
      })
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
          <h1 className='text-2xl font-bold mb-6 text-gray-800'>Create your account</h1>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className='mb-6' ref={addToInputsRef}>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Your name</label>
            <div className='flex gap-4'>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className='bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 w-full text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all'
                type="text"
                placeholder='First name'
              />
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className='bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 w-full text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all'
                type="text"
                placeholder='Last name'
              />
            </div>
          </div>

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

          <div className='mb-5' ref={addToInputsRef}>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 w-full text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all'
              type="password"
              placeholder='Create a password'
            />
          </div>

          <button
            ref={buttonRef}
            type="submit"
            disabled={isLoading}
            className={`bg-black hover:bg-gray-900 text-white font-bold rounded-xl px-4 py-3 w-full text-lg transition-colors duration-300 shadow-md hover:shadow-lg ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className='text-center mt-3 text-gray-600'>
          Already have an account? <Link to='/login' className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>Login here</Link>
        </p>
      </div>

      <div ref={footerRef} className=''>
        <p className='text-[10px] text-gray-500 leading-tight'>
          This site is protected by reCAPTCHA and the{' '}
          <a href="#" className='underline hover:text-gray-700 transition-colors'>Google Privacy Policy</a>{' '}
          and{' '}
          <a href="#" className='underline hover:text-gray-700 transition-colors'>Terms of Service</a>{' '}
          apply.
        </p>
      </div>
    </div>
  )
}

export default UserSignup
