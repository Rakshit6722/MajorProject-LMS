import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import Navbar from './components/common/Navbar'
import OpenRoute from './components/core/Auth/OpenRoute'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import About from './pages/About'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import Dashboard from './pages/Dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from './utils/constants'
import MyProfile from './components/core/Dashboard/MyProfile'
import Settings from './components/core/Dashboard/Settings/Index'
import Contact from './pages/Contact'
import EnrolledCourse from './components/core/Dashboard/EnrolledCourse'
import Cart from './components/core/Dashboard/Cart/Index'
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor'
import AddCourse from './components/core/Dashboard/AddCourse'
import EditCourse from './components/core/Dashboard/EditCourse'
import MyCourses from './components/core/Dashboard/MyCourses'
import Catalog from './pages/Catalog'
import VideoDetails from './components/core/viewCourse/VideoDetails'
import ViewCourse from './pages/viewCourse'
const App = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector(state => state.profile)

  return (
    <div className='font-inter w-screen min-h-screen flex flex-col justify-between align-center bg-black'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path='signup' element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path='login' element={<OpenRoute><Login /></OpenRoute>} />
        <Route path='forgot-password' element={<OpenRoute><ForgotPassword /></OpenRoute>} />
        <Route path='update-password/:id' element={<OpenRoute><UpdatePassword /></OpenRoute>} />
        <Route path='verify-email' element={<OpenRoute><VerifyEmail /></OpenRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='catalog/:catalogName' element={<Catalog />} />
        <Route path='courses/:courseId' />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path='dashboard/my-profile' element={<MyProfile />} />
          <Route path='dashboard/Settings' element={<Settings />} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='dashboard/cart' element={<Cart />} />
                <Route path='dashboard/enrolled-courses' element={<EnrolledCourse />} />
              </>
            )
          }
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='dashboard/instructor' element={<Instructor />} />
                <Route path='dashboard/add-course' element={<AddCourse />} />
                <Route path='dashboard/my-courses' element={<MyCourses />} />
                <Route path='dashboard/edit-course/:courseId' element={<EditCourse />} />
              </>
            )
          }
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          <>
            <Route path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          </>
        </Route>
      </Routes>
    </div>
  )
}

export default App