import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'


function App() { 

  const {authUser} = useContext(AuthContext)
  
  return (
    <div className="relative min-h-screen">
  {/* Background image with blur */}
  <div className="absolute inset-0 bg-[url('/bgImage.jpg')] bg-cover bg-center blur-sm"></div>

  {/* Foreground content */}
  <div className="relative z-10">
    <Toaster />
    <Routes>
      <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
      <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
      <Route path='/profile' element={authUser ? <ProfilePage/>: <Navigate to="/login"/>}/>
    </Routes>
  </div>
</div>

  )
}

export default App
