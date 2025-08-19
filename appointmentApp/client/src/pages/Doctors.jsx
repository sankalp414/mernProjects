import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'

const Doctors = () => {
  const {speciality} = useParams()
  const {doctors} = useContext(AppContext)
  return (
    <div>
      
    </div>
  )
}

export default Doctors
