import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ClassroomForm from './pages/teacher/createClass'
import Dashboard from './pages/Dashboard'
import Class from './pages/Class'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create_class' element={<ClassroomForm />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/view_class/:id' element={<Class />} />
      </Routes>
    </BrowserRouter>
  )
}
