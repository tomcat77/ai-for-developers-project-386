package com.callscalendar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(name = "event_type_id", nullable = false, length = 50)
    private String eventTypeId;
    
    @Column(name = "start_time", nullable = false)
    private Instant startTime;
    
    @Column(name = "guest_name", nullable = false)
    private String guestName;
    
    @Column(name = "guest_contact", nullable = false)
    private String guestContact;
}