package com.example.demo.controller;

import com.example.demo.model.Parcel;
import com.example.demo.repository.ParcelRepository;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/parcels")
@CrossOrigin(origins = "*")
public class ParcelController {

    @Autowired
    private ParcelRepository parcelRepository;

    @Autowired
    private NotificationService notificationService;

    //  Test email configuration
    @PostMapping("/test-email")
    public ResponseEntity<?> testEmailConfiguration() {
        try {
            notificationService.testEmailConfiguration();
            return ResponseEntity.ok("Email test initiated. Check logs and your inbox.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Email test failed: " + e.getMessage());
        }
    }

    //  Create a new parcel with enhanced logging
    @PostMapping("/add")
    public ResponseEntity<?> addParcel(@RequestBody Parcel parcel) {
        System.out.println("=== PARCEL CREATION STARTED ===");
        System.out.println("Parcel data received: " + parcel.toString());
        
        try {
            // Validate required fields
            if (parcel.getSenderEmail() == null || parcel.getRecipientEmail() == null) {
                return ResponseEntity.badRequest().body("Sender and recipient emails are required");
            }

            // Generate unique tracking ID
            String trackingId = generateTrackingId();
            parcel.setTrackingId(trackingId);
            parcel.setCreatedAt(LocalDateTime.now());
            parcel.setUpdatedAt(LocalDateTime.now());
            
            System.out.println("Generated tracking ID: " + trackingId);
            System.out.println("Sender email: " + parcel.getSenderEmail());
            System.out.println("Recipient email: " + parcel.getRecipientEmail());
            
            // Save parcel first
            Parcel savedParcel = parcelRepository.save(parcel);
            System.out.println("Parcel saved successfully with ID: " + savedParcel.getId());
            
            // Send notification to sender and recipient
            System.out.println("Attempting to send email notifications...");
            try {
                notificationService.sendParcelRegisteredNotification(savedParcel);
                System.out.println("Email notification service called successfully");
            } catch (Exception emailException) {
                System.err.println("Email notification failed: " + emailException.getMessage());
                emailException.printStackTrace();
                // Don't fail the entire operation if email fails
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Parcel added successfully!");
            response.put("trackingId", trackingId);
            response.put("parcel", savedParcel);
            response.put("emailStatus", "Email notification attempted - check logs for details");
            
            System.out.println("=== PARCEL CREATION COMPLETED ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("=== PARCEL CREATION FAILED ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding parcel: " + e.getMessage());
        }
    }

    // Get all parcels
    @GetMapping("/all")
    public ResponseEntity<List<Parcel>> getAllParcels() {
        List<Parcel> parcels = parcelRepository.findAll();
        return ResponseEntity.ok(parcels);
    }

    //  Get parcel by tracking ID
    @GetMapping("/track/{trackingId}")
    public ResponseEntity<?> trackParcel(@PathVariable String trackingId) {
        Optional<Parcel> parcel = parcelRepository.findByTrackingId(trackingId);
        if (parcel.isPresent()) {
            return ResponseEntity.ok(parcel.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Parcel not found with tracking ID: " + trackingId);
        }
    }

    //  Update parcel details
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateParcel(@PathVariable Long id, @RequestBody Parcel updatedParcel) {
        return parcelRepository.findById(id).map(parcel -> {
            String oldStatus = parcel.getStatus();
            
            // Update parcel details
            parcel.setSenderName(updatedParcel.getSenderName());
            parcel.setSenderEmail(updatedParcel.getSenderEmail());
            parcel.setSenderPhone(updatedParcel.getSenderPhone());
            parcel.setSenderAddress(updatedParcel.getSenderAddress());
            
            parcel.setRecipientName(updatedParcel.getRecipientName());
            parcel.setRecipientEmail(updatedParcel.getRecipientEmail());
            parcel.setRecipientPhone(updatedParcel.getRecipientPhone());
            parcel.setRecipientAddress(updatedParcel.getRecipientAddress());
            
            parcel.setDescription(updatedParcel.getDescription());
            parcel.setWeight(updatedParcel.getWeight());
            parcel.setDimensions(updatedParcel.getDimensions());
            parcel.setCategory(updatedParcel.getCategory());
            parcel.setValue(updatedParcel.getValue());
            parcel.setCurrentLocation(updatedParcel.getCurrentLocation());
            parcel.setNotes(updatedParcel.getNotes());
            parcel.setPriority(updatedParcel.getPriority());
            parcel.setServiceType(updatedParcel.getServiceType());
            
            // Update status and send notification if status changed
            if (updatedParcel.getStatus() != null && !updatedParcel.getStatus().equals(oldStatus)) {
                parcel.setStatus(updatedParcel.getStatus());
                try {
                    notificationService.sendStatusUpdateNotification(parcel, oldStatus);
                } catch (Exception e) {
                    System.err.println("Failed to send status update notification: " + e.getMessage());
                }
            }
            
            parcel.setUpdatedAt(LocalDateTime.now());
            parcelRepository.save(parcel);
            
            return ResponseEntity.ok("Parcel updated successfully!");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parcel not found!"));
    }

    //  Update parcel status only
    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateParcelStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        return parcelRepository.findById(id).map(parcel -> {
            String oldStatus = parcel.getStatus();
            String newStatus = statusUpdate.get("status");
            String location = statusUpdate.get("currentLocation");
            String notes = statusUpdate.get("notes");
            
            parcel.setStatus(newStatus);
            if (location != null) parcel.setCurrentLocation(location);
            if (notes != null) parcel.setNotes(notes);
            parcel.setUpdatedAt(LocalDateTime.now());
            
            parcelRepository.save(parcel);
            
            // Send notification about status change
            try {
                notificationService.sendStatusUpdateNotification(parcel, oldStatus);
            } catch (Exception e) {
                System.err.println("Failed to send status update notification: " + e.getMessage());
            }
            
            return ResponseEntity.ok("Parcel status updated successfully!");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parcel not found!"));
    }

    //  Delete parcel
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteParcel(@PathVariable Long id) {
        if (!parcelRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parcel not found!");
        }
        parcelRepository.deleteById(id);
        return ResponseEntity.ok("Parcel deleted successfully!");
    }

    //  Get parcels by user email (sender or recipient)
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Parcel>> getParcelsByUserEmail(@PathVariable String email) {
        List<Parcel> parcels = parcelRepository.findByUserEmail(email);
        return ResponseEntity.ok(parcels);
    }

    //  Get parcels by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Parcel>> getParcelsByStatus(@PathVariable String status) {
        List<Parcel> parcels = parcelRepository.findByStatus(status);
        return ResponseEntity.ok(parcels);
    }

    // Get parcel statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getParcelStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalParcels", parcelRepository.count());
        stats.put("registered", parcelRepository.countByStatus("REGISTERED"));
        stats.put("inTransit", parcelRepository.countByStatus("IN_TRANSIT"));
        stats.put("outForDelivery", parcelRepository.countByStatus("OUT_FOR_DELIVERY"));
        stats.put("delivered", parcelRepository.countByStatus("DELIVERED"));
        stats.put("returned", parcelRepository.countByStatus("RETURNED"));
        
        return ResponseEntity.ok(stats);
    }

    //  Get recent parcels
    @GetMapping("/recent")
    public ResponseEntity<List<Parcel>> getRecentParcels() {
        List<Parcel> recentParcels = parcelRepository.findRecentParcels();
        return ResponseEntity.ok(recentParcels);
    }

    // Helper method to generate tracking ID
    private String generateTrackingId() {
        String prefix = "TRK";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = String.valueOf((int)(Math.random() * 1000));
        return prefix + timestamp.substring(timestamp.length() - 8) + random;
    }
}