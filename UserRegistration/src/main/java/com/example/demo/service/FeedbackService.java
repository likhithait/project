package com.example.demo.service;

import com.example.demo.model.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.format.DateTimeFormatter;

@Service
public class FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    /**
     * Send feedback email to admin
     */
    public void sendFeedbackToAdmin(Feedback feedback) {
        logger.info("Starting to send feedback to admin from: {} ({})", feedback.getName(), feedback.getEmail());
        
        try {
            // Check if email service is available
            if (mailSender == null) {
                logger.error("JavaMailSender is not configured! Check your email configuration in application.properties");
                throw new RuntimeException("Email service is not configured");
            }

            logger.info("JavaMailSender is available, proceeding with feedback email...");

            // Validate feedback data
            validateFeedback(feedback);

            logger.info("Feedback validated. Preparing email to admin: {}", adminEmail);

            // Build email content
            String subject = buildEmailSubject(feedback);
            String message = buildFeedbackEmailContent(feedback);

            // Send email to admin
            sendEmailToAdmin(subject, message, feedback.getEmail());

            logger.info("Feedback email sent successfully to admin from: {}", feedback.getEmail());
            
        } catch (Exception e) {
            logger.error("Failed to send feedback email from: {} to admin", feedback.getEmail(), e);
            throw new RuntimeException("Failed to send feedback email: " + e.getMessage(), e);
        }
    }

    /**
     * Send email to admin
     */
    private void sendEmailToAdmin(String subject, String message, String replyToEmail) {
        try {
            logger.info("Composing email to admin: {}", adminEmail);
            
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(adminEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailMessage.setFrom(adminEmail); // Send from admin email
            mailMessage.setReplyTo(replyToEmail); // Set reply-to as user's email
            
            logger.info("Email message prepared, sending to admin...");
            mailSender.send(mailMessage);
            logger.info("Feedback email sent successfully to admin: {}", adminEmail);
                
        } catch (Exception e) {
            logger.error("Failed to send feedback email to admin: {}", adminEmail, e);
            throw new RuntimeException("Failed to send email to admin", e);
        }
    }

    /**
     * Build email subject
     */
    private String buildEmailSubject(Feedback feedback) {
        StringBuilder subject = new StringBuilder();
        
        // Add priority indicator
        if (feedback.isHighPriority()) {
            subject.append("🚨 HIGH PRIORITY - ");
        } else if ("COMPLAINT".equalsIgnoreCase(feedback.getFeedbackType())) {
            subject.append("⚠️ COMPLAINT - ");
        } else {
            subject.append("📧 ");
        }
        
        // Add feedback type if available
        if (feedback.getFeedbackType() != null && !feedback.getFeedbackType().trim().isEmpty()) {
            subject.append(feedback.getFeedbackType().toUpperCase()).append(" - ");
        }
        
        // Add custom subject or default
        if (feedback.getSubject() != null && !feedback.getSubject().trim().isEmpty()) {
            subject.append(feedback.getSubject());
        } else {
            subject.append("New Feedback from ").append(feedback.getName());
        }
        
        return subject.toString();
    }

    /**
     * Build simple feedback email content with only email and message
     */
    private String buildFeedbackEmailContent(Feedback feedback) {
        StringBuilder content = new StringBuilder();
        
        // User email
        content.append("From: ").append(feedback.getEmail()).append("\n\n");
        
        // Feedback message
        content.append("Message:\n");
        content.append(feedback.getMessage());
        
        return content.toString();
    }

    /**
     * Format feedback type for display
     */
    private String formatFeedbackType(String type) {
        if (type == null) return "General";
        
        switch (type.toUpperCase()) {
            case "COMPLAINT": return "🔴 Complaint";
            case "SUGGESTION": return "💡 Suggestion";
            case "COMPLIMENT": return "👍 Compliment";
            case "QUESTION": return "❓ Question";
            case "BUG_REPORT": return "🐛 Bug Report";
            case "FEATURE_REQUEST": return "✨ Feature Request";
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
     * Validate feedback data
     */
    private void validateFeedback(Feedback feedback) {
        if (feedback == null) {
            throw new IllegalArgumentException("Feedback cannot be null");
        }
        
        if (feedback.getName() == null || feedback.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Feedback name is required");
        }
        
        if (feedback.getEmail() == null || feedback.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Feedback email is required");
        }
        
        if (feedback.getMessage() == null || feedback.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Feedback message is required");
        }
        
        // Validate email format
        if (!feedback.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        logger.info("Feedback validation passed for: {}", feedback.getEmail());
    }

    /**
     * Test feedback email configuration
     */
    public void testFeedbackEmailConfiguration() {
        logger.info("Testing feedback email configuration...");
        
        if (mailSender == null) {
            logger.error("JavaMailSender is NULL! Feedback email configuration failed.");
            throw new RuntimeException("Email service not configured");
        }
        
        try {
            // Create test feedback
            Feedback testFeedback = new Feedback();
            testFeedback.setName("System Test");
            testFeedback.setEmail("system@test.com");
            testFeedback.setSubject("Email Configuration Test");
            testFeedback.setMessage("This is a test feedback to verify email configuration is working properly.");
            testFeedback.setFeedbackType("SYSTEM_TEST");
            testFeedback.setPriority("LOW");
            
            // Send test email
            String subject = "🔧 System Test - Feedback Email Configuration";
            String message = buildFeedbackEmailContent(testFeedback);
            
            SimpleMailMessage testMessage = new SimpleMailMessage();
            testMessage.setTo(adminEmail);
            testMessage.setSubject(subject);
            testMessage.setText(message);
            testMessage.setFrom(adminEmail);
            testMessage.setReplyTo("system@test.com");
            
            mailSender.send(testMessage);
            logger.info("Test feedback email sent successfully to admin!");
            
        } catch (Exception e) {
            logger.error("Test feedback email failed!", e);
            throw new RuntimeException("Feedback email test failed: " + e.getMessage(), e);
        }
    }
}