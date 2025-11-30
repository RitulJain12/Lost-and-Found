import { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lostfoundapp from '../src/pages/landing';
import AuthPage from '../src/pages/signup';
import HomePage from './pages/home';
function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Lostfoundapp />} />
      {/* <Route path="/lost" element={<Lost />} />
      <Route path="/found" element={<Found />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/Home" element={<HomePage />} />
      {/* <Route path="/add-lost" element={<AddLost />} />
      nt={<AddFound <Route path="/add-found" eleme/>} /> */}
    </Routes>
  </BrowserRouter>
  )
}

export default App
