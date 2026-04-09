package com.callscalendar.repository;

import com.callscalendar.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    
    List<Booking> findByStartTimeBetween(Instant start, Instant end);
    
    List<Booking> findByStartTimeGreaterThanEqual(Instant start);
}