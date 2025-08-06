package com.example.demo.controller;

import com.example.demo.model.SupportRequest;
import com.example.demo.service.SupportService;
import com.example.demo.repository.SupportRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
public class SupportController {

    private static final Logger logger = LoggerFactory.getLogger(SupportController.class);

    @Autowired
    private SupportService supportService;

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    /**
     * Submit a new support request
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitSupportRequest(@RequestBody Map<String, String> requestData) {
        logger.info("Received support request submission");
        
        try {
            // Extract data from request
            String name = requestData.get("name");
            String email = requestData.get("email");
            String phone = requestData.get("phone");
            String subject = requestData.get("subject");
            String message = requestData.get("message");
            String issueType = requestData.get("issueType");
            String priority = requestData.get("priority");
            String trackingId = requestData.get("trackingId");

            logger.info("Support request from: {} ({})", name, email);

            // Validate required fields
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Message is required");
            }

            // Create support request object
            SupportRequest supportRequest = new SupportRequest();
            supportRequest.setName(name.trim());
            supportRequest.setEmail(email.trim().toLowerCase());
            supportRequest.setPhone(phone != null ? phone.trim() : null);
            supportRequest.setSubject(subject != null ? subject.trim() : null);
            supportRequest.setMessage(message.trim());
            supportRequest.setIssueType(issueType != null ? issueType.trim() : "GENERAL");
            supportRequest.setPriority(priority != null ? priority.trim() : "MEDIUM");
            supportRequest.setTrackingId(trackingId != null ? trackingId.trim() : null);
            supportRequest.setCreatedAt(LocalDateTime.now());
            supportRequest.setStatus("OPEN");

            // Save to database
            logger.info("Saving support request to database...");
            SupportRequest savedRequest = supportRequestRepository.save(supportRequest);
            logger.info("Support request saved with ID: {}", savedRequest.getId());

            // Send email notifications
            logger.info("Sending support request emails...");
            supportService.sendSupportRequest(savedRequest);

            logger.info("Support request processed successfully for: {}", email);
            return ResponseEntity.ok("Support request submitted successfully. You will receive a confirmation email shortly.");

        } catch (IllegalArgumentException e) {
            logger.error("Validation error in support request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error processing support request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to submit support request. Please try again later.");
        }
    }

    /**
     * Get all support requests for admin (optional endpoint)
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<SupportRequest>> getAllSupportRequests() {
        logger.info("Admin requesting all support requests");
        
        try {
            List<SupportRequest> requests = supportRequestRepository.findAllByOrderByCreatedAtDesc();
            logger.info("Retrieved {} support requests", requests.size());
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error retrieving support requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get support requests by user email
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<List<SupportRequest>> getUserSupportRequests(@PathVariable String email) {
        logger.info("Retrieving support requests for user: {}", email);
        
        try {
            List<SupportRequest> requests = supportRequestRepository.findByEmailOrderByCreatedAtDesc(email.toLowerCase());
            logger.info("Retrieved {} support requests for user: {}", requests.size(), email);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error retrieving support requests for user: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Update support request status (for admin use)
     */
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<String> updateSupportRequestStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusData) {
        
        logger.info("Admin updating support request {} status", id);
        
        try {
            SupportRequest request = supportRequestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Support request not found"));

            String newStatus = statusData.get("status");
            String adminResponse = statusData.get("adminResponse");

            request.setStatus(newStatus);
            if (adminResponse != null && !adminResponse.trim().isEmpty()) {
                request.setAdminResponse(adminResponse.trim());
            }
            
            if ("RESOLVED".equalsIgnoreCase(newStatus) || "CLOSED".equalsIgnoreCase(newStatus)) {
                request.setResolvedAt(LocalDateTime.now());
            }

            supportRequestRepository.save(request);
            logger.info("Support request {} status updated to: {}", id, newStatus);
            
            return ResponseEntity.ok("Support request status updated successfully");
        } catch (Exception e) {
            logger.error("Error updating support request status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update support request status");
        }
    }

    /**
     * Test endpoint to verify API is working
     */
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        logger.info("Support API test endpoint called");
        return ResponseEntity.ok("Support API is working!");
    }
}