package com.example.demo.controller;

import com.example.demo.model.Feedback;
import com.example.demo.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*") // In production, restrict this to your frontend domain
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // ✅ Submit feedback and send email to admin
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        System.out.println("=== FEEDBACK SUBMISSION STARTED ===");
        System.out.println("Feedback data received: " + feedback.toString());
        
        try {
            // Validate required fields
            if (feedback.getName() == null || feedback.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            
            if (feedback.getEmail() == null || feedback.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            if (feedback.getMessage() == null || feedback.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Feedback message is required");
            }

            // Validate email format
            if (!isValidEmail(feedback.getEmail())) {
                return ResponseEntity.badRequest().body("Please provide a valid email address");
            }

            System.out.println("Feedback validation passed");
            System.out.println("From: " + feedback.getName() + " (" + feedback.getEmail() + ")");
            System.out.println("Subject: " + feedback.getSubject());
            System.out.println("Message: " + feedback.getMessage());
            
            // Send feedback email to admin
            System.out.println("Attempting to send feedback email to admin...");
            try {
                feedbackService.sendFeedbackToAdmin(feedback);
                System.out.println("Feedback email sent successfully to admin");
            } catch (Exception emailException) {
                System.err.println("Failed to send feedback email: " + emailException.getMessage());
                emailException.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send feedback email: " + emailException.getMessage());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback submitted successfully!");
            response.put("status", "success");
            response.put("timestamp", java.time.LocalDateTime.now());
            
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

    // ✅ Test feedback email configuration
    @PostMapping("/test-email")
    public ResponseEntity<?> testFeedbackEmail() {
        try {
            feedbackService.testFeedbackEmailConfiguration();
            return ResponseEntity.ok("Feedback email test initiated. Check logs and admin inbox.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Feedback email test failed: " + e.getMessage());
        }
    }

    // ✅ Get feedback submission status (health check)
    @GetMapping("/status")
    public ResponseEntity<?> getFeedbackStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Feedback Service");
        status.put("status", "Active");
        status.put("timestamp", java.time.LocalDateTime.now());
        status.put("adminEmail", "sahithachunduri0@gmail.com");
        
        return ResponseEntity.ok(status);
    }

    /**
     * Validate email format
     */
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
}