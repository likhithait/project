import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [parcelStats, setParcelStats] = useState({});
  const [showAddParcelModal, setShowAddParcelModal] = useState(false);
  const [showUpdateParcelModal, setShowUpdateParcelModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [trackingId, setTrackingId] = useState('');
  const [trackedParcel, setTrackedParcel] = useState(null);
  const [newParcel, setNewParcel] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    description: '',
    weight: '',
    dimensions: '',
    category: '',
    value: '',
    priority: 'NORMAL',
    serviceType: 'STANDARD',
    status: 'REGISTERED'
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Load users
    axios.get('http://localhost:8080/api/users/all')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));

    // Load parcels
    loadParcels();
    
    // Load parcel statistics
    loadParcelStats();
  }, []);

  const loadParcels = () => {
    axios.get('http://localhost:8080/api/parcels/all')
      .then((res) => setParcels(res.data))
      .catch((err) => console.error(err));
  };

  const loadParcelStats = () => {
    axios.get('http://localhost:8080/api/parcels/stats')
      .then((res) => setParcelStats(res.data))
      .catch((err) => console.error(err));
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:8080/api/users/delete/${id}`)
        .then(() => setUsers(users.filter(user => user.id !== id)))
        .catch((err) => console.error(err));
    }
  };

  const deleteParcel = (id) => {
    if (window.confirm("Are you sure you want to delete this parcel?")) {
      axios.delete(`http://localhost:8080/api/parcels/delete/${id}`)
        .then(() => {
          loadParcels();
          loadParcelStats();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleAddParcel = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/parcels/add', newParcel)
      .then((res) => {
        alert(`Parcel added successfully! Tracking ID: ${res.data.trackingId}`);
        setShowAddParcelModal(false);
        setNewParcel({
          senderName: '',
          senderEmail: '',
          senderPhone: '',
          senderAddress: '',
          recipientName: '',
          recipientEmail: '',
          recipientPhone: '',
          recipientAddress: '',
          description: '',
          weight: '',
          dimensions: '',
          category: '',
          value: '',
          priority: 'NORMAL',
          serviceType: 'STANDARD',
          status: 'REGISTERED'
        });
        loadParcels();
        loadParcelStats();
      })
      .catch((err) => {
        console.error(err);
        alert('Error adding parcel');
      });
  };

  const handleUpdateParcel = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/api/parcels/update/${selectedParcel.id}`, selectedParcel)
      .then(() => {
        alert('Parcel updated successfully!');
        setShowUpdateParcelModal(false);
        setSelectedParcel(null);
        loadParcels();
        loadParcelStats();
      })
      .catch((err) => {
        console.error(err);
        alert('Error updating parcel');
      });
  };

  const handleTrackParcel = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      alert('Please enter a tracking ID');
      return;
    }
    
    axios.get(`http://localhost:8080/api/parcels/track/${trackingId}`)
      .then((res) => {
        setTrackedParcel(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert('Parcel not found with this tracking ID');
        setTrackedParcel(null);
      });
  };

  const updateParcelStatus = (parcel, newStatus) => {
    const statusData = {
      status: newStatus,
      currentLocation: parcel.currentLocation,
      notes: parcel.notes
    };

    axios.put(`http://localhost:8080/api/parcels/status/${parcel.id}`, statusData)
      .then(() => {
        alert('Parcel status updated successfully!');
        loadParcels();
        loadParcelStats();
      })
      .catch((err) => {
        console.error(err);
        alert('Error updating status');
      });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getUserRole = (user) => {
    return user.role || 'user';
  };

  const getStatusColor = (status) => {
    const colors = {
      'REGISTERED': '#6366f1',
      'IN_TRANSIT': '#f59e0b',
      'OUT_FOR_DELIVERY': '#8b5cf6',
      'DELIVERED': '#10b981',
      'RETURNED': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`tab-btn ${activeTab === 'parcels' ? 'active' : ''}`}
            onClick={() => setActiveTab('parcels')}
          >
            📦 Parcels
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="users-management">
          <div className="section-actions">
            <button 
              className="create-user-btn" 
              onClick={() => navigate('/admin/create')}
            >
              + Create User
            </button>
          </div>

          <div className="stats-container">
            <div className="stat-card total-users">
              <div className="stat-header">
                <div className="stat-icon">👥</div>
                <h3 className="stat-title">Total Users</h3>
              </div>
              <p className="stat-value">{users.length}</p>
            </div>
          </div>

          <div className="users-section">
            <div className="section-header">
              <h2 className="section-title">All Users</h2>
              <p className="section-subtitle">Manage user accounts and permissions</p>
            </div>

            {users.length === 0 ? (
              <div className="no-data">
                <p>No users found.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th><center>Actions</center></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          <div className="user-details">
                            <h4>{user.firstName} {user.lastName}</h4>
                            <p>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge role-${getUserRole(user).toLowerCase()}`}>
                          {getUserRole(user)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => navigate(`/admin/update/${user.id}`)}
                          >
                            ✏️ Update
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => deleteUser(user.id)}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'parcels' && (
        <div className="parcels-management">
          <div className="section-actions">
            <button 
              className="create-user-btn" 
              onClick={() => setShowAddParcelModal(true)}
            >
              + Add Parcel
            </button>
            <button 
              className="track-btn" 
              onClick={() => setShowTrackingModal(true)}
            >
              🔍 Track Parcel
            </button>
          </div>

          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">📦</div>
                <h3 className="stat-title">Total Parcels</h3>
              </div>
              <p className="stat-value">{parcelStats.totalParcels || 0}</p>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">🚛</div>
                <h3 className="stat-title">In Transit</h3>
              </div>
              <p className="stat-value">{parcelStats.inTransit || 0}</p>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">✅</div>
                <h3 className="stat-title">Delivered</h3>
              </div>
              <p className="stat-value">{parcelStats.delivered || 0}</p>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">📋</div>
                <h3 className="stat-title">Registered</h3>
              </div>
              <p className="stat-value">{parcelStats.registered || 0}</p>
            </div>
          </div>

          <div className="parcels-section">
            <div className="section-header">
              <h2 className="section-title">All Parcels</h2>
              <p className="section-subtitle">Manage parcel deliveries and tracking</p>
            </div>

            {parcels.length === 0 ? (
              <div className="no-data">
                <p>No parcels found.</p>
              </div>
            ) : (
              <table className="data-table parcels-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Sender</th>
                    <th>Recipient</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((parcel) => (
                    <tr key={parcel.id}>
                      <td>
                        <span className="tracking-id">{parcel.trackingId}</span>
                      </td>
                      <td>
                        <div className="contact-info">
                          <h4>{parcel.senderName}</h4>
                          <p>{parcel.senderEmail}</p>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <h4>{parcel.recipientName}</h4>
                          <p>{parcel.recipientEmail}</p>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(parcel.status) }}
                        >
                          {parcel.status}
                        </span>
                      </td>
                      <td>{formatDate(parcel.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              setShowUpdateParcelModal(true);
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <select 
                            className="status-select"
                            value={parcel.status}
                            onChange={(e) => updateParcelStatus(parcel, e.target.value)}
                          >
                            <option value="REGISTERED">REGISTERED</option>
                            <option value="IN_TRANSIT">IN_TRANSIT</option>
                            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="RETURNED">RETURNED</option>
                          </select>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => deleteParcel(parcel.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Add Parcel Modal */}
      {showAddParcelModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Parcel</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddParcelModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddParcel} className="parcel-form">
              <div className="form-section">
                <h3>Sender Information</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Sender Name"
                    value={newParcel.senderName}
                    onChange={(e) => setNewParcel({...newParcel, senderName: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Sender Email"
                    value={newParcel.senderEmail}
                    onChange={(e) => setNewParcel({...newParcel, senderEmail: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="tel"
                    placeholder="Sender Phone"
                    value={newParcel.senderPhone}
                    onChange={(e) => setNewParcel({...newParcel, senderPhone: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sender Address"
                    value={newParcel.senderAddress}
                    onChange={(e) => setNewParcel({...newParcel, senderAddress: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Recipient Information</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={newParcel.recipientName}
                    onChange={(e) => setNewParcel({...newParcel, recipientName: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Recipient Email"
                    value={newParcel.recipientEmail}
                    onChange={(e) => setNewParcel({...newParcel, recipientEmail: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="tel"
                    placeholder="Recipient Phone"
                    value={newParcel.recipientPhone}
                    onChange={(e) => setNewParcel({...newParcel, recipientPhone: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={newParcel.recipientAddress}
                    onChange={(e) => setNewParcel({...newParcel, recipientAddress: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Parcel Details</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Description"
                    value={newParcel.description}
                    onChange={(e) => setNewParcel({...newParcel, description: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Weight (kg)"
                    value={newParcel.weight}
                    onChange={(e) => setNewParcel({...newParcel, weight: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Dimensions (L×W×H cm)"
                    value={newParcel.dimensions}
                    onChange={(e) => setNewParcel({...newParcel, dimensions: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newParcel.category}
                    onChange={(e) => setNewParcel({...newParcel, category: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    placeholder="Value ($)"
                    value={newParcel.value}
                    onChange={(e) => setNewParcel({...newParcel, value: e.target.value})}
                    required
                  />
                  <select
                    value={newParcel.priority}
                    onChange={(e) => setNewParcel({...newParcel, priority: e.target.value})}
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div className="form-row">
                  <select
                    value={newParcel.serviceType}
                    onChange={(e) => setNewParcel({...newParcel, serviceType: e.target.value})}
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="EXPRESS">Express</option>
                    <option value="OVERNIGHT">Overnight</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddParcelModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Parcel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Parcel Modal */}
      {showUpdateParcelModal && selectedParcel && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Update Parcel</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowUpdateParcelModal(false);
                  setSelectedParcel(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateParcel} className="parcel-form">
              <div className="form-section">
                <h3>Sender Information</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Sender Name"
                    value={selectedParcel.senderName}
                    onChange={(e) => setSelectedParcel({...selectedParcel, senderName: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Sender Email"
                    value={selectedParcel.senderEmail}
                    onChange={(e) => setSelectedParcel({...selectedParcel, senderEmail: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="tel"
                    placeholder="Sender Phone"
                    value={selectedParcel.senderPhone}
                    onChange={(e) => setSelectedParcel({...selectedParcel, senderPhone: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sender Address"
                    value={selectedParcel.senderAddress}
                    onChange={(e) => setSelectedParcel({...selectedParcel, senderAddress: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Recipient Information</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={selectedParcel.recipientName}
                    onChange={(e) => setSelectedParcel({...selectedParcel, recipientName: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Recipient Email"
                    value={selectedParcel.recipientEmail}
                    onChange={(e) => setSelectedParcel({...selectedParcel, recipientEmail: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="tel"
                    placeholder="Recipient Phone"
                    value={selectedParcel.recipientPhone}
                    onChange={(e) => setSelectedParcel({...selectedParcel, recipientPhone: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={selectedParcel.recipientAddress}
                    onChange={(e) => setSelectedParcel({...selectedParcel, recipientAddress: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Parcel Details</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Description"
                    value={selectedParcel.description}
                    onChange={(e) => setSelectedParcel({...selectedParcel, description: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Weight (kg)"
                    value={selectedParcel.weight}
                    onChange={(e) => setSelectedParcel({...selectedParcel, weight: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Dimensions (L×W×H cm)"
                    value={selectedParcel.dimensions}
                    onChange={(e) => setSelectedParcel({...selectedParcel, dimensions: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={selectedParcel.category}
                    onChange={(e) => setSelectedParcel({...selectedParcel, category: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    placeholder="Value ($)"
                    value={selectedParcel.value}
                    onChange={(e) => setSelectedParcel({...selectedParcel, value: e.target.value})}
                    required
                  />
                  <select
                    value={selectedParcel.priority}
                    onChange={(e) => setSelectedParcel({...selectedParcel, priority: e.target.value})}
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div className="form-row">
                  <select
                    value={selectedParcel.serviceType}
                    onChange={(e) => setSelectedParcel({...selectedParcel, serviceType: e.target.value})}
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="EXPRESS">Express</option>
                    <option value="OVERNIGHT">Overnight</option>
                  </select>
                  <select
                    value={selectedParcel.status}
                    onChange={(e) => setSelectedParcel({...selectedParcel, status: e.target.value})}
                  >
                    <option value="REGISTERED">REGISTERED</option>
                    <option value="IN_TRANSIT">IN_TRANSIT</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Current Location"
                    value={selectedParcel.currentLocation || ''}
                    onChange={(e) => setSelectedParcel({...selectedParcel, currentLocation: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={selectedParcel.notes || ''}
                    onChange={(e) => setSelectedParcel({...selectedParcel, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowUpdateParcelModal(false);
                    setSelectedParcel(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit">Update Parcel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Track Parcel</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowTrackingModal(false);
                  setTrackingId('');
                  setTrackedParcel(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleTrackParcel} className="tracking-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Enter Tracking ID"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  required
                />
                <button type="submit">Track</button>
              </div>
            </form>
            
            {trackedParcel && (
              <div className="tracking-result">
                <h3>Parcel Details</h3>
                <div className="tracking-info">
                  <div className="info-row">
                    <span className="label">Tracking ID:</span>
                    <span className="value">{trackedParcel.trackingId}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(trackedParcel.status) }}
                    >
                      {trackedParcel.status}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Sender:</span>
                    <span className="value">{trackedParcel.senderName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Recipient:</span>
                    <span className="value">{trackedParcel.recipientName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Description:</span>
                    <span className="value">{trackedParcel.description}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Current Location:</span>
                    <span className="value">{trackedParcel.currentLocation || 'Not specified'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Created:</span>
                    <span className="value">{formatDate(trackedParcel.createdAt)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Last Updated:</span>
                    <span className="value">{formatDate(trackedParcel.updatedAt)}</span>
                  </div>
                  {trackedParcel.notes && (
                    <div className="info-row">
                      <span className="label">Notes:</span>
                      <span className="value">{trackedParcel.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;