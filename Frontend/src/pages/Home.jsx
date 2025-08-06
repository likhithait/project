// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Home.css';

// function Home() {
//   const nav = useNavigate();
  
//   return (
//     <div className="home-container">
//       <div className="header-section">
//         <div className="logo-container">
//           <div className="logo-icon">
//             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <h1 className="title">RouteMax</h1>
//         </div>
        
//         <div className="feature-icons">
//           <div className="feature-icon" title="Route Optimization">
//             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M21 10C21 17 12 23 12 23S3 17 3 10A9 9 0 0 1 21 10Z" stroke="currentColor" strokeWidth="2"/>
//               <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
//             </svg>
//           </div>
          
//           <div className="feature-icon" title="Fleet Management">
//             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M7 17M17 17M5 17H19L21 12V8L19 7H11L9 12H5V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
//               <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
//             </svg>
//           </div>
          
//           <div className="feature-icon" title="Real-time Tracking">
//             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
//               <path d="M16.24 7.76A6 6 0 0 1 19.07 19.07A6 6 0 0 1 7.76 16.24A6 6 0 1 1 16.24 7.76Z" stroke="currentColor" strokeWidth="2"/>
//               <path d="M12 1V3" stroke="currentColor" strokeWidth="2"/>
//               <path d="M12 21V23" stroke="currentColor" strokeWidth="2"/>
//               <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2"/>
//               <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2"/>
//               <path d="M1 12H3" stroke="currentColor" strokeWidth="2"/>
//               <path d="M21 12H23" stroke="currentColor" strokeWidth="2"/>
//               <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2"/>
//               <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2"/>
//             </svg>
//           </div>
          
//           <div className="feature-icon" title="Analytics Dashboard">
//             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//         </div>
        
//         <p>Optimize your logistics with intelligent route planning and seamless management solutions</p>
//       </div>
      
//       <div className="card-container">
//         <div className="card" onClick={() => nav('/login')}>
//           <h2>User Portal</h2>
//           <p>Access your route planning dashboard and manage your logistics operations</p>
//         </div>
        
//         <div className="card" onClick={() => nav('/admin')}>
//           <h2>Admin Portal</h2>
//           <p>Comprehensive system administration and advanced configuration controls</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const nav = useNavigate();
  
  return (
    <div className="home-container">
      <div className="header-section">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="title">RouteMax</h1>
        </div>
        
        <div className="feature-icons">
          <div className="feature-icon" title="Route Optimization">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23S3 17 3 10A9 9 0 0 1 21 10Z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className="feature-icon" title="Fleet Management">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17M17 17M5 17H19L21 12V8L19 7H11L9 12H5V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className="feature-icon" title="Real-time Tracking">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M16.24 7.76A6 6 0 0 1 19.07 19.07A6 6 0 0 1 7.76 16.24A6 6 0 1 1 16.24 7.76Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1V3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 21V23" stroke="currentColor" strokeWidth="2"/>
              <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2"/>
              <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2"/>
              <path d="M1 12H3" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 12H23" stroke="currentColor" strokeWidth="2"/>
              <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2"/>
              <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className="feature-icon" title="Analytics Dashboard">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <p>Optimize your logistics with intelligent route planning and seamless management solutions</p>
      </div>
      
      <div className="card-container">
        <div className="card main-card" onClick={() => nav('/login')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Access Dashboard</h2>
          <p>Login to access your dashboard</p>
          <div className="card-footer">
            <span className="access-note"></span>
          </div>
        </div>
        
        {/* <div className="card info-card" onClick={() => nav('/about')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9.09 9A3 3 0 0 1 12 6A3 3 0 0 1 15 9" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 17V12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Learn More</h2>
          <p>Discover RouteMax features, pricing, and how our platform can optimize your operations</p>
          <div className="card-footer">
            <span className="access-note">• No login required</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Home;