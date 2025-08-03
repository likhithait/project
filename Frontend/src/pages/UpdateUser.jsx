// src/pages/UpdateUser.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { updateUserByAdmin } from "../api/UserService";
import axios from 'axios';
import './UpdateUser.css';

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/users/admin/user/${id}`);
        setUser(response.data);
        setError('');
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await updateUserByAdmin(id, user);
      setSuccess('User updated successfully!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Update failed:', error);
      setError(error.response?.data?.message || 'User update failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <div className="update-user-container">
        <div className="update-user-wrapper">
          <div className="form-card">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p>Loading user details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="update-user-container">
      <div className="update-user-wrapper">
        
        <div className="page-header">
          <h1 className="page-title">Update User</h1>
          <p className="page-subtitle">Modify user information and permissions</p>
        </div>

        <div className="form-card">
          {user.firstName && (
            <div className="user-info-card">
              <h3 className="user-info-title">Currently Editing</h3>
              <div className="user-info-content">
                {user.firstName} {user.lastName} - {user.email}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={submitting}
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">User Role</label>
              <select
                className="form-select"
                name="role"
                value={user.role}
                onChange={handleChange}
                required
                disabled={submitting}
              >
                <option value="">Select Role</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/dashboard')}
                disabled={submitting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Updating...
                  </>
                ) : (
                  <>💾 Update User</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;