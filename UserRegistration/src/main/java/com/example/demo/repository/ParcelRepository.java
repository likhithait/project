package com.example.demo.repository;

import com.example.demo.model.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    
    // Find parcel by tracking ID
    Optional<Parcel> findByTrackingId(String trackingId);
    
    // Find parcels by status
    List<Parcel> findByStatus(String status);
    
    // Find parcels by sender or recipient email
    @Query("SELECT p FROM Parcel p WHERE p.senderEmail = :email OR p.recipientEmail = :email")
    List<Parcel> findByUserEmail(@Param("email") String email);
    
    // Find parcels by sender email
    List<Parcel> findBySenderEmail(String senderEmail);
    
    // Find parcels by recipient email
    List<Parcel> findByRecipientEmail(String recipientEmail);
    
    // Count parcels by status
    @Query("SELECT COUNT(p) FROM Parcel p WHERE p.status = :status")
    Long countByStatus(@Param("status") String status);
    
    // Find recent parcels (last 10) - Fixed for different databases
    @Query(value = "SELECT * FROM parcels ORDER BY created_at DESC LIMIT 10", nativeQuery = true)
    List<Parcel> findRecentParcels();
    
    // Find parcels created between dates
    @Query("SELECT p FROM Parcel p WHERE p.createdAt BETWEEN :startDate AND :endDate ORDER BY p.createdAt DESC")
    List<Parcel> findParcelsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    // Find parcels by priority
    List<Parcel> findByPriority(String priority);
    
    // Find parcels by service type
    List<Parcel> findByServiceType(String serviceType);
    
    // Find parcels by category
    List<Parcel> findByCategory(String category);
    
    // Find delivered parcels in date range
    @Query("SELECT p FROM Parcel p WHERE p.status = 'DELIVERED' AND p.deliveredAt BETWEEN :startDate AND :endDate")
    List<Parcel> findDeliveredParcelsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    // Find parcels pending delivery (registered, in_transit, out_for_delivery)
    @Query("SELECT p FROM Parcel p WHERE p.status IN ('REGISTERED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY')")
    List<Parcel> findPendingParcels();
    
    // Find parcels by current location
    List<Parcel> findByCurrentLocationContainingIgnoreCase(String location);
    
    // Search parcels by tracking ID pattern
    List<Parcel> findByTrackingIdContainingIgnoreCase(String trackingIdPattern);
    
    // Search parcels by sender name
    List<Parcel> findBySenderNameContainingIgnoreCase(String senderName);
    
    // Search parcels by recipient name
    List<Parcel> findByRecipientNameContainingIgnoreCase(String recipientName);
    
    // Find high priority parcels that are not delivered
    @Query("SELECT p FROM Parcel p WHERE p.priority IN ('HIGH', 'URGENT') AND p.status != 'DELIVERED' ORDER BY p.createdAt ASC")
    List<Parcel> findHighPriorityPendingParcels();
    
    // Find parcels that need attention (stuck in transit for too long)
    @Query("SELECT p FROM Parcel p WHERE p.status = 'IN_TRANSIT' AND p.updatedAt < :cutoffDate ORDER BY p.updatedAt ASC")
    List<Parcel> findParcelsNeedingAttention(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    // Get delivery statistics for a date range - Fixed query
    @Query("SELECT p.status, COUNT(p) FROM Parcel p WHERE p.createdAt BETWEEN :startDate AND :endDate GROUP BY p.status")
    List<Object[]> getDeliveryStatistics(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    // Find parcels by weight range - Simplified and fixed
    @Query("SELECT p FROM Parcel p WHERE CAST(REPLACE(p.weight, ' kg', '') AS double) BETWEEN :minWeight AND :maxWeight")
    List<Parcel> findParcelsByWeightRange(@Param("minWeight") double minWeight, 
                                        @Param("maxWeight") double maxWeight);
    
    // Find fragile parcels
    List<Parcel> findByIsFragileTrue();
    
    // Find parcels requiring signature
    List<Parcel> findByRequiresSignatureTrue();
    
    // Custom query to find parcels with multiple delivery attempts - Fixed
    @Query("SELECT p FROM Parcel p WHERE CAST(p.deliveryAttempts AS int) > :attempts")
    List<Parcel> findParcelsWithMultipleAttempts(@Param("attempts") int attempts);
    
    // Find parcels by value range - Simplified and fixed
    @Query("SELECT p FROM Parcel p WHERE CAST(REPLACE(p.value, '$', '') AS double) BETWEEN :minValue AND :maxValue")
    List<Parcel> findParcelsByValueRange(@Param("minValue") double minValue, 
                                       @Param("maxValue") double maxValue);
    
    // FIXED: Find overdue parcels - Completely rewritten to work properly
//    @Query("SELECT p FROM Parcel p WHERE p.estimatedDeliveryDate IS NOT NULL AND " +
//    	       "p.estimatedDeliveryDate < :now AND p.status != 'DELIVERED'")
//    List<Parcel> findOverdueParcels(@Param("now") LocalDateTime now);

    
    // Dashboard statistics query - Simplified for better compatibility
    @Query("SELECT " +
           "COUNT(p), " +
           "SUM(CASE WHEN p.status = 'REGISTERED' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN p.status = 'IN_TRANSIT' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN p.status = 'OUT_FOR_DELIVERY' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN p.status = 'DELIVERED' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN p.status = 'RETURNED' THEN 1 ELSE 0 END) " +
           "FROM Parcel p")
    Object[] getDashboardStatistics();
    
    // Find parcels created today - Using native query for better compatibility
    @Query(value = "SELECT * FROM parcels WHERE DATE(created_at) = CURRENT_DATE ORDER BY created_at DESC", nativeQuery = true)
    List<Parcel> findTodaysParcels();
    
    // Find parcels delivered today - Using native query for better compatibility
    @Query(value = "SELECT * FROM parcels WHERE status = 'DELIVERED' AND DATE(delivered_at) = CURRENT_DATE ORDER BY delivered_at DESC", nativeQuery = true)
    List<Parcel> findTodaysDeliveries();
    
    // Search functionality - comprehensive search
    @Query("SELECT p FROM Parcel p WHERE " +
           "LOWER(p.trackingId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.senderName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.recipientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.senderEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.recipientEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.currentLocation) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Parcel> searchParcels(@Param("searchTerm") String searchTerm);
}