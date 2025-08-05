package com.example.demo.repository;

import com.example.demo.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Find feedback by user email and tracking ID
    Optional<Feedback> findByUserEmailAndTrackingId(String userEmail, String trackingId);

    // Find all feedback for a specific tracking ID
    List<Feedback> findByTrackingId(String trackingId);

    // Find all feedback by user email
    List<Feedback> findByUserEmail(String userEmail);

    // Check if feedback already exists for a user and tracking ID
    boolean existsByUserEmailAndTrackingId(String userEmail, String trackingId);

    // Find feedback by rating
    List<Feedback> findByRating(Integer rating);

    // Find feedback with low ratings (1-2)
    @Query("SELECT f FROM Feedback f WHERE f.rating <= 2")
    List<Feedback> findLowRatingFeedback();

    // Find feedback with high ratings (4-5)
    @Query("SELECT f FROM Feedback f WHERE f.rating >= 4")
    List<Feedback> findHighRatingFeedback();

    // Get average rating for a tracking ID
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.trackingId = :trackingId")
    Double getAverageRatingByTrackingId(@Param("trackingId") String trackingId);

    // Count feedback by rating
    Long countByRating(Integer rating);

    // Find recent feedback (for admin dashboard) - Limited to 20 most recent
    @Query("SELECT f FROM Feedback f ORDER BY f.createdAt DESC LIMIT 20")
    List<Feedback> findRecentFeedback();
}