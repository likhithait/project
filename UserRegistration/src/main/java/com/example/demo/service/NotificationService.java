package com.example.demo.service;

import com.example.demo.model.Parcel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.format.DateTimeFormatter;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    /**
     * Send notification when a new parcel is registered
     */
    public void sendParcelRegisteredNotification(Parcel parcel) {
        logger.info("Starting to send registration notification for parcel: {}", parcel.getTrackingId());
        
        try {
            // Check if email service is available
            if (mailSender == null) {
                logger.error("JavaMailSender is not configured! Check your email configuration in application.properties");
                return;
            }

            logger.info("JavaMailSender is available, proceeding with email sending...");

            // Validate email addresses
            if (!isValidEmail(parcel.getSenderEmail()) || !isValidEmail(parcel.getRecipientEmail())) {
                logger.error("Invalid email addresses - Sender: {}, Recipient: {}", 
                    parcel.getSenderEmail(), parcel.getRecipientEmail());
                return;
            }

            logger.info("Email addresses validated. Sender: {}, Recipient: {}", 
                parcel.getSenderEmail(), parcel.getRecipientEmail());

            // Send email to recipient
            sendEmailToRecipient(parcel, 
                "New Parcel Shipped to You - Tracking ID: " + parcel.getTrackingId(), 
                buildRecipientNotificationMessage(parcel));

            // Send confirmation to sender
            sendEmailToSender(parcel, "Parcel Registration Confirmed - " + parcel.getTrackingId(), 
                buildSenderConfirmationMessage(parcel));

            logger.info("Registration notifications sent successfully for parcel: {}", parcel.getTrackingId());
        } catch (Exception e) {
            logger.error("Failed to send registration notifications for parcel: {}", parcel.getTrackingId(), e);
            // Print stack trace for debugging
            e.printStackTrace();
        }
    }

    /**
     * Send email to recipient
     */
    private void sendEmailToRecipient(Parcel parcel, String subject, String message) {
        try {
            logger.info("Sending email to recipient: {}", parcel.getRecipientEmail());
            
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(parcel.getRecipientEmail());
            mailMessage.setSubject(subject);
            mailMessage.setText(buildFullEmailMessage(parcel.getRecipientName(), message));
            mailMessage.setFrom("sahithachunduri0@gmail.com"); // Use your configured email
            
            logger.info("Email message prepared, sending...");
            mailSender.send(mailMessage);
            logger.info("Email sent successfully to recipient: {}", parcel.getRecipientEmail());
                
        } catch (Exception e) {
            logger.error("Failed to send email to recipient: {}", parcel.getRecipientEmail(), e);
            e.printStackTrace();
        }
    }

    /**
     * Send email to sender
     */
    private void sendEmailToSender(Parcel parcel, String subject, String message) {
        try {
            logger.info("Sending confirmation email to sender: {}", parcel.getSenderEmail());
            
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(parcel.getSenderEmail());
            mailMessage.setSubject(subject);
            mailMessage.setText(buildFullEmailMessage(parcel.getSenderName(), message));
            mailMessage.setFrom("sahithachunduri0@gmail.com");

            mailSender.send(mailMessage);
            logger.info("Confirmation email sent successfully to sender: {}", parcel.getSenderEmail());
        } catch (Exception e) {
            logger.error("Failed to send confirmation email to sender: {}", parcel.getSenderEmail(), e);
            e.printStackTrace();
        }
    }

    /**
     * Send notification when parcel status is updated
     */
    public void sendStatusUpdateNotification(Parcel parcel, String oldStatus) {
        logger.info("Sending status update notification for parcel: {} (Status: {} -> {})", 
            parcel.getTrackingId(), oldStatus, parcel.getStatus());
        
        try {
            if (mailSender == null) {
                logger.error("JavaMailSender is not configured! Cannot send status update notification.");
                return;
            }

            String subject = "Parcel Status Update - " + parcel.getTrackingId();
            String recipientMessage = buildStatusUpdateMessage(parcel, oldStatus, true);
            String senderMessage = buildStatusUpdateMessage(parcel, oldStatus, false);

            // Send to recipient
            sendEmailToRecipient(parcel, subject, recipientMessage);
            
            // Send to sender
            sendEmailToSender(parcel, "Your " + subject, senderMessage);

            logger.info("Status update notifications sent for parcel: {}", parcel.getTrackingId());
        } catch (Exception e) {
            logger.error("Failed to send status update notifications for parcel: {}", parcel.getTrackingId(), e);
            e.printStackTrace();
        }
    }

    /**
     * Build full email message with proper formatting
     */
    private String buildFullEmailMessage(String recipientName, String message) {
        StringBuilder fullMessage = new StringBuilder();
        fullMessage.append("Dear ").append(recipientName).append(",\n\n");
        fullMessage.append(message);
        fullMessage.append("\n\nBest regards,\n");
        fullMessage.append("Parcel Tracking System\n");
        fullMessage.append("Email: sahithachunduri0@gmail.com");
        return fullMessage.toString();
    }

    /**
     * Validate email format
     */
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            logger.warn("Email is null or empty: {}", email);
            return false;
        }
        boolean isValid = email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
        if (!isValid) {
            logger.warn("Invalid email format: {}", email);
        }
        return isValid;
    }

    /**
     * Build recipient notification message
     */
    private String buildRecipientNotificationMessage(Parcel parcel) {
        StringBuilder message = new StringBuilder();
        
        message.append("You have received a new parcel shipment notification!\n\n");
        
        message.append("📦 PARCEL DETAILS:\n");
        message.append("═══════════════════\n");
        message.append("Tracking ID: ").append(parcel.getTrackingId()).append("\n");
        message.append("From: ").append(parcel.getSenderName()).append(" (").append(parcel.getSenderEmail()).append(")\n");
        message.append("Description: ").append(parcel.getDescription()).append("\n");
        message.append("Weight: ").append(parcel.getWeight()).append("\n");
        message.append("Dimensions: ").append(parcel.getDimensions()).append("\n");
        message.append("Service Type: ").append(parcel.getServiceType()).append("\n");
        message.append("Priority: ").append(parcel.getPriority()).append("\n");
        message.append("Shipped Date: ").append(parcel.getCreatedAt().format(formatter)).append("\n");
        message.append("Current Status: ").append(formatStatus(parcel.getStatus())).append("\n\n");

        message.append("📍 DELIVERY ADDRESS:\n");
        message.append("═══════════════════\n");
        message.append(parcel.getRecipientAddress()).append("\n\n");

        if (parcel.getDeliveryInstructions() != null && !parcel.getDeliveryInstructions().trim().isEmpty()) {
            message.append("📝 DELIVERY INSTRUCTIONS:\n");
            message.append("═══════════════════════\n");
            message.append(parcel.getDeliveryInstructions()).append("\n\n");
        }

        message.append("🔍 TRACKING:\n");
        message.append("═══════════\n");
        message.append("You can track this parcel using Tracking ID: ").append(parcel.getTrackingId()).append("\n");
        message.append("Please keep this tracking ID for future reference.\n\n");

        if (parcel.getRequiresSignature() != null && parcel.getRequiresSignature()) {
            message.append("⚠️ IMPORTANT: This parcel requires a signature upon delivery.\n\n");
        }

        if (parcel.getIsFragile() != null && parcel.getIsFragile()) {
            message.append("🚨 FRAGILE ITEM: Please handle with care.\n\n");
        }

        message.append("Thank you for using our parcel delivery service!");

        return message.toString();
    }

    /**
     * Build sender confirmation message
     */
    private String buildSenderConfirmationMessage(Parcel parcel) {
        StringBuilder message = new StringBuilder();
        
        message.append("Your parcel has been successfully registered in our system!\n\n");
        
        message.append("📦 REGISTRATION CONFIRMATION:\n");
        message.append("════════════════════════════\n");
        message.append("Tracking ID: ").append(parcel.getTrackingId()).append("\n");
        message.append("Recipient: ").append(parcel.getRecipientName()).append(" (").append(parcel.getRecipientEmail()).append(")\n");
        message.append("Description: ").append(parcel.getDescription()).append("\n");
        message.append("Service Type: ").append(parcel.getServiceType()).append("\n");
        message.append("Priority: ").append(parcel.getPriority()).append("\n");
        message.append("Registration Date: ").append(parcel.getCreatedAt().format(formatter)).append("\n\n");

        message.append("✉️ RECIPIENT NOTIFIED:\n");
        message.append("══════════════════\n");
        message.append("The recipient (").append(parcel.getRecipientEmail()).append(") has been automatically notified about this shipment.\n\n");

        message.append("🔍 TRACKING:\n");
        message.append("═══════════\n");
        message.append("You can track your parcel anytime using Tracking ID: ").append(parcel.getTrackingId()).append("\n");
        message.append("You'll receive email updates whenever the parcel status changes.\n\n");

        message.append("Thank you for choosing our parcel delivery service!");

        return message.toString();
    }

    /**
     * Build status update message
     */
    private String buildStatusUpdateMessage(Parcel parcel, String oldStatus, boolean isForRecipient) {
        StringBuilder message = new StringBuilder();
        
        if (isForRecipient) {
            message.append("Your parcel status has been updated!\n\n");
        } else {
            message.append("Your parcel status has been updated and the recipient has been notified.\n\n");
        }
        
        message.append("📦 STATUS UPDATE:\n");
        message.append("════════════════\n");
        message.append("Tracking ID: ").append(parcel.getTrackingId()).append("\n");
        message.append("Previous Status: ").append(formatStatus(oldStatus)).append("\n");
        message.append("Current Status: ").append(formatStatus(parcel.getStatus())).append("\n");
        message.append("Last Updated: ").append(parcel.getUpdatedAt().format(formatter)).append("\n");
        
        if (parcel.getCurrentLocation() != null && !parcel.getCurrentLocation().trim().isEmpty()) {
            message.append("Current Location: ").append(parcel.getCurrentLocation()).append("\n");
        }
        
        if (parcel.getNotes() != null && !parcel.getNotes().trim().isEmpty()) {
            message.append("Update Notes: ").append(parcel.getNotes()).append("\n");
        }

        message.append("\n");

        // Add specific messages based on status
        switch (parcel.getStatus()) {
            case "IN_TRANSIT":
                message.append("🚛 Your parcel is now on its way! Expected delivery within 2-5 business days.\n");
                break;
            case "OUT_FOR_DELIVERY":
                message.append("🎉 Great news! Your parcel is out for delivery and should arrive today.\n");
                break;
            case "DELIVERED":
                message.append("✅ Your parcel has been delivered successfully!\n");
                break;
            case "RETURNED":
                message.append("❌ Unfortunately, the parcel has been returned.\n");
                break;
        }

        message.append("\nThank you for using our parcel delivery service!");

        return message.toString();
    }

    /**
     * Format status for display
     */
    private String formatStatus(String status) {
        if (status == null) return "Unknown";
        
        switch (status) {
            case "REGISTERED": return "Registered (Preparing for shipment)";
            case "IN_TRANSIT": return "In Transit (On the way)";
            case "OUT_FOR_DELIVERY": return "Out for Delivery (Arriving today)";
            case "DELIVERED": return "Delivered (Successfully completed)";
            case "RETURNED": return "Returned (Sent back to sender)";
            default: return status;
        }
    }

    /**
     * Test email configuration
     */
    public void testEmailConfiguration() {
        logger.info("Testing email configuration...");
        
        if (mailSender == null) {
            logger.error("JavaMailSender is NULL! Email configuration failed.");
            return;
        }
        
        try {
            SimpleMailMessage testMessage = new SimpleMailMessage();
            testMessage.setTo("sahithachunduri0@gmail.com"); // Send test email to yourself
            testMessage.setSubject("Email Configuration Test");
            testMessage.setText("This is a test email to verify email configuration is working.");
            testMessage.setFrom("sahithachunduri0@gmail.com");
            
            mailSender.send(testMessage);
            logger.info("Test email sent successfully!");
        } catch (Exception e) {
            logger.error("Test email failed!", e);
            e.printStackTrace();
        }
    }
}