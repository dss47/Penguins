import './App.css'

import { Route, Routes, Navigate } from "react-router-dom"
import NavBar from './components/NavBar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import Tools from './pages/Tools'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/home' element={<Navigate to='/' replace />} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/login' element={<LogIn/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/tools' element={<Tools/>} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App
