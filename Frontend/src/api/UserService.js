import axios from 'axios';

const API = 'http://localhost:8080/api/users';

// Register new user
export const registerUser = (user) => axios.post(`${API}/register`, user);

// User login
export const loginUser = (user) => axios.post(`${API}/login`, user);

// Admin login (uses same endpoint as user, backend decides role)
export const loginAdmin = (user) => axios.post(`${API}/login`, user);

// Admin updates user by ID
export const updateUserByAdmin = (id, updatedUser) =>
  axios.put(`${API}/admin/user/${id}`, updatedUser);

// Get all users (admin dashboard)
export const getAllUsers = () => axios.get(`${API}/all`);

// Delete user by ID
export const deleteUserById = (id) => axios.delete(`${API}/delete/${id}`);