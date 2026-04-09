package com.callscalendar.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "event_types")
@Data
public class EventType {
    
    @Id
    @Column(length = 50)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private Integer durationMinutes;
    
    @Column(length = 7)
    private String color;
}