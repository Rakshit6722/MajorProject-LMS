import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
const App = () => {
  return (
    <div className='font-inter w-screen min-h-screen flex flex-col justify-between align-center bg-black'>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </div>
  )
}

export default App