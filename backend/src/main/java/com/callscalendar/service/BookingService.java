package com.callscalendar.service;

import com.callscalendar.dto.DaySlot;
import com.callscalendar.dto.CreateBookingRequest;
import com.callscalendar.entity.Booking;
import com.callscalendar.entity.EventType;
import com.callscalendar.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final EventTypeService eventTypeService;
    
    private static final int WORKING_HOUR_START = 9;
    private static final int WORKING_HOUR_END = 18;
    private static final int SLOT_MINUTES = 30;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public List<Booking> getUpcomingBookings() {
        return bookingRepository.findByStartTimeGreaterThanEqual(Instant.now());
    }
    
    public Booking createBooking(CreateBookingRequest request) {
        EventType eventType = eventTypeService.getEventTypeById(request.getEventTypeId());
        
        Instant startTime = request.getStartTime();
        Instant endTime = startTime.plus(Duration.ofMinutes(eventType.getDurationMinutes()));
        
        checkForConflicts(startTime, endTime);
        
        Booking booking = new Booking();
        booking.setId(UUID.randomUUID().toString());
        booking.setEventTypeId(request.getEventTypeId());
        booking.setStartTime(startTime);
        booking.setGuestName(request.getGuestName());
        booking.setGuestContact(request.getGuestContact());
        
        return bookingRepository.save(booking);
    }
    
    public List<DaySlot> getDaySlots(String eventTypeId, String dateStr) {
        EventType eventType = eventTypeService.getEventTypeById(eventTypeId);
        LocalDate date = LocalDate.parse(dateStr);
        
        Instant dayStart = date.atTime(WORKING_HOUR_START, 0).toInstant(ZoneOffset.UTC);
        Instant dayEnd = date.atTime(WORKING_HOUR_END, 0).toInstant(ZoneOffset.UTC);
        
        List<Booking> existingBookings = bookingRepository.findByStartTimeBetween(dayStart, dayEnd);
        
        List<DaySlot> slots = new ArrayList<>();
        Instant current = dayStart;
        
        while (current.plus(Duration.ofMinutes(eventType.getDurationMinutes())).isBefore(dayEnd) ||
               current.plus(Duration.ofMinutes(eventType.getDurationMinutes())).equals(dayEnd)) {
            
            final Instant slotStart = current;
            final Instant slotEnd = current.plus(Duration.ofMinutes(eventType.getDurationMinutes()));
            
            boolean hasConflict = existingBookings.stream().anyMatch(b -> 
                timesOverlap(slotStart, slotEnd, b.getStartTime(), b.getStartTime().plus(
                    Duration.ofMinutes(eventTypeService.getEventTypeById(b.getEventTypeId()).getDurationMinutes()))
                )
            );
            
            slots.add(new DaySlot(current, slotEnd, !hasConflict));
            
            current = current.plus(Duration.ofMinutes(SLOT_MINUTES));
        }
        
        return slots;
    }
    
    private void checkForConflicts(Instant start, Instant end) {
        List<Booking> existingBookings = bookingRepository.findAll();
        
        for (Booking booking : existingBookings) {
            EventType et = eventTypeService.getEventTypeById(booking.getEventTypeId());
            Instant bookingEnd = booking.getStartTime().plus(Duration.ofMinutes(et.getDurationMinutes()));
            
            if (timesOverlap(start, end, booking.getStartTime(), bookingEnd)) {
                throw new ConflictException("На это время уже есть запись");
            }
        }
    }
    
    private boolean timesOverlap(Instant start1, Instant end1, Instant start2, Instant end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }
    
    public static class ConflictException extends RuntimeException {
        public ConflictException(String message) {
            super(message);
        }
    }
}