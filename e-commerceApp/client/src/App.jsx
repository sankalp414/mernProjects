import React from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import { Routes,Route, useLocation} from 'react-router-dom'
import {Toaster} from "react-hot-toast"
import Footer from './components/Footer.jsx'
const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller")
  return (
    <div>
      {isSellerPath ? null : <Navbar/>}

      <Toaster />
      <div className={`${isSellerPath? "": "px-6 md:px-16 lg:px-24xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </div>
      {!isSellerPath &&<Footer/>}
    </div>
  )
}

export default App
