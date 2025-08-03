import React, { useState } from 'react';
import './UserDashboard.css';
import { FiSearch, FiPackage, FiMapPin, FiClock, FiUser } from 'react-icons/fi';

const UserDashboard = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcelData, setParcelData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackParcel = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError(null);
    setParcelData(null);

    try {
      const response = await fetch(`http://localhost:8080/api/parcels/track/${trackingId}`);
      if (!response.ok) {
        throw new Error('Parcel not found');
      }
      const data = await response.json();
      setParcelData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'REGISTERED': return '#fbbf24';
      case 'IN_TRANSIT': return '#3b82f6';
      case 'OUT_FOR_DELIVERY': return '#f59e0b';
      case 'DELIVERED': return '#10b981';
      case 'RETURNED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to RouteMax</h1>
        <p>Track your parcels and manage your logistics</p>
      </div>

      <div className="tracking-card">
        <div className="card-header">
          <FiPackage className="header-icon" />
          <h2>Track Your Parcel</h2>
        </div>
        <div className="tracking-input-container">
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g., TRK12345678901)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTrackParcel()}
            className="tracking-input"
          />
          <button 
            className="track-button" 
            onClick={handleTrackParcel}
            disabled={loading}
          >
            <FiSearch />
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-card">
          <div className="error-content">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {parcelData && (
        <div className="parcel-details-card">
          <div className="card-header">
            <FiPackage className="header-icon" />
            <h2>Parcel Details</h2>
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(parcelData.status) }}
            >
              {parcelData.status.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="parcel-info-grid">
            <div className="info-section">
              <h3><FiPackage /> Package Information</h3>
              <div className="info-row">
                <span className="label">Tracking ID:</span>
                <span className="value">{parcelData.trackingId}</span>
              </div>
              <div className="info-row">
                <span className="label">Description:</span>
                <span className="value">{parcelData.description}</span>
              </div>
              <div className="info-row">
                <span className="label">Weight:</span>
                <span className="value">{parcelData.weight} kg</span>
              </div>
              <div className="info-row">
                <span className="label">Dimensions:</span>
                <span className="value">{parcelData.dimensions} cm</span>
              </div>
              <div className="info-row">
                <span className="label">Category:</span>
                <span className="value">{parcelData.category}</span>
              </div>
              <div className="info-row">
                <span className="label">Value:</span>
                <span className="value">₹{parcelData.value}</span>
              </div>
            </div>

            <div className="info-section">
              <h3><FiUser /> Sender Information</h3>
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{parcelData.senderName}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{parcelData.senderEmail}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{parcelData.senderPhone}</span>
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{parcelData.senderAddress}</span>
              </div>
            </div>

            <div className="info-section">
              <h3><FiUser /> Recipient Information</h3>
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{parcelData.recipientName}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{parcelData.recipientEmail}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{parcelData.recipientPhone}</span>
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{parcelData.recipientAddress}</span>
              </div>
            </div>

            <div className="info-section">
              <h3><FiMapPin /> Tracking Information</h3>
              <div className="info-row">
                <span className="label">Current Location:</span>
                <span className="value">{parcelData.currentLocation || 'In Transit'}</span>
              </div>
              <div className="info-row">
                <span className="label">Priority:</span>
                <span className="value priority-badge priority-{parcelData.priority?.toLowerCase()}">{parcelData.priority}</span>
              </div>
              <div className="info-row">
                <span className="label">Service Type:</span>
                <span className="value">{parcelData.serviceType}</span>
              </div>
              {parcelData.estimatedDeliveryDate && (
                <div className="info-row">
                  <span className="label">Est. Delivery:</span>
                  <span className="value">{parcelData.estimatedDeliveryDate}</span>
                </div>
              )}
            </div>

            <div className="info-section">
              <h3><FiClock /> Timeline</h3>
              <div className="info-row">
                <span className="label">Created:</span>
                <span className="value">{formatDate(parcelData.createdAt)}</span>
              </div>
              <div className="info-row">
                <span className="label">Last Updated:</span>
                <span className="value">{formatDate(parcelData.updatedAt)}</span>
              </div>
              {parcelData.deliveredAt && (
                <div className="info-row">
                  <span className="label">Delivered:</span>
                  <span className="value">{formatDate(parcelData.deliveredAt)}</span>
                </div>
              )}
            </div>

            {parcelData.notes && (
              <div className="info-section full-width">
                <h3>Notes</h3>
                <div className="notes-content">
                  {parcelData.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="quick-actions">
        <div className="quick-action-card">
          <FiPackage className="action-icon" />
          <h3>View All Parcels</h3>
          <p>See all your shipments in one place</p>
        </div>
        <div className="quick-action-card">
          <FiUser className="action-icon" />
          <h3>Update Profile</h3>
          <p>Manage your account settings</p>
        </div>
        <div className="quick-action-card">
          <FiMapPin className="action-icon" />
          <h3>Contact Support</h3>
          <p>Get help with your shipments</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;