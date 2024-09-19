import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import Navbar from './components/common/Navbar'
import OpenRoute from './components/core/Auth/OpenRoute'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
const App = () => {
  return (
    <div className='font-inter w-screen min-h-screen flex flex-col justify-between align-center bg-black'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path='signup' element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path='login' element={<OpenRoute><Login /></OpenRoute>} />
        <Route path='forgot-password' element={<OpenRoute><ForgotPassword /></OpenRoute>} />
        <Route path='update-password/:id' element={<OpenRoute><UpdatePassword/></OpenRoute>}/>
      </Routes>
    </div>
  )
}

export default App