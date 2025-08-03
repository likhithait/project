package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "parcels")
public class Parcel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String trackingId;
    
    // Sender Information
    @Column(nullable = false)
    private String senderName;
    
    @Column(nullable = false)
    private String senderEmail;
    
    @Column(nullable = false)
    private String senderPhone;
    
    @Column(nullable = false, length = 500)
    private String senderAddress;
    
    // Recipient Information
    @Column(nullable = false)
    private String recipientName;
    
    @Column(nullable = false)
    private String recipientEmail;
    
    @Column(nullable = false)
    private String recipientPhone;
    
    @Column(nullable = false, length = 500)
    private String recipientAddress;
    
    // Parcel Details
    @Column(nullable = false, length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String weight; // in kg
    
    @Column(nullable = false)
    private String dimensions; // LxWxH in cm
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private String value; // monetary value
    
    // Tracking Information
    @Column(nullable = false)
    private String status = "REGISTERED"; // REGISTERED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED
    
    private String currentLocation;
    
    @Column(length = 1000)
    private String notes;
    
    // Service Information
    @Column(nullable = false)
    private String priority = "NORMAL"; // LOW, NORMAL, HIGH, URGENT
    
    @Column(nullable = false)
    private String serviceType = "STANDARD"; // STANDARD, EXPRESS, OVERNIGHT
    
    // Timestamps
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    private LocalDateTime deliveredAt;
    
    // Additional fields for enhanced tracking
    private String estimatedDeliveryDate;
    private String deliveryAttempts = "0";
    private String packageSize; // SMALL, MEDIUM, LARGE, EXTRA_LARGE
    private Boolean isFragile = false;
    private Boolean requiresSignature = false;
    private String deliveryInstructions;
    
    // Constructors
    public Parcel() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Parcel(String senderName, String senderEmail, String senderPhone, String senderAddress,
                  String recipientName, String recipientEmail, String recipientPhone, String recipientAddress,
                  String description, String weight, String dimensions, String category, String value) {
        this();
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.senderPhone = senderPhone;
        this.senderAddress = senderAddress;
        this.recipientName = recipientName;
        this.recipientEmail = recipientEmail;
        this.recipientPhone = recipientPhone;
        this.recipientAddress = recipientAddress;
        this.description = description;
        this.weight = weight;
        this.dimensions = dimensions;
        this.category = category;
        this.value = value;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTrackingId() {
        return trackingId;
    }
    
    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }
    
    public String getSenderName() {
        return senderName;
    }
    
    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
    
    public String getSenderEmail() {
        return senderEmail;
    }
    
    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }
    
    public String getSenderPhone() {
        return senderPhone;
    }
    
    public void setSenderPhone(String senderPhone) {
        this.senderPhone = senderPhone;
    }
    
    public String getSenderAddress() {
        return senderAddress;
    }
    
    public void setSenderAddress(String senderAddress) {
        this.senderAddress = senderAddress;
    }
    
    public String getRecipientName() {
        return recipientName;
    }
    
    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }
    
    public String getRecipientEmail() {
        return recipientEmail;
    }
    
    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
    
    public String getRecipientPhone() {
        return recipientPhone;
    }
    
    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }
    
    public String getRecipientAddress() {
        return recipientAddress;
    }
    
    public void setRecipientAddress(String recipientAddress) {
        this.recipientAddress = recipientAddress;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getWeight() {
        return weight;
    }
    
    public void setWeight(String weight) {
        this.weight = weight;
    }
    
    public String getDimensions() {
        return dimensions;
    }
    
    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getValue() {
        return value;
    }
    
    public void setValue(String value) {
        this.value = value;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
        if ("DELIVERED".equals(status)) {
            this.deliveredAt = LocalDateTime.now();
        }
    }
    
    public String getCurrentLocation() {
        return currentLocation;
    }
    
    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public String getServiceType() {
        return serviceType;
    }
    
    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }
    
    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
    
    public String getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }
    
    public void setEstimatedDeliveryDate(String estimatedDeliveryDate) {
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }
    
    public String getDeliveryAttempts() {
        return deliveryAttempts;
    }
    
    public void setDeliveryAttempts(String deliveryAttempts) {
        this.deliveryAttempts = deliveryAttempts;
    }
    
    public String getPackageSize() {
        return packageSize;
    }
    
    public void setPackageSize(String packageSize) {
        this.packageSize = packageSize;
    }
    
    public Boolean getIsFragile() {
        return isFragile;
    }
    
    public void setIsFragile(Boolean isFragile) {
        this.isFragile = isFragile;
    }
    
    public Boolean getRequiresSignature() {
        return requiresSignature;
    }
    
    public void setRequiresSignature(Boolean requiresSignature) {
        this.requiresSignature = requiresSignature;
    }
    
    public String getDeliveryInstructions() {
        return deliveryInstructions;
    }
    
    public void setDeliveryInstructions(String deliveryInstructions) {
        this.deliveryInstructions = deliveryInstructions;
    }
    
    // Utility methods
    public boolean isDelivered() {
        return "DELIVERED".equals(this.status);
    }
    
    public boolean isInTransit() {
        return "IN_TRANSIT".equals(this.status);
    }
    
    public boolean isOutForDelivery() {
        return "OUT_FOR_DELIVERY".equals(this.status);
    }
    
    public boolean isReturned() {
        return "RETURNED".equals(this.status);
    }
    
    @Override
    public String toString() {
        return "Parcel{" +
                "id=" + id +
                ", trackingId='" + trackingId + '\'' +
                ", senderName='" + senderName + '\'' +
                ", recipientName='" + recipientName + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}