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
  const formRef = useRef(null)
  const logoRef = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    // Initial animations
    gsap.from(logoRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.2)"
    })

    gsap.from(formRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out"
    })

    gsap.from(footerRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
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
        // Success animation
        gsap.to(formRef.current, {
          y: -20,
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
      // Error animation
      gsap.fromTo('.error-message', 
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 }
      )
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between bg-white overflow-hidden'>
      <div>
        <img
          ref={logoRef}
          className='w-16 mb-10'
          src={drivyImg}
          alt="Drivy Logo"
        />

        <div ref={formRef}>
          <h1 className='text-2xl font-bold mb-6'>Create your account</h1>
          
          {error && (
            <div className="error-message bg-red-100 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Your name</label>
              <div className='flex gap-4'>
                <input
                  required
                  className='bg-gray-50 w-full rounded-lg px-4 py-3 border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                  type="text"
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  required
                  className='bg-gray-50 w-full rounded-lg px-4 py-3 border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                  type="text"
                  placeholder='Last name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                type="email"
                placeholder='email@example.com'
              />
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
              <input
                className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                type="password"
                placeholder='Create a password'
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                relative bg-black text-white font-semibold mb-4 rounded-lg px-4 py-3 w-full text-base 
                overflow-hidden transition-all duration-300
                ${isLoading ? 'opacity-70' : ''}
                hover:bg-gray-900 hover:shadow-lg
                active:scale-[0.98] active:shadow-none
              `}
            >
              {/* Hover effect element */}
              <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
              
              {isLoading ? (
                <span className="flex items-center justify-center relative z-10">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="relative z-10">Create account</span>
              )}
            </button>
          </form>

          <p className='text-center text-gray-600'>
            Already have an account?{' '}
            <Link 
              to='/login' 
              className='
                text-blue-600 hover:text-blue-800 
                transition-colors duration-300
                hover:underline hover:underline-offset-4
              '
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      <div ref={footerRef} className='mb-4'>
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