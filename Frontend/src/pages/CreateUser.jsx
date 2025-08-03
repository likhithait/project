// src/pages/CreateUser.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './CreateUser.css';

const CreateUser = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const getPasswordStrength = (password) => {
    if (!password) return { strength: '', score: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score < 2) return { strength: 'weak', score };
    if (score < 3) return { strength: 'medium', score };
    if (score < 4) return { strength: 'good', score };
    return { strength: 'strong', score };
  };

  const passwordStrength = getPasswordStrength(user.password);

  const getFormProgress = () => {
    const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    const completedFields = fields.filter(field => user[field].trim() !== '');
    return (completedFields.length / fields.length) * 100;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!user.firstName.trim()) errors.firstName = 'First name is required';
    if (!user.lastName.trim()) errors.lastName = 'Last name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email.trim()) errors.email = 'Email is required';
    else if (!emailRegex.test(user.email)) errors.email = 'Invalid email';
    if (!user.password) errors.password = 'Password is required';
    else if (user.password.length < 6) errors.password = 'Min 6 characters';
    if (!user.confirmPassword) errors.confirmPassword = 'Confirm password';
    else if (user.password !== user.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    setFieldErrors({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitting(false);
      return;
    }
    try {
      const { confirmPassword, ...userData } = user;
      await axios.post('http://localhost:8080/api/users/register', userData);
      setSuccess('User created successfully! Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (error) {
      if (error.response?.data?.message) setError(error.response.data.message);
      else if (error.response?.status === 409) setError('User with this email already exists');
      else setError('User creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  const formProgress = getFormProgress();

  return (
    <div className="create-user-container">
      <div className="create-user-wrapper">
        <Link to="/admin/dashboard" className="back-link">← Back to Dashboard</Link>
        <div className="page-header">
          <h1 className="page-title">Create New User</h1>
          <p className="page-subtitle">Add a new user to the system</p>
        </div>

        <div className="form-card">
          <div className="form-progress">
            <div className="progress-title">Form Completion</div>
            <div className="progress-steps">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`progress-step ${(formProgress / 100) * 5 > index ? 'completed' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="form-tips">
            <h3 className="tips-title">💡 Tips for creating a user</h3>
            <ul className="tips-list">
              <li>Use a strong password with at least 8 characters</li>
              <li>Include uppercase, lowercase, numbers, and special characters</li>
              <li>Make sure the email address is valid and unique</li>
              <li>Double-check all information before submitting</li>
            </ul>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="create-form">
            <div className={`form-group ${fieldErrors.firstName ? 'has-error' : ''}`}>
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
              {fieldErrors.firstName && <div className="field-error">{fieldErrors.firstName}</div>}
            </div>

            <div className={`form-group ${fieldErrors.lastName ? 'has-error' : ''}`}>
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
              {fieldErrors.lastName && <div className="field-error">{fieldErrors.lastName}</div>}
            </div>

            <div className={`form-group ${fieldErrors.email ? 'has-error' : ''}`}>
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
              {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
            </div>

            <div className={`form-group ${fieldErrors.password ? 'has-error' : ''}`}>
              <label className="form-label">Password</label>
              <div className="password-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                  disabled={submitting}
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
              {user.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill strength-${passwordStrength.strength}`}></div>
                  </div>
                  <div className="strength-text">
                    Password strength: {passwordStrength.strength || 'Very weak'}
                  </div>
                </div>
              )}
              {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
            </div>

            <div className={`form-group ${fieldErrors.confirmPassword ? 'has-error' : ''}`}>
              <label className="form-label">Confirm Password</label>
              <div className="password-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                  disabled={submitting}
                >
                  {showConfirmPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
              {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
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
                {submitting ? (<><div className="loading-spinner"></div>Creating User...</>) : '✨ Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;