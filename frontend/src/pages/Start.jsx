import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import drivyImg from '../assets/Drivy-4.png'

const Start = () => {
  const bottomDivRef = useRef(null)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768) 
    }

    checkScreenSize() 
    window.addEventListener('resize', checkScreenSize)

    if (isMobile) {
      gsap.from(bottomDivRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      })

      gsap.from(".logo", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2
      })
    }

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [isMobile])

  if (!isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
        <div className="text-center max-w-md">
          <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-3xl font-extrabold text-black mb-4">
              Drivy is designed for mobile only
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              For the best experience, please open this site on your smartphone. Drivy is built exclusively for mobile users.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full'>
        <img
          className='w-16 ml-8 logo'
          src={drivyImg}
          alt="Uber Logo"
        />

        <div
          ref={bottomDivRef}
          className='bg-white pb-8 py-4 px-4 rounded-t-3xl shadow-lg'
        >
          <h2 className='text-[30px] font-semibold mb-2'>Get Started with Drivy</h2>
          <p className='text-gray-600 mb-6'>Ready for your ride? Let's get moving</p>
          <Link
            to='/login'
            className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5 hover:bg-gray-800 transition-colors duration-300'
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start