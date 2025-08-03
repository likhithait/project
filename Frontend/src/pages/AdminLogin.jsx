import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api/UserService';
import './Form.css';

function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(credentials);
      console.log("Login response:", res.data);

      if (res.data.role === "ADMIN") {
        alert("Login successful");
        navigate("/admin/dashboard");
      } else {
        alert("You are not admin");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check credentials and try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          required
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;