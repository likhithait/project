package com.example.demo.controller;

import com.example.demo.model.Feedback;
import com.example.demo.model.Parcel;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.ParcelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private ParcelRepository parcelRepository;

    // Submit feedback for a delivered parcel
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        System.out.println("=== FEEDBACK SUBMISSION STARTED ===");
        System.out.println("Feedback data received: " + feedback.toString());
        
        try {
            // Validate required fields
            if (feedback.getUserEmail() == null || feedback.getUserEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("User email is required");
            }
            
            if (feedback.getTrackingId() == null || feedback.getTrackingId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Tracking ID is required");
            }
            
            if (feedback.getRating() == null || feedback.getRating() < 1 || feedback.getRating() > 5) {
                return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
            }

            // Check if parcel exists and is delivered
            Optional<Parcel> parcelOpt = parcelRepository.findByTrackingId(feedback.getTrackingId());
            if (parcelOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Parcel not found with this tracking ID");
            }
            
            Parcel parcel = parcelOpt.get();
            if (!"DELIVERED".equals(parcel.getStatus())) {
                return ResponseEntity.badRequest().body("Feedback can only be submitted for delivered parcels");
            }
            
            // Check if user is authorized (sender or recipient)
            if (!feedback.getUserEmail().equals(parcel.getSenderEmail()) && 
                !feedback.getUserEmail().equals(parcel.getRecipientEmail())) {
                return ResponseEntity.badRequest().body("You are not authorized to give feedback for this parcel");
            }
            
            // Check if feedback already exists
            if (feedbackRepository.existsByUserEmailAndTrackingId(feedback.getUserEmail(), feedback.getTrackingId())) {
                return ResponseEntity.badRequest().body("You have already submitted feedback for this parcel");
            }

            System.out.println("Feedback validation passed");
            System.out.println("User: " + feedback.getUserEmail());
            System.out.println("Tracking ID: " + feedback.getTrackingId());
            System.out.println("Rating: " + feedback.getRating());
            
            // Set the parcel reference
            feedback.setParcel(parcel);
            feedback.setCreatedAt(LocalDateTime.now());
            
            // Save feedback
            Feedback savedFeedback = feedbackRepository.save(feedback);
            System.out.println("Feedback saved successfully with ID: " + savedFeedback.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback submitted successfully!");
            response.put("feedbackId", savedFeedback.getId());
            response.put("status", "success");
            response.put("timestamp", LocalDateTime.now());
            
            System.out.println("=== FEEDBACK SUBMISSION COMPLETED ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("=== FEEDBACK SUBMISSION FAILED ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error submitting feedback: " + e.getMessage());
        }
    }
    
    // Check if user can give feedback for a parcel
    @GetMapping("/can-give-feedback/{trackingId}/{userEmail}")
    public ResponseEntity<?> canGiveFeedback(@PathVariable String trackingId, @PathVariable String userEmail) {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Check if parcel exists
            Optional<Parcel> parcelOpt = parcelRepository.findByTrackingId(trackingId);
            if (parcelOpt.isEmpty()) {
                response.put("canGiveFeedback", false);
                response.put("reason", "Parcel not found");
                return ResponseEntity.ok(response);
            }
            
            Parcel parcel = parcelOpt.get();
            
            // Check if parcel is delivered
            if (!"DELIVERED".equals(parcel.getStatus())) {
                response.put("canGiveFeedback", false);
                response.put("reason", "Parcel is not delivered yet");
                return ResponseEntity.ok(response);
            }
            
            // Check if user is authorized
            if (!userEmail.equals(parcel.getSenderEmail()) && !userEmail.equals(parcel.getRecipientEmail())) {
                response.put("canGiveFeedback", false);
                response.put("reason", "Not authorized");
                return ResponseEntity.ok(response);
            }
            
            // Check if feedback already exists
            if (feedbackRepository.existsByUserEmailAndTrackingId(userEmail, trackingId)) {
                response.put("canGiveFeedback", false);
                response.put("reason", "Feedback already submitted");
                response.put("existingFeedback", true);
                return ResponseEntity.ok(response);
            }
            
            response.put("canGiveFeedback", true);
            response.put("reason", "Can submit feedback");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error checking feedback eligibility: " + e.getMessage());
        }
    }
    
    // Get feedback for a specific parcel
    @GetMapping("/parcel/{trackingId}")
    public ResponseEntity<List<Feedback>> getFeedbackByTrackingId(@PathVariable String trackingId) {
        List<Feedback> feedbackList = feedbackRepository.findByTrackingId(trackingId);
        return ResponseEntity.ok(feedbackList);
    }
    
    // Get all feedback by user
    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<Feedback>> getFeedbackByUser(@PathVariable String userEmail) {
        List<Feedback> feedbackList = feedbackRepository.findByUserEmail(userEmail);
        return ResponseEntity.ok(feedbackList);
    }
    
    // Get feedback statistics (for admin)
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getFeedbackStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalFeedback", feedbackRepository.count());
        stats.put("rating1Count", feedbackRepository.countByRating(1));
        stats.put("rating2Count", feedbackRepository.countByRating(2));
        stats.put("rating3Count", feedbackRepository.countByRating(3));
        stats.put("rating4Count", feedbackRepository.countByRating(4));
        stats.put("rating5Count", feedbackRepository.countByRating(5));
        stats.put("lowRatingCount", feedbackRepository.findLowRatingFeedback().size());
        stats.put("highRatingCount", feedbackRepository.findHighRatingFeedback().size());
        
        return ResponseEntity.ok(stats);
    }
    
    // Get recent feedback (for admin dashboard)
    @GetMapping("/recent")
    public ResponseEntity<List<Feedback>> getRecentFeedback() {
        List<Feedback> recentFeedback = feedbackRepository.findRecentFeedback();
        return ResponseEntity.ok(recentFeedback);
    }
    
    // Delete feedback (admin only)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Long id) {
        if (!feedbackRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Feedback not found!");
        }
        feedbackRepository.deleteById(id);
        return ResponseEntity.ok("Feedback deleted successfully!");
    }
}