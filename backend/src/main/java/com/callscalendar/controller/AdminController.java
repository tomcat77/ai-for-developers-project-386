package com.callscalendar.controller;

import com.callscalendar.dto.CreateEventTypeRequest;
import com.callscalendar.entity.Booking;
import com.callscalendar.entity.EventType;
import com.callscalendar.service.BookingService;
import com.callscalendar.service.EventTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AdminController {
    
    private final EventTypeService eventTypeService;
    private final BookingService bookingService;
    
    @PostMapping("/event-types")
    public ResponseEntity<EventType> createEventType(
            @RequestHeader(value = "X-EventType-Id", required = false, defaultValue = "") String customId,
            @RequestBody CreateEventTypeRequest request) {
        
        String id = customId.isEmpty() ? request.getName().toUpperCase().replace(" ", "_") : customId;
        EventType created = eventTypeService.createEventType(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/event-types")
    public ResponseEntity<EventType> updateEventType(@RequestBody EventType eventType) {
        EventType updated = eventTypeService.updateEventType(eventType.getId(), eventType);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}
