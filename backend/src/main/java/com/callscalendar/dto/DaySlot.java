package com.callscalendar.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.Instant;

@Data
public class DaySlot {
    private Instant startTime;
    private Instant endTime;
    @JsonProperty("isAvailable")
    private boolean isAvailable;
    
    public DaySlot(Instant startTime, Instant endTime, boolean isAvailable) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.isAvailable = isAvailable;
    }
}