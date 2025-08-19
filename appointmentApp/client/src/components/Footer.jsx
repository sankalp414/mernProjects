import React from 'react'
import { assets } from '../assets/assets.js'
const Footer = () => {
  return (
    <>
    <div className='md:mx-10 '>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* ---left section-- */}
        <div>
        <img src={assets.logo} alt="" className='mb-5 w-40'/>
        <p className='w-full md:w-2/3 text-gray-600 leading-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere quam, voluptas odit praesentium odio consequatur nesciunt, iusto nemo provident quia nam laudantium! Aperiam officia possimus commodi odio eaque sequi molestias?</p>
        </div>
      </div>
      <div>
        {/* center section */}
        <p className='text-xl font-medium mb-5'>Company</p>
        <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Privacy Policy</li>
        </ul>
      </div>
      <div>
        {/* right section */}
        <p>Get in Touch</p>
        <ul>
            <li>+1-2-234-567</li>
            <li>greatstackdev@gmail.com</li>
        </ul>
      </div>
    </div>
    <div>
        <hr />
        <p>Copyright 2025 @ Sankalp</p>
    </div>
    </>
  )
}

export default Footer
