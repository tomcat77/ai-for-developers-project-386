package com.callscalendar.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class CreateBookingRequest {
    private String eventTypeId;
    private Instant startTime;
    private String guestName;
    private String guestContact;
}