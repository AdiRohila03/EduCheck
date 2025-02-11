import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ClassroomForm from './pages/teacher/createClass'
import Dashboard from './pages/Dashboard'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create_class' element={<ClassroomForm />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
