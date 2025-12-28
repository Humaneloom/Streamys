import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Homepage from './pages/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard';
import SuperAdminLogin from './pages/superAdmin/SuperAdminLogin';
import SuperAdminRegister from './pages/superAdmin/SuperAdminRegister';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ChooseUser from './pages/ChooseUser';

const App = () => {
  const { currentRole } = useSelector(state => state.user);

  return (
    <Router>
      {currentRole === null &&
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser visitor="normal" />} />
          <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />

          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
          <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
          <Route path="/Financelogin" element={<LoginPage role="Finance" />} />
          <Route path="/Librarianlogin" element={<LoginPage role="Librarian" />} />
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route path="/superadmin/register" element={<SuperAdminRegister />} />
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

          <Route path="/Adminregister" element={<AdminRegisterPage />} />

          <Route path='*' element={<Navigate to="/" />} />
        </Routes>}

      {currentRole === "Admin" && <AdminDashboard />}
      {currentRole === "Student" && <StudentDashboard />}
      {currentRole === "Teacher" && <TeacherDashboard />}
      {currentRole === "Finance" && <FinanceDashboard />}
      {currentRole === "Librarian" && <LibrarianDashboard />}
      {currentRole === "SuperAdmin" && <SuperAdminDashboard />}
    </Router>
  )
}

export default App