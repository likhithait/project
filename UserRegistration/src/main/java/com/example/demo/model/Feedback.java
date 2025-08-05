package com.example.demo.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "parcel_feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail; // Email of the user giving feedback

    @Column(nullable = false)
    private String trackingId; // Tracking ID of the delivered parcel

    @Column(nullable = false)
    private Integer rating; // Rating from 1 to 5

    @Column(length = 1000)
    private String remarks; // Optional feedback remarks

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Many-to-one relationship with Parcel (optional for reference)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id")
    @JsonIgnore // Prevent infinite recursion in JSON serialization
    private Parcel parcel;

    // Constructors
    public Feedback() {
        this.createdAt = LocalDateTime.now();
    }

    public Feedback(String userEmail, String trackingId, Integer rating, String remarks) {
        this();
        this.userEmail = userEmail;
        this.trackingId = trackingId;
        this.rating = rating;
        this.remarks = remarks;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Parcel getParcel() {
        return parcel;
    }

    public void setParcel(Parcel parcel) {
        this.parcel = parcel;
    }

    // Utility methods
    public boolean isHighRating() {
        return rating != null && rating >= 4;
    }

    public boolean isLowRating() {
        return rating != null && rating <= 2;
    }

    public boolean hasRemarks() {
        return remarks != null && !remarks.trim().isEmpty();
    }

    @Override
    public String toString() {
        return "Feedback{" +
                "id=" + id +
                ", userEmail='" + userEmail + '\'' +
                ", trackingId='" + trackingId + '\'' +
                ", rating=" + rating +
                ", createdAt=" + createdAt +
                '}';
    }
}