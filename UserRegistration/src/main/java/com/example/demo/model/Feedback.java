package com.example.demo.model;

import java.time.LocalDateTime;

/**
 * Feedback model for handling user feedback submissions
 * This is a simple DTO (Data Transfer Object) for feedback data
 */
public class Feedback {
    
    private String name;
    private String email;
    private String phone; // Optional field
    private String subject;
    private String message;
    private String feedbackType; // SUGGESTION, COMPLAINT, COMPLIMENT, QUESTION, etc.
    private String priority; // LOW, MEDIUM, HIGH
    private LocalDateTime submittedAt;
    
    // Default constructor
    public Feedback() {
        this.submittedAt = LocalDateTime.now();
        this.priority = "MEDIUM"; // Default priority
    }
    
    // Constructor with required fields
    public Feedback(String name, String email, String subject, String message) {
        this();
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }
    
    // Full constructor
    public Feedback(String name, String email, String phone, String subject, 
                   String message, String feedbackType, String priority) {
        this();
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.subject = subject;
        this.message = message;
        this.feedbackType = feedbackType;
        this.priority = priority;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getFeedbackType() {
        return feedbackType;
    }
    
    public void setFeedbackType(String feedbackType) {
        this.feedbackType = feedbackType;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    // Utility methods
    public boolean isHighPriority() {
        return "HIGH".equalsIgnoreCase(this.priority);
    }
    
    public boolean isComplaint() {
        return "COMPLAINT".equalsIgnoreCase(this.feedbackType);
    }
    
    public boolean hasPhoneNumber() {
        return phone != null && !phone.trim().isEmpty();
    }
    
    @Override
    public String toString() {
        return "Feedback{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", subject='" + subject + '\'' +
                ", feedbackType='" + feedbackType + '\'' +
                ", priority='" + priority + '\'' +
                ", submittedAt=" + submittedAt +
                ", messageLength=" + (message != null ? message.length() : 0) + " chars" +
                '}';
    }
}