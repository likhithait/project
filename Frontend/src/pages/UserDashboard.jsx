import React, { useState } from 'react';
import './UserDashboard.css';
import { FiSearch, FiPackage, FiMapPin, FiClock, FiUser, FiMessageSquare, FiSend, FiX } from 'react-icons/fi';

const UserDashboard = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcelData, setParcelData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simplified feedback form state - only message needed
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);

  // User parcels modal state
  const [showParcelsModal, setShowParcelsModal] = useState(false);
  const [userParcels, setUserParcels] = useState([]);
  const [parcelsLoading, setParcelsLoading] = useState(false);
  const [parcelsError, setParcelsError] = useState(null);

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

  const handleViewParcels = async () => {
    // Get user email from localStorage - using fallback for demo
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{"email": "demo@example.com"}');
    const userEmail = userInfo.email;

    if (!userEmail) {
      setParcelsError('User email not found. Please login again.');
      return;
    }

    setParcelsLoading(true);
    setParcelsError(null);
    setShowParcelsModal(true);

    try {
      const response = await fetch(`http://localhost:8080/api/parcels/user/${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to fetch parcels');
      }
      const data = await response.json();
      setUserParcels(data);
    } catch (error) {
      setParcelsError(error.message);
      setUserParcels([]);
    } finally {
      setParcelsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackMessage.trim()) {
      setFeedbackError('Please enter your feedback message');
      return;
    }

    // Get user info from localStorage - Note: This won't work in Claude artifacts
    // In your actual app, this will work fine
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    // Prepare feedback data with localStorage info and defaults
    const feedbackData = {
      name: userInfo.name || 'Anonymous User',
      email: userInfo.email || 'anonymous@example.com',
      phone: userInfo.phone || '',
      subject: 'User Feedback',
      message: feedbackMessage,
      feedbackType: 'GENERAL',
      priority: 'MEDIUM'
    };

    setFeedbackLoading(true);
    setFeedbackError(null);
    setFeedbackSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setFeedbackSuccess(true);
      setFeedbackMessage('');
    } catch (error) {
      setFeedbackError(error.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const closeModal = () => {
    setShowParcelsModal(false);
    setUserParcels([]);
    setParcelsError(null);
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

      {/* Updated Feedback Container with similar structure to tracking input */}
      <div className="tracking-card">
        <div className="card-header">
          <FiMessageSquare className="header-icon" />
          <h2>Submit Feedback</h2>
        </div>
        <div className="tracking-input-container">
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <textarea
              placeholder="Share your feedback, suggestions, or report any issues..."
              value={feedbackMessage}
              onChange={(e) => {
                setFeedbackMessage(e.target.value);
                setFeedbackError(null);
                setFeedbackSuccess(false);
              }}
              className="feedback-textarea"
              required
            />
            <button 
              type="submit" 
              className="feedback-submit-button"
              disabled={feedbackLoading}
            >
              <FiSend />
              {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        {feedbackSuccess && (
          <div className="success-card">
            <div className="success-content">
              <strong>Success:</strong> Your feedback has been submitted successfully!
            </div>
          </div>
        )}

        {feedbackError && (
          <div className="error-card">
            <div className="error-content">
              <strong>Error:</strong> {feedbackError}
            </div>
          </div>
        )}
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
        <div className="quick-action-card" onClick={handleViewParcels}>
          <FiPackage className="action-icon" />
          <h3>View All Parcels</h3>
          <p>See all your shipments in one place</p>
        </div>
        <div className="quick-action-card">
          <FiUser className="action-icon" />
          <h3>Update Profile</h3>
          <p>Manage your account settings</p>
        </div>
      </div>

      {/* User Parcels Modal */}
      {showParcelsModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Your Parcels</h2>
              <button className="close-button" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              {parcelsLoading && (
                <div className="loading-message">
                  <FiPackage className="loading-icon" />
                  Loading your parcels...
                </div>
              )}

              {parcelsError && (
                <div className="error-message">
                  <strong>Error:</strong> {parcelsError}
                </div>
              )}

              {!parcelsLoading && !parcelsError && userParcels.length === 0 && (
                <div className="no-parcels-message">
                  <FiPackage className="no-parcels-icon" />
                  <p>No parcels found for your account.</p>
                </div>
              )}

              {!parcelsLoading && userParcels.length > 0 && (
                <div className="parcels-list">
                  {userParcels.map((parcel) => (
                    <div key={parcel.id} className="parcel-item">
                      <div className="parcel-item-header">
                        <div className="tracking-info">
                          <strong>Tracking ID:</strong> {parcel.trackingId}
                        </div>
                        <div 
                          className="status-badge-small"
                          style={{ backgroundColor: getStatusColor(parcel.status) }}
                        >
                          {parcel.status.replace(/_/g, ' ')}
                        </div>
                      </div>
                      
                      <div className="parcel-item-details">
                        <div className="detail-row">
                          <span className="detail-label">Sender:</span>
                          <span className="detail-value">{parcel.senderName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Recipient:</span>
                          <span className="detail-value">{parcel.recipientName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Description:</span>
                          <span className="detail-value">{parcel.description}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Created:</span>
                          <span className="detail-value">{formatDate(parcel.createdAt)}</span>
                        </div>
                        {parcel.currentLocation && (
                          <div className="detail-row">
                            <span className="detail-label">Current Location:</span>
                            <span className="detail-value">{parcel.currentLocation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;