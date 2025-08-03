import React, { useState } from 'react';
import { registerUser } from '../api/UserService';
import './Form.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '' 
  });
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Log the form data being sent
    console.log("Form data being sent:", formData);
    
    try {
      const res = await registerUser(formData);
      console.log("Registration response:", res.data);
      alert(res.data); // Success message from backend
      nav('/login');   // Navigate to login page after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        alert(err.response.data); // Show backend error (e.g. "Email already exists!")
      } else {
        alert("Registration failed.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="First Name" 
          value={formData.firstName}
          required 
          onChange={e => setFormData({ ...formData, firstName: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          value={formData.lastName}
          required 
          onChange={e => setFormData({ ...formData, lastName: e.target.value })} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email}
          required 
          onChange={e => setFormData({ ...formData, email: e.target.value })} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={formData.password}
          required 
          onChange={e => setFormData({ ...formData, password: e.target.value })} 
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Signup;