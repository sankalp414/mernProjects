import React from 'react'
import {categories} from '../assets/assets'
import { useAppContext } from '../context/AppContext'
const Categories = () => {
    const {navigate} = useAppContext()
  return (
    <div className='t-16'>
      <p className='text-2xl d:text-3xl font-ediu'>Categories</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>

        {categories.map((category,index)=>(
      <div className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
      style={{backgroundColor: category.bgColor}}
      onClick={()=>{
        navigate(`/products/${category.path.toLowerCase()}`)
      }} key={index}>
        <img src={category.image} className='group-hover:scale-100 transition max-w-28'/>
        <p className='text-sm font-medium'>{category.text}</p>
      </div>

        ))}


      </div>
    </div>
  )
}

export default Categories
