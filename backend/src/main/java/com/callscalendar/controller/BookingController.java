package com.callscalendar.controller;

import com.callscalendar.dto.DaySlot;
import com.callscalendar.dto.CreateBookingRequest;
import com.callscalendar.entity.Booking;
import com.callscalendar.entity.EventType;
import com.callscalendar.service.BookingService;
import com.callscalendar.service.CalendarOwnerService;
import com.callscalendar.service.EventTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {
    
    private final EventTypeService eventTypeService;
    private final BookingService bookingService;
    private final CalendarOwnerService calendarOwnerService;
    
    @GetMapping("/event-types")
    public ResponseEntity<List<EventType>> getEventTypes() {
        return ResponseEntity.ok(eventTypeService.getAllEventTypes());
    }
    
    @GetMapping("/event-types/{id}")
    public ResponseEntity<EventType> getEventType(@PathVariable String id) {
        return ResponseEntity.ok(eventTypeService.getEventTypeById(id));
    }
    
    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody CreateBookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (BookingService.ConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new com.callscalendar.dto.ConflictError(e.getMessage()));
        }
    }
    
    @GetMapping("/bookings/day-slots")
    public ResponseEntity<List<DaySlot>> getDaySlots(
            @RequestParam String eventTypeId,
            @RequestParam String date) {
        return ResponseEntity.ok(bookingService.getDaySlots(eventTypeId, date));
    }
    
    @GetMapping("/owner")
    public ResponseEntity<?> getOwner() {
        return ResponseEntity.ok(calendarOwnerService.getOwner());
    }
}