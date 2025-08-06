package com.example.demo.repository;

import com.example.demo.model.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    
    /**
     * Find all support requests ordered by creation date (newest first)
     */
    List<SupportRequest> findAllByOrderByCreatedAtDesc();
    
    /**
     * Find support requests by user email ordered by creation date (newest first)
     */
    List<SupportRequest> findByEmailOrderByCreatedAtDesc(String email);
    
    /**
     * Find support requests by status
     */
    List<SupportRequest> findByStatusOrderByCreatedAtDesc(String status);
    
    /**
     * Find support requests by issue type
     */
    List<SupportRequest> findByIssueTypeOrderByCreatedAtDesc(String issueType);
    
    /**
     * Find support requests by priority
     */
    List<SupportRequest> findByPriorityOrderByCreatedAtDesc(String priority);
    
    /**
     * Find support requests created after a specific date
     */
    List<SupportRequest> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);
    
    /**
     * Find support requests by tracking ID (if related to a specific parcel)
     */
    List<SupportRequest> findByTrackingIdOrderByCreatedAtDesc(String trackingId);
    
    /**
     * Count total support requests
     */
    long count();
    
    /**
     * Count support requests by status
     */
    long countByStatus(String status);
    
    /**
     * Count support requests by email (to track how many requests a user has made)
     */
    long countByEmail(String email);
}