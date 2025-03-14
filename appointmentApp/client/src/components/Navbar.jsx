import React from 'react'
import {assets} from "../assets/assets.js"
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b-grey-400'>
      <img className="w-44 cursor-pointer"src={assets.logo} alt="" />
      <ul className='hidden md:flex item-start gap-5 font-medium'>
        <NavLink>
            <li className='py-1'>Home</li>
            <hr className=' outline-none h-0.5  w-3/5 m-auto'/>
        </NavLink>
        <NavLink>
            <li className='py-1'>All Doctors</li>
            <hr className=' outline-none h-0.5  w-3/5 m-auto'/>
        </NavLink>
        <NavLink>
            <li className='py-1'>About</li>
            <hr className=' outline-none h-0.5  w-3/5 m-auto'/>
        </NavLink>
        <NavLink>
            <li className='py-1'>Contact</li>
            <hr className=' outline-none h-0.5  w-3/5 m-auto'/>
        </NavLink>
        
      </ul>
      <div>
        <button>Create Account</button>
      </div>
      
    </div>
    
  )
}

export default Navbar
