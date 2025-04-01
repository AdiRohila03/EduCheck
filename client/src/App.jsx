import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
// Teacher
import ClassroomForm from './pages/teacher/createClass'
import StudentsWork from './pages/teacher/studentsWork'
import CreateTest from './pages/teacher/createTest'
import CreateQuest from './pages/teacher/createQuest'
import UpdateQuest from './pages/teacher/updateQuest'
import UpdateClass from './pages/teacher/updateClass'
import UpdateTest from './pages/teacher/updateTest'
import ViewTest from './pages/teacher/viewTest'
// Student
import JoinClass from './pages/student/joinClass'
import AttendTest from './pages/student/attendTest'
import ReviewTest from './pages/student/reviewTest'
// Classroom
import Dashboard from './pages/classroom/Dashboard'
import Class from './pages/classroom/Class'
import Profile from './pages/classroom/Profile'
import Password from './pages/classroom/Password'
import People from './pages/classroom/People'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        {/* Teacher */}
        <Route path='/create_class' element={<ClassroomForm />} />
        <Route path='/update_class/:classId' element={<UpdateClass />} />
        <Route path='/students_work/:testId' element={<StudentsWork />} />
        <Route path='/create_qn/:testId' element={<CreateQuest />} />
        <Route path='/update_qn/:qnId' element={<UpdateQuest />} />
        <Route path='/create_test/:classId' element={<CreateTest />} />
        <Route path='/update_test/:testId' element={<UpdateTest />} />
        <Route path='/view_test/:testId' element={<ViewTest />} />
        {/* Student */}
        <Route path='/join_class' element={<JoinClass />} />
        <Route path='/attend_test/:testId' element={<AttendTest />} />
        <Route path='/review_test/:testId' element={<ReviewTest />} />
        {/* Classroom */}
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/view_class/:classId' element={<Class />} />
        <Route path='/password' element={<Password />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/people/:classId' element={<People />} />
      </Routes>
    </BrowserRouter>
  )
}
