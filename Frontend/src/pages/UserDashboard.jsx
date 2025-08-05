import React, { useState, useEffect } from 'react';
import { FiSearch, FiPackage, FiMapPin, FiClock, FiUser, FiMessageSquare, FiSend, FiX, FiStar, FiTruck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './UserDashboard.css';

const UserDashboard = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcelData, setParcelData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add animation state for cards
  const [isVisible, setIsVisible] = useState(false);

  // User parcels modal state
  const [showParcelsModal, setShowParcelsModal] = useState(false);
  const [userParcels, setUserParcels] = useState([]);
  const [parcelsLoading, setParcelsLoading] = useState(false);
  const [parcelsError, setParcelsError] = useState(null);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    remarks: ''
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Add fade-in animation on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    // Get user email from localStorage
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

  const checkFeedbackEligibility = async (parcel) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userEmail = userInfo.email;

    try {
      const response = await fetch(`http://localhost:8080/api/feedback/can-give-feedback/${parcel.trackingId}/${userEmail}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking feedback eligibility:', error);
      return { canGiveFeedback: false, reason: 'Error checking eligibility' };
    }
  };

  const handleGiveFeedback = async (parcel) => {
    const eligibility = await checkFeedbackEligibility(parcel);
    
    if (!eligibility.canGiveFeedback) {
      alert(eligibility.reason || 'Cannot give feedback for this parcel');
      return;
    }

    setSelectedParcel(parcel);
    setFeedbackData({ rating: 0, remarks: '' });
    setFeedbackError(null);
    setFeedbackSuccess(false);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (feedbackData.rating === 0) {
      setFeedbackError('Please select a rating');
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userEmail = userInfo.email;

    const submitData = {
      userEmail: userEmail,
      trackingId: selectedParcel.trackingId,
      rating: feedbackData.rating,
      remarks: feedbackData.remarks
    };

    setFeedbackLoading(true);
    setFeedbackError(null);

    try {
      const response = await fetch('http://localhost:8080/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to submit feedback');
      }

      setFeedbackSuccess(true);
      setTimeout(() => {
        closeFeedbackModal();
      }, 2000);

    } catch (error) {
      setFeedbackError(error.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const closeParcelsModal = () => {
    setShowParcelsModal(false);
    setUserParcels([]);
    setParcelsError(null);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedParcel(null);
    setFeedbackData({ rating: 0, remarks: '' });
    setFeedbackError(null);
    setFeedbackSuccess(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'REGISTERED': return <FiPackage />;
      case 'IN_TRANSIT': return <FiTruck />;
      case 'OUT_FOR_DELIVERY': return <FiMapPin />;
      case 'DELIVERED': return <FiCheckCircle />;
      case 'RETURNED': return <FiAlertCircle />;
      default: return <FiPackage />;
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

  const renderStarRating = (currentRating, onRatingChange) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`star ${star <= currentRating ? 'filled' : ''}`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`dashboard-container ${isVisible ? 'fade-in' : ''}`}>
      <div className="dashboard-content">
        {/* Header with enhanced animation */}
        <div className="header">
          <h1>Welcome to RouteMax</h1>
          <p>Track your parcels and manage your logistics with intelligent route planning</p>
        </div>

        {/* Track Parcel Card */}
        <div className="track-parcel-card">
          <div className="card-header">
            <FiPackage className="header-icon" />
            <h2>Track Your Parcel</h2>
          </div>
          <div className="track-input-container">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g., TRK12345678901)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTrackParcel()}
              className="track-input"
            />
            <button 
              onClick={handleTrackParcel}
              disabled={loading}
              className="track-button"
            >
              <FiSearch />
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-container">
            <FiAlertCircle className="error-icon" />
            <div>
              <strong>Error:</strong> <span>{error}</span>
            </div>
          </div>
        )}

        {/* Parcel Details */}
        {parcelData && (
          <div className="parcel-details-card animate-slide-up">
            <div className="parcel-header">
              <div className="parcel-title">
                <FiPackage className="header-icon" />
                <h2>Parcel Details</h2>
              </div>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(parcelData.status) }}
              >
                {getStatusIcon(parcelData.status)}
                <span>{parcelData.status.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="parcel-info-grid">
              {/* Package Information */}
              <div className="info-section">
                <h3 className="section-title">
                  <FiPackage /> Package Information
                </h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Tracking ID:</span>
                    <span className="info-value">{parcelData.trackingId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Description:</span>
                    <span className="info-value">{parcelData.description}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Weight:</span>
                    <span className="info-value">{parcelData.weight} kg</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Value:</span>
                    <span className="info-value">₹{parcelData.value}</span>
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              <div className="info-section">
                <h3 className="section-title">
                  <FiMapPin /> Tracking Information
                </h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Current Location:</span>
                    <span className="info-value">{parcelData.currentLocation || 'In Transit'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Priority:</span>
                    <span className="info-value priority-badge priority-{parcelData.priority?.toLowerCase()}">{parcelData.priority}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Created:</span>
                    <span className="info-value">{formatDate(parcelData.createdAt)}</span>
                  </div>
                  {parcelData.estimatedDelivery && (
                    <div className="info-item">
                      <span className="info-label">Est. Delivery:</span>
                      <span className="info-value">{formatDate(parcelData.estimatedDelivery)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar for Status */}
            <div className="status-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: getProgressWidth(parcelData.status),
                    backgroundColor: getStatusColor(parcelData.status)
                  }}
                ></div>
              </div>
              <div className="progress-labels">
                <span className={parcelData.status === 'REGISTERED' ? 'active' : ''}>Registered</span>
                <span className={['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(parcelData.status) ? 'active' : ''}>In Transit</span>
                <span className={['OUT_FOR_DELIVERY', 'DELIVERED'].includes(parcelData.status) ? 'active' : ''}>Out for Delivery</span>
                <span className={parcelData.status === 'DELIVERED' ? 'active' : ''}>Delivered</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions-grid">
          <div className="action-card" onClick={handleViewParcels}>
            <FiPackage className="action-icon" />
            <h3>View All Parcels</h3>
            <p>See all your shipments in one place</p>
            <div className="action-overlay">
              <FiPackage />
            </div>
          </div>
          <div className="action-card">
            <FiUser className="action-icon user-icon" />
            <h3>Update Profile</h3>
            <p>Manage your account settings</p>
            <div className="action-overlay">
              <FiUser />
            </div>
          </div>
          <div className="action-card">
            <FiMessageSquare className="action-icon support-icon" />
            <h3>Support Center</h3>
            <p>Get help with your shipments</p>
            <div className="action-overlay">
              <FiMessageSquare />
            </div>
          </div>
        </div>

        {/* User Parcels Modal */}
        {showParcelsModal && (
          <div className="modal-overlay" onClick={closeParcelsModal}>
            <div className="modal-content animate-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2><FiPackage className="modal-icon" /> Your Parcels</h2>
                <button onClick={closeParcelsModal} className="close-button">
                  <FiX />
                </button>
              </div>
              
              <div className="modal-body">
                {parcelsLoading && (
                  <div className="loading-container">
                    <div className="loading-spinner">
                      <FiPackage className="loading-icon spinning" />
                    </div>
                    <p>Loading your parcels...</p>
                  </div>
                )}

                {parcelsError && (
                  <div className="error-container">
                    <FiAlertCircle className="error-icon" />
                    <div>
                      <strong>Error:</strong> <span>{parcelsError}</span>
                    </div>
                  </div>
                )}

                {!parcelsLoading && !parcelsError && userParcels.length === 0 && (
                  <div className="empty-container">
                    <FiPackage className="empty-icon" />
                    <h3>No parcels found</h3>
                    <p>No parcels found for your account.</p>
                  </div>
                )}

                {!parcelsLoading && userParcels.length > 0 && (
                  <div className="parcels-list">
                    {userParcels.map((parcel, index) => (
                      <div key={parcel.id} className="parcel-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="parcel-item-header">
                          <div className="parcel-tracking">
                            <strong>Tracking ID:</strong> {parcel.trackingId}
                          </div>
                          <div className="parcel-actions">
                            <div 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(parcel.status) }}
                            >
                              {getStatusIcon(parcel.status)}
                              <span>{parcel.status.replace(/_/g, ' ')}</span>
                            </div>
                            {parcel.status === 'DELIVERED' && (
                              <button
                                onClick={() => handleGiveFeedback(parcel)}
                                className="feedback-button"
                              >
                                <FiStar />
                                Give Feedback
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="parcel-item-details">
                          <div><span className="detail-label">Sender:</span> {parcel.senderName}</div>
                          <div><span className="detail-label">Recipient:</span> {parcel.recipientName}</div>
                          <div><span className="detail-label">Description:</span> {parcel.description}</div>
                          <div><span className="detail-label">Created:</span> {formatDate(parcel.createdAt)}</div>
                          {parcel.currentLocation && (
                            <div><span className="detail-label">Current Location:</span> {parcel.currentLocation}</div>
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

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="modal-overlay" onClick={closeFeedbackModal}>
            <div className="feedback-modal animate-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2><FiStar className="modal-icon" /> Give Feedback</h2>
                <button onClick={closeFeedbackModal} className="close-button">
                  <FiX />
                </button>
              </div>

              {selectedParcel && (
                <div className="selected-parcel-info">
                  <p>
                    <strong>Tracking ID:</strong> {selectedParcel.trackingId}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedParcel.description}
                  </p>
                </div>
              )}

              {feedbackSuccess ? (
                <div className="success-container">
                  <FiCheckCircle className="success-icon" />
                  <h3>Thank you for your feedback!</h3>
                  <p>Your feedback has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                  <div className="rating-container">
                    <label>Rating *</label>
                    {renderStarRating(feedbackData.rating, (rating) => setFeedbackData({...feedbackData, rating}))}
                    <span className="rating-text">
                      {feedbackData.rating === 0 && "Please select a rating"}
                      {feedbackData.rating === 1 && "Poor"}
                      {feedbackData.rating === 2 && "Fair"}
                      {feedbackData.rating === 3 && "Good"}
                      {feedbackData.rating === 4 && "Very Good"}
                      {feedbackData.rating === 5 && "Excellent"}
                    </span>
                  </div>

                  <div className="remarks-container">
                    <label>Remarks (Optional)</label>
                    <textarea
                      value={feedbackData.remarks}
                      onChange={(e) => setFeedbackData({...feedbackData, remarks: e.target.value})}
                      placeholder="Share your experience with our service..."
                      rows={4}
                      className="remarks-textarea"
                    />
                  </div>

                  {feedbackError && (
                    <div className="error-container">
                      <FiAlertCircle className="error-icon" />
                      <span>{feedbackError}</span>
                    </div>
                  )}

                  <div className="feedback-actions">
                    <button
                      type="button"
                      onClick={closeFeedbackModal}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={feedbackLoading}
                      className="submit-button"
                    >
                      <FiSend />
                      {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to get progress width based on status
  function getProgressWidth(status) {
    switch (status) {
      case 'REGISTERED': return '25%';
      case 'IN_TRANSIT': return '50%';
      case 'OUT_FOR_DELIVERY': return '75%';
      case 'DELIVERED': return '100%';
      default: return '0%';
    }
  }
};

export default UserDashboard;