import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import drivyImg from '../assets/Drivy-5.png'
import axios from 'axios'
import { gsap } from 'gsap'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()
  const formRef = useRef(null)
  const logoRef = useRef(null)
  const inputsRef = useRef([])
  const bottomBtnRef = useRef(null)

  // Add input to refs array for animations
  const addToInputsRef = (el) => {
    if (el && !inputsRef.current.includes(el)) {
      inputsRef.current.push(el)
    }
  }

  useEffect(() => {
    // GSAP animations
    gsap.from(logoRef.current, { y: -30, opacity: 0, duration: 0.6, ease: "back.out(1.2)" })
    gsap.from(formRef.current, { y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.out" })
    gsap.from(inputsRef.current, {
      duration: 0.6,
      x: -20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.6,
      ease: "back.out"
    })
    gsap.from(bottomBtnRef.current, { y: 30, opacity: 0, duration: 0.8, delay: 0.4, ease: "power2.out" })
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const userData = { email, password }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

      if (response.status === 200) {
        gsap.to(formRef.current, {
          y: -20, opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => {
            const data = response.data
            setUser(data.user)
            localStorage.setItem('token', data.token)
            navigate('/home')
          }
        })
      }
    } catch (err) {
      gsap.fromTo('.error-message', { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 })
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-7 min-h-screen flex flex-col justify-between bg-gradient-to-br from-green-50 to-white">
      <div>
        <img
          ref={logoRef}
          src={drivyImg}
          alt="Drivy Logo"
          className="w-20 mb-8 transform transition-transform hover:scale-105"
        />
        <form
          ref={formRef}
          onSubmit={submitHandler}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h1>

          {error && (
            <div className="error-message bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <div className="mb-6" ref={addToInputsRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="mb-8" ref={addToInputsRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-green-500 hover:bg-green-600 transition-all text-white font-semibold rounded-xl ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          New here?{' '}
          <Link to="/signup" className="text-green-600 hover:text-green-800 font-medium transition-all">
            Create an account
          </Link>
        </p>
      </div>

      <div ref={bottomBtnRef}>
        <Link
          to="/captain-login"
          className="w-full flex justify-center items-center py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-xl transition-all"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  )
}

export default UserLogin
