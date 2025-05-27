import './index.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login/Login'
import { Register } from './pages/Register/Register'
import { HomePage } from './pages/HomePage/HomePage'
import { PrivateRoute } from './routes/PrivateRoute'

function App () {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/'
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />{' '}
    </Routes>
  )
}

export default App
