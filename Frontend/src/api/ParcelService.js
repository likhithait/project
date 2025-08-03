import axios from 'axios';

const PARCEL_API = 'http://localhost:8080/api/parcels';

// Add new parcel
export const addParcel = (parcel) => axios.post(`${PARCEL_API}/add`, parcel);

// Get all parcels
export const getAllParcels = () => axios.get(`${PARCEL_API}/all`);

// Track parcel by tracking ID
export const trackParcel = (trackingId) => axios.get(`${PARCEL_API}/track/${trackingId}`);

// Update parcel details
export const updateParcel = (id, updatedParcel) => 
  axios.put(`${PARCEL_API}/update/${id}`, updatedParcel);

// Update only parcel status
export const updateParcelStatus = (id, statusData) => 
  axios.put(`${PARCEL_API}/status/${id}`, statusData);

// Delete parcel
export const deleteParcel = (id) => axios.delete(`${PARCEL_API}/delete/${id}`);

// Get parcels by user email
export const getParcelsByUserEmail = (email) => 
  axios.get(`${PARCEL_API}/user/${email}`);

// Get parcels by status
export const getParcelsByStatus = (status) => 
  axios.get(`${PARCEL_API}/status/${status}`);

// Get parcel statistics
export const getParcelStats = () => axios.get(`${PARCEL_API}/stats`);

// Get recent parcels
export const getRecentParcels = () => axios.get(`${PARCEL_API}/recent`);