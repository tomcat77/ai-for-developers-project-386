package com.callscalendar.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class AvailableSlot {
    private Instant startTime;
    private Instant endTime;
    
    public AvailableSlot(Instant startTime, Instant endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
}