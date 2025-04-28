import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'
import drivyImg from '../assets/Drivy-5.png'
import { gsap } from 'gsap'

const CaptainSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const formRef = useRef()
  const logoRef = useRef()
  const inputsRef = useRef([])
  const vehicleInfoRef = useRef([])

  const addToInputsRef = (el) => {
    if (el && !inputsRef.current.includes(el)) {
      inputsRef.current.push(el)
    }
  }

  const addToVehicleInfoRef = (el) => {
    if (el && !vehicleInfoRef.current.includes(el)) {
      vehicleInfoRef.current.push(el)
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

    gsap.from(vehicleInfoRef.current, {
      duration: 0.6,
      opacity: 0,
      y: 20,
      stagger: 0.1,
      delay: 1.0,
      ease: "back.out"
    })
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
      vehicle: { color: vehicleColor, plate: vehiclePlate, capacity: vehicleCapacity, vehicleType }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      gsap.from(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power1.out"
      })
    }

    // Clear input fields
    setEmail('') 
    setFirstName('') 
    setLastName('') 
    setPassword('') 
    setVehicleColor('') 
    setVehiclePlate('') 
    setVehicleCapacity('') 
    setVehicleType('')
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
          <h1 className='text-2xl font-bold mb-6 text-gray-800'>Create Captain Account</h1>

          <div className='mb-6' ref={addToInputsRef}>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Captain's Name</label>
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

          <div className='mb-6' ref={addToInputsRef}>
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

          <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7' ref={addToVehicleInfoRef}>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>
          <div className='flex gap-4 mb-7' ref={addToVehicleInfoRef}>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="moto">Bike</option>
              <option value="auto">Auto</option>
              <option value="car">Car</option>
            </select>
          </div>

          <button
            type="submit"
            className='bg-black text-white font-bold rounded-xl px-4 py-3 w-full text-lg transition-colors duration-300 shadow-md hover:bg-gray-900'
          >
            Create Captain Account
          </button>
        </form>

        <p className='text-center mt-5 text-gray-600'>
          Already have an account? <Link to='/captain-login' className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>Login here</Link>
        </p>
      </div>

      <div className='py-5'>
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

export default CaptainSignup
