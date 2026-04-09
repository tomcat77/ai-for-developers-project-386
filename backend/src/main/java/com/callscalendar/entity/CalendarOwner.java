package com.callscalendar.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "calendar_owners")
@Data
public class CalendarOwner {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String contact;
}