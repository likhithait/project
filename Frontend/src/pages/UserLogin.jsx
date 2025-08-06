// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../api/UserService.js';
// import './Form.css';

// function UserLogin() {
//   const [credentials, setCredentials] = useState({ email: '', password: '' });
//   const nav = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     // Debug: Log the credentials being sent
//     console.log("Login credentials:", credentials);
    
//     try {
//       const res = await loginUser(credentials);
//       console.log("Login response:", res.data);
      
//       // Store user information in localStorage
//       const userInfo = {
//         email: credentials.email,
//         name: res.data.firstName ? `${res.data.firstName} ${res.data.lastName || ''}`.trim() : res.data.name || 'User',
//         phone: res.data.phone || '',
//         firstName: res.data.firstName || '',
//         lastName: res.data.lastName || '',
//         role: res.data.role || 'USER'
//       };
      
//       localStorage.setItem('userInfo', JSON.stringify(userInfo));
//       console.log("User info stored:", userInfo);
      
//       alert("Login successful"); 
//       nav('/user/dashboard'); 
//     } catch (err) {
//       console.error("Login error:", err);
//       if (err.response) {
//         console.error("Error response:", err.response.data);
//         alert(err.response.data);
//       } else {
//         alert("Login failed");
//       }
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>User Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={credentials.email}
//           onChange={(e) =>
//             setCredentials({ ...credentials, email: e.target.value })
//           }
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={credentials.password}
//           onChange={(e) =>
//             setCredentials({ ...credentials, password: e.target.value })
//           }
//           required
//         />
//         <button type="submit">Login</button>
//       </form>

//       {/* 🔗 Link to Signup */}
//       <p className="link-text">
//         Don't have an account?{' '}
//         <span className="link" onClick={() => nav('/signup')}>
//           Sign up
//         </span>
//       </p>
//     </div>
//   );
// }

// export default UserLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/UserService.js';
import './Form.css';

function UserLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Debug: Log the credentials being sent
    console.log("Login credentials:", credentials);
    
    try {
      const res = await loginUser(credentials);
      console.log("Login response:", res.data);
      
      // Check if user is admin based on response
      if (res.data.role === "ADMIN") {
        // Admin login - store admin info and redirect to admin dashboard
        const adminInfo = {
          email: res.data.email,
          role: "ADMIN"
        };
        localStorage.setItem('userInfo', JSON.stringify(adminInfo));
        console.log("Admin login successful");
        alert("Welcome Admin!");
        nav('/admin/dashboard');
        
      } else {
        // Regular user login - store user info and redirect to user dashboard
        const userInfo = {
          email: credentials.email,
          name: res.data.firstName ? `${res.data.firstName} ${res.data.lastName || ''}`.trim() : res.data.name || 'User',
          phone: res.data.phone || '',
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          role: res.data.role || 'USER'
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log("User info stored:", userInfo);
        alert("Login successful!");
        nav('/user/dashboard');
      }
      
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        alert(err.response.data || "Invalid credentials");
      } else {
        alert("Login failed. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* 🔗 Link to Signup */}
      <p className="link-text">
        Don't have an account?{' '}
        <span className="link" onClick={() => nav('/signup')}>
          Sign up
        </span>
      </p>
      
      {/* 🔗 Link to Forgot Password */}
      <p className="link-text">
        <span className="link" onClick={() => nav('/forgot-password')}>
          Forgot Password?
        </span>
      </p>
    </div>
  );
}

export default UserLogin;