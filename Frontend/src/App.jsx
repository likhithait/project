import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Signup from './pages/Signup';
import UpdateUser from './pages/UpdateUser';      
import CreateUser from './pages/CreateUser';      
import './App.css';
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<CreateUser />} />      
        <Route path="/admin/update/:id" element={<UpdateUser />} />  
        <Route path="/signup" element={<Signup />} />
        <Route path = "/user/dashboard" element = {<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;