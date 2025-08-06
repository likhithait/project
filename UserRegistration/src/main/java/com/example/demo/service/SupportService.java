package com.example.demo.service;

import com.example.demo.model.SupportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class SupportService {

    private static final Logger logger = LoggerFactory.getLogger(SupportService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    /**
     * Send support request email to admin
     */
    public void sendSupportRequest(SupportRequest supportRequest) {
        logger.info("Starting to send support request from: {} ({})", 
            supportRequest.getName(), supportRequest.getEmail());
        
        try {
            // Check if email service is available
            if (mailSender == null) {
                logger.error("JavaMailSender is not configured! Check your email configuration in application.properties");
                throw new RuntimeException("Email service is not configured");
            }

            logger.info("JavaMailSender is available, proceeding with support email...");

            // Validate support request data
            validateSupportRequest(supportRequest);

            logger.info("Support request validated. Preparing email to admin: {}", adminEmail);

            // Build email content
            String subject = buildSupportEmailSubject(supportRequest);
            String message = buildSupportEmailContent(supportRequest);

            // Send email to admin
            sendSupportEmailToAdmin(subject, message, supportRequest.getEmail());

            // Send confirmation email to user
            sendConfirmationEmailToUser(supportRequest);

            logger.info("Support request email sent successfully from: {}", supportRequest.getEmail());
            
        } catch (Exception e) {
            logger.error("Failed to send support request email from: {} to admin", 
                supportRequest.getEmail(), e);
            throw new RuntimeException("Failed to send support request: " + e.getMessage(), e);
        }
    }

    /**
     * Send support email to admin
     */
    private void sendSupportEmailToAdmin(String subject, String message, String replyToEmail) {
        try {
            logger.info("Composing support email to admin: {}", adminEmail);
            
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(adminEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailMessage.setFrom(adminEmail); // Send from admin email
            mailMessage.setReplyTo(replyToEmail); // Set reply-to as user's email
            
            logger.info("Support email message prepared, sending to admin...");
            mailSender.send(mailMessage);
            logger.info("Support email sent successfully to admin: {}", adminEmail);
                
        } catch (Exception e) {
            logger.error("Failed to send support email to admin: {}", adminEmail, e);
            throw new RuntimeException("Failed to send support email to admin", e);
        }
    }

    /**
     * Send confirmation email to user
     */
    private void sendConfirmationEmailToUser(SupportRequest supportRequest) {
        try {
            logger.info("Sending confirmation email to user: {}", supportRequest.getEmail());
            
            String subject = "Support Request Received - We'll Get Back to You Soon";
            String message = buildUserConfirmationMessage(supportRequest);
            
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(supportRequest.getEmail());
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailMessage.setFrom(adminEmail);
            
            mailSender.send(mailMessage);
            logger.info("Confirmation email sent successfully to user: {}", supportRequest.getEmail());
                
        } catch (Exception e) {
            logger.error("Failed to send confirmation email to user: {}", supportRequest.getEmail(), e);
            // Don't throw exception here as the main support email was sent
            logger.warn("Support request was processed but confirmation email failed");
        }
    }

    /**
     * Build support email subject
     */
    private String buildSupportEmailSubject(SupportRequest supportRequest) {
        StringBuilder subject = new StringBuilder();
        
        // Add priority indicator
        if ("HIGH".equalsIgnoreCase(supportRequest.getPriority())) {
            subject.append("🚨 HIGH PRIORITY - ");
        } else if ("URGENT".equalsIgnoreCase(supportRequest.getPriority())) {
            subject.append("⚠️ URGENT - ");
        } else {
            subject.append("📧 ");
        }
        
        // Add issue type if available
        if (supportRequest.getIssueType() != null && !supportRequest.getIssueType().trim().isEmpty()) {
            subject.append(supportRequest.getIssueType().toUpperCase()).append(" - ");
        }
        
        // Add subject or default
        if (supportRequest.getSubject() != null && !supportRequest.getSubject().trim().isEmpty()) {
            subject.append(supportRequest.getSubject());
        } else {
            subject.append("Support Request from ").append(supportRequest.getName());
        }
        
        return subject.toString();
    }

    /**
     * Build support email content for admin
     */
    private String buildSupportEmailContent(SupportRequest supportRequest) {
        StringBuilder content = new StringBuilder();
        
        content.append("NEW SUPPORT REQUEST\n");
        content.append("═══════════════════\n\n");
        
        // User Information
        content.append("👤 USER INFORMATION:\n");
        content.append("Name: ").append(supportRequest.getName()).append("\n");
        content.append("Email: ").append(supportRequest.getEmail()).append("\n");
        if (supportRequest.getPhone() != null && !supportRequest.getPhone().trim().isEmpty()) {
            content.append("Phone: ").append(supportRequest.getPhone()).append("\n");
        }
        content.append("Submitted: ").append(supportRequest.getCreatedAt().format(formatter)).append("\n\n");
        
        // Request Details
        content.append("📝 REQUEST DETAILS:\n");
        if (supportRequest.getIssueType() != null && !supportRequest.getIssueType().trim().isEmpty()) {
            content.append("Issue Type: ").append(formatIssueType(supportRequest.getIssueType())).append("\n");
        }
        if (supportRequest.getPriority() != null && !supportRequest.getPriority().trim().isEmpty()) {
            content.append("Priority: ").append(formatPriority(supportRequest.getPriority())).append("\n");
        }
        if (supportRequest.getSubject() != null && !supportRequest.getSubject().trim().isEmpty()) {
            content.append("Subject: ").append(supportRequest.getSubject()).append("\n");
        }
        content.append("\n");
        
        // Message
        content.append("💬 MESSAGE:\n");
        content.append("═══════════\n");
        content.append(supportRequest.getMessage()).append("\n\n");
        
        // Additional Info
        if (supportRequest.getTrackingId() != null && !supportRequest.getTrackingId().trim().isEmpty()) {
            content.append("📦 Related Tracking ID: ").append(supportRequest.getTrackingId()).append("\n\n");
        }
        
        content.append("═══════════════════\n");
        content.append("Please reply to this email to respond to the user.\n");
        content.append("User's email: ").append(supportRequest.getEmail());

        return content.toString();
    }

    /**
     * Build confirmation message for user
     */
    private String buildUserConfirmationMessage(SupportRequest supportRequest) {
        StringBuilder message = new StringBuilder();
        
        message.append("Dear ").append(supportRequest.getName()).append(",\n\n");
        
        message.append("Thank you for contacting RouteMax Support! We have received your support request and our team will get back to you soon.\n\n");
        
        message.append("📝 YOUR REQUEST DETAILS:\n");
        message.append("═══════════════════\n");
        message.append("Submitted: ").append(supportRequest.getCreatedAt().format(formatter)).append("\n");
        if (supportRequest.getSubject() != null && !supportRequest.getSubject().trim().isEmpty()) {
            message.append("Subject: ").append(supportRequest.getSubject()).append("\n");
        }
        if (supportRequest.getIssueType() != null && !supportRequest.getIssueType().trim().isEmpty()) {
            message.append("Issue Type: ").append(supportRequest.getIssueType()).append("\n");
        }
        message.append("\nYour Message:\n").append(supportRequest.getMessage()).append("\n\n");
        
        message.append("⏰ RESPONSE TIME:\n");
        message.append("═══════════════\n");
        if ("HIGH".equalsIgnoreCase(supportRequest.getPriority()) || "URGENT".equalsIgnoreCase(supportRequest.getPriority())) {
            message.append("Priority Level: High\n");
            message.append("Expected Response: Within 2-4 hours\n\n");
        } else {
            message.append("Priority Level: Normal\n");
            message.append("Expected Response: Within 24 hours\n\n");
        }
        
        message.append("Our support team will review your request and respond directly to this email address.\n\n");
        
        message.append("If you have any urgent concerns, please don't hesitate to reach out to us again.\n\n");
        
        message.append("Best regards,\n");
        message.append("RouteMax Support Team\n");
        message.append("Email: ").append(adminEmail);

        return message.toString();
    }

    /**
     * Format issue type for display
     */
    private String formatIssueType(String type) {
        if (type == null) return "General";
        
        switch (type.toUpperCase()) {
            case "TRACKING_ISSUE": return "🔍 Tracking Issue";
            case "DELIVERY_PROBLEM": return "📦 Delivery Problem";
            case "BILLING_QUESTION": return "💳 Billing Question";
            case "TECHNICAL_ISSUE": return "🔧 Technical Issue";
            case "ACCOUNT_HELP": return "👤 Account Help";
            case "COMPLAINT": return "😠 Complaint";
            case "SUGGESTION": return "💡 Suggestion";
            case "OTHER": return "❓ Other";
            default: return "📝 " + type;
        }
    }

    /**
     * Format priority for display
     */
    private String formatPriority(String priority) {
        if (priority == null) return "Medium";
        
        switch (priority.toUpperCase()) {
            case "HIGH": return "🔴 High";
            case "MEDIUM": return "🟡 Medium";
            case "LOW": return "🟢 Low";
            case "URGENT": return "🚨 Urgent";
            default: return priority;
        }
    }

    /**
     * Validate support request data
     */
    private void validateSupportRequest(SupportRequest supportRequest) {
        if (supportRequest == null) {
            throw new IllegalArgumentException("Support request cannot be null");
        }
        
        if (supportRequest.getName() == null || supportRequest.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        
        if (supportRequest.getEmail() == null || supportRequest.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (supportRequest.getMessage() == null || supportRequest.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Message is required");
        }
        
        // Validate email format
        if (!supportRequest.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        logger.info("Support request validation passed for: {}", supportRequest.getEmail());
    }
}